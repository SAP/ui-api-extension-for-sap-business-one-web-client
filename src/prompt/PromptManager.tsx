import {
	AssistantMessage,
	ToolMessage,
	UserMessage
} from '@vscode/prompt-tsx';

import {
	BasePromptElementProps,
	Chunk,
	PrioritizedList,
	PromptElement,
	PromptElementProps,
	PromptMetadata,
	PromptPiece,
	PromptReference,
	PromptSizing,
	ToolCall
} from '@vscode/prompt-tsx';

import { ToolResult } from '@vscode/prompt-tsx/dist/base/promptElements';
import * as vscode from 'vscode';

const dummyCancellationTokenSource = new vscode.CancellationTokenSource();
const dummyCancellationToken: vscode.CancellationToken = dummyCancellationTokenSource.token;
const maxReferenceChars = 12000;

function disposeToolPromptResources(): void {
	dummyCancellationTokenSource.dispose();
}

// Captures one assistant response and the tool calls issued in that response.
interface ToolCallRound {
	response: string;
	toolCalls: vscode.LanguageModelToolCallPart[];
}

// Root props used by the top-level prompt element.
interface ToolUserProps extends BasePromptElementProps {
	request: vscode.ChatRequest;
	context: vscode.ChatContext;
	agentInstructions: string;
	toolCallRounds: ToolCallRound[];
	toolCallResults: Record<string, vscode.LanguageModelToolResult>;
}

// Serialized tool-call state stored in chat metadata.
interface ToolCallsMetadata {
    toolCallRounds: ToolCallRound[];
    toolCallResults: Record<string, vscode.LanguageModelToolResult>;
}

// Metadata envelope used to detect and replay historical tool calls.
interface TsxToolUserMetadata {
    toolCallsMetadata: ToolCallsMetadata;
}

// Captures tool call result metadata so it can be attached to prompt elements.
class ToolResultMetadata extends PromptMetadata {
	constructor(
		public toolCallId: string,
		public result: vscode.LanguageModelToolResult,
	) {
		super();
	}
}

// Props for rendering a sequence of tool-call rounds.
interface ToolCallsPromptElementProps extends BasePromptElementProps {
	toolCallRounds: ToolCallRound[];
	toolCallResults: Record<string, vscode.LanguageModelToolResult>;
	toolInvocationToken: vscode.ChatParticipantToolToken | undefined;
}

// Props for rendering a single tool-call result.
interface ToolResultPromptElementProps extends BasePromptElementProps {
	toolCall: vscode.LanguageModelToolCallPart;
	toolInvocationToken: vscode.ChatParticipantToolToken | undefined;
	toolCallResult: vscode.LanguageModelToolResult | undefined;
}

// Props for rendering prior chat turns with ordering priority.
interface HistoryPromptElementProps extends BasePromptElementProps {
	priority: number;
	context: vscode.ChatContext;
}

// Props for rendering a set of request references.
interface ReferencesPromptElementProps extends BasePromptElementProps {
	references: ReadonlyArray<vscode.ChatPromptReference>;
	excludeReferences?: boolean;
}

// Props for rendering one request reference entry.
interface ReferencePromptElementProps extends BasePromptElementProps {
	ref: vscode.ChatPromptReference;
	excludeReferences?: boolean;
}

type TagPromptElementProps = PromptElementProps<{
	name: string;
}>;

function isTsxToolUserMetadata(obj: unknown): obj is TsxToolUserMetadata {
	// If you change the metadata format, you would have to make this stricter or handle old objects in old ChatRequest metadata
	return !!obj &&
		!!(obj as TsxToolUserMetadata).toolCallsMetadata &&
		Array.isArray((obj as TsxToolUserMetadata).toolCallsMetadata.toolCallRounds);
}

function convertResponseToString(response: vscode.ChatResponseTurn): string {
	return response.response
		.map((r) => {
			if (r instanceof vscode.ChatResponseMarkdownPart) {
				return r.value.value;
			} else if (r instanceof vscode.ChatResponseAnchorPart) {
				if (r.value instanceof vscode.Uri) {
					return r.value.fsPath;
				} else {
					return r.value.uri.fsPath;
				}
			}
			return '';
		}).join('');
}

function truncateReferenceContent(content: string): string {
	if (content.length <= maxReferenceChars) {
		return content;
	}
	return `${content.slice(0, maxReferenceChars)}\n\n...[truncated ${content.length - maxReferenceChars} chars]`;
}

// Renders assistant tool-call messages and the matching tool-result messages.
class ToolCalls extends PromptElement<ToolCallsPromptElementProps, void> {
	async render(_state: void, _sizing: PromptSizing) {
		if (!this.props.toolCallRounds.length) {
			return undefined;
		}

		/// Note: for the GitHub copilot models, the final prompt must end with a non-tool-result UserMessage
		return <>
			{this.props.toolCallRounds.map(round => this.renderOneToolCallRound(round))}
			<UserMessage>Above is the result of calling one or more tools. The user cannot see the results, so you should explain them to the user if referencing them in your answer.</UserMessage>
		</>;
	}

	private renderOneToolCallRound(round: ToolCallRound) {
		const assistantToolCalls: ToolCall[] = round.toolCalls.map(tc => ({ type: 'function', function: { name: tc.name, arguments: JSON.stringify(tc.input) }, id: tc.callId }));
		return (
			<Chunk>
				<AssistantMessage toolCalls={assistantToolCalls}>{round.response}</AssistantMessage>
				{round.toolCalls.map(toolCall =>
					<ToolResultElement toolCall={toolCall} toolInvocationToken={this.props.toolInvocationToken} toolCallResult={this.props.toolCallResults[toolCall.callId]} />)}
			</Chunk>);
	}
}

// Resolves and renders a single tool result, using cache when available.
class ToolResultElement extends PromptElement<ToolResultPromptElementProps, void> {
	async render(_state: void, sizing: PromptSizing): Promise<PromptPiece | undefined> {
		const tool = vscode.lm.tools.find(t => t.name === this.props.toolCall.name);
		if (!tool) {
			return <ToolMessage toolCallId={this.props.toolCall.callId}>Tool not found</ToolMessage>;
		}

		const tokenizationOptions: vscode.LanguageModelToolTokenizationOptions = {
			tokenBudget: sizing.tokenBudget,
			countTokens: (content: string) => Promise.resolve(sizing.countTokens(content)),
		};

		const toolResult = this.props.toolCallResult ??
			await vscode.lm.invokeTool(this.props.toolCall.name, { input: this.props.toolCall.input, toolInvocationToken: this.props.toolInvocationToken, tokenizationOptions }, dummyCancellationToken);

		return (
			<ToolMessage toolCallId={this.props.toolCall.callId}>
				<meta value={new ToolResultMetadata(this.props.toolCall.callId, toolResult)}></meta>
				<ToolResult data={toolResult} />
			</ToolMessage>
		);
	}
}

// Renders prior user/assistant turns, including replay of historical tool calls.
class ChatHistory extends PromptElement<HistoryPromptElementProps, void> {
	render(_state: void, _sizing: PromptSizing) {
		return (
			<PrioritizedList priority={this.props.priority} descending={false}>
				{this.props.context.history.map((message) => {
					if (message instanceof vscode.ChatRequestTurn) {
						return (
							<>
								{<PromptReferences references={message.references} excludeReferences={true} />}
								<UserMessage>{message.prompt}</UserMessage>
							</>
						);
					} else if (message instanceof vscode.ChatResponseTurn) {
						const metadata = message.result.metadata;
						if (isTsxToolUserMetadata(metadata) && metadata.toolCallsMetadata.toolCallRounds.length > 0) {
							return <ToolCalls toolCallResults={metadata.toolCallsMetadata.toolCallResults} toolCallRounds={metadata.toolCallsMetadata.toolCallRounds} toolInvocationToken={undefined} />;
						}

						return <AssistantMessage>{convertResponseToString(message)}</AssistantMessage>;
					}
				})}
			</PrioritizedList>
		);
	}
}

// Renders all references attached to a user turn.
class PromptReferences extends PromptElement<ReferencesPromptElementProps, void> {
	render(_state: void, _sizing: PromptSizing): PromptPiece {
		return (
			<UserMessage>
				{this.props.references.map(ref => (
					<PromptReferenceElement ref={ref} excludeReferences={this.props.excludeReferences} />
				))}
			</UserMessage>
		);
	}
}


// Renders a single reference (file, selection, or text) into prompt context markup.
class PromptReferenceElement extends PromptElement<ReferencePromptElementProps> {
	async render(_state: void, _sizing: PromptSizing): Promise<PromptPiece | undefined> {
		const value = this.props.ref.value;
		if (value instanceof vscode.Uri) {
			const bytes = await vscode.workspace.fs.readFile(value);
			const fileContents = truncateReferenceContent(new TextDecoder().decode(bytes));
			return (
				<ContextTag name="context">
					{!this.props.excludeReferences && <references value={[new PromptReference(value)]} />}
					{value.fsPath}:<br />
					```<br />
					{fileContents}<br />
					```<br />
				</ContextTag>
			);
		} else if (value instanceof vscode.Location) {
			const rangeText = (await vscode.workspace.openTextDocument(value.uri)).getText(value.range);
			return (
				<ContextTag name="context">
					{!this.props.excludeReferences && <references value={[new PromptReference(value)]} />}
					{value.uri.fsPath}:{value.range.start.line + 1}-{value.range.end.line + 1}:<br />
					```<br />
					{rangeText}<br />
					```
				</ContextTag>
			);
		} else if (typeof value === 'string') {
			return <ContextTag name="context">{value}</ContextTag>;
		}

		return undefined;
	}
}

// Emits a validated XML-like wrapper tag used for context sections.
class ContextTag extends PromptElement<TagPromptElementProps> {
	private static readonly _regex = /^[a-zA-Z_][\w.-]*$/;

	render(_state: void, _sizing: PromptSizing) {
		const { name } = this.props;
		if (!ContextTag._regex.test(name)) {
			throw new Error(`Invalid tag name: ${this.props.name}`);
		}
		return (
			<>
				{'<' + name + '>'}<br />
				<>
					{this.props.children}<br />
				</>
				{'</' + name + '>'}<br />
			</>
		);
	}
}

// Top-level prompt composition for the tool-enabled chat participant.
class ToolUserPrompt extends PromptElement<ToolUserProps, void> {
	render(_state: void, _sizing: PromptSizing) {
		const prompt = this.props.request.prompt;
		return (
			<>
				<UserMessage>{this.props.agentInstructions}</UserMessage>
				<ChatHistory context={this.props.context} priority={10} />
				<PromptReferences
					references={this.props.request.references}
					priority={20}
				/>
				<UserMessage>{prompt}</UserMessage>
				<ToolCalls
					toolCallRounds={this.props.toolCallRounds}
					toolInvocationToken={this.props.request.toolInvocationToken}
					toolCallResults={this.props.toolCallResults} />
			</>
		);
	}
}

export {ToolUserPrompt, ToolCallRound, ToolUserProps, ToolResultMetadata, TsxToolUserMetadata};
export {disposeToolPromptResources};
