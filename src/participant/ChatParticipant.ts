import { renderPrompt } from '@vscode/prompt-tsx';
import * as vscode from 'vscode';
import { ToolCallRound, ToolResultMetadata, ToolUserPrompt, TsxToolUserMetadata } from '../prompt/PromptManager';
import { startDevServer } from '../commands/StartDevServer';
import { packApplication } from '../commands/PackApplication';
import { stopDevServer } from '../commands/StopDevServer';
import { previewApplication } from '../commands/PreviewApplication';
import { inspectUIControl } from '../commands/InspectUIControl';
import { createWorkspaceIfNotExist } from '../commands/CreateWorkspace';
import { openWorkspace } from '../commands/OpenWorkspace';
import { installSdkToGlobalNodeModules } from '../commands/InstallSdkToGlobalNodeModules';
import { openWebClientURLSetting } from '../commands/openWebClientURLSetting';
import { UiApiCommandLiterals } from '../commands/UiApiCommandLiterals';
import { loadInstructions } from '../prompt/AgentInstructions';
import { getClassLogger } from '../logger/LoggerWrapper';
import { DeployPrompt } from '../prompt/DeployPrompt';

interface ICommandChatResult extends vscode.ChatResult {
    metadata: {
        command: string;
    }
}

export function registerChatParticipant(context: vscode.ExtensionContext) {
    const logger = getClassLogger(registerChatParticipant.name);
    logger.info('Registering WebClient UIAPI copilot as chat participant.');
    const handler: vscode.ChatRequestHandler = async (chatRequest: vscode.ChatRequest, chatContext: vscode.ChatContext, stream: vscode.ChatResponseStream, cancellationToken: vscode.CancellationToken) => {
        logger.debug(`Handling chat request. command=${chatRequest.command ?? '<none>'}, model=${chatRequest.model.id}`);
        if (chatRequest.command === 'list') {
            stream.markdown(`Available tools: ${vscode.lm.tools.map(tool => tool.name).join(', ')}\n\n`);
            return;
        }

        // Use all tools, or tools with the tags that are relevant.
        const tools = chatRequest.command === 'all' ?
            vscode.lm.tools :
            vscode.lm.tools.filter(tool => tool.tags.includes('WebClientUIAPI'));

        const llm = chatRequest.model;
        const isClaudeModel =
            (llm.family?.toLowerCase().includes('claude') ?? false) ||
            (llm.id?.toLowerCase().includes('claude') ?? false);
        if (isClaudeModel) {
            logger.warn(`Rejected unsupported model in ask mode: ${llm.id}`);
            throw new Error('Claude models are not supported in chat ask mode.');
        }

        if (chatRequest.command === UiApiCommandLiterals.START_CHAT_COMMAND) {
            const ret = await startDevServer(stream, UiApiCommandLiterals.START_CHAT_COMMAND);
            return ret;
        }
        if (chatRequest.command === UiApiCommandLiterals.PREVIEW_CHAT_COMMAND || chatRequest.command === UiApiCommandLiterals.PREVIEW_EMBED_CHAT_COMMAND) {
            const ret = await previewApplication(stream, chatRequest.command, UiApiCommandLiterals.START_CHAT_COMMAND);
            return ret;
        }
        if (chatRequest.command === UiApiCommandLiterals.STOP_CHAT_COMMAND) {
            const ret = await stopDevServer(stream, UiApiCommandLiterals.STOP_CHAT_COMMAND);
            return ret;
        }
        if (chatRequest.command === UiApiCommandLiterals.INSPECT_CHAT_COMMAND) {
            const ret = await inspectUIControl(chatRequest, stream, UiApiCommandLiterals.INSPECT_CHAT_COMMAND);
            return ret;
        }
        if (chatRequest.command === UiApiCommandLiterals.PACKAGE_CHAT_COMMAND) {
            const ret = await packApplication(stream, UiApiCommandLiterals.PACKAGE_CHAT_COMMAND);
            return ret;
        }

        const chatRequestOptions: vscode.LanguageModelChatRequestOptions = {
            justification: 'WebClient UI API Copilot Tool User Request',
        };


        // The following code is mainly used in Ask mode.
        const agentInstructions = await loadInstructions(context);

        // Render the initial prompt for the chat participant, which includes the agent instructions and any tool call results from previous rounds.
        let renderedResult = await renderPrompt(
            ToolUserPrompt,
            {
                context: chatContext,
                request: chatRequest,
                agentInstructions,
                toolCallRounds: [],
                toolCallResults: {}
            },
            { modelMaxPromptTokens: llm.maxInputTokens },
            llm
        );
        renderedResult.references.forEach(ref => {
            if (ref.anchor instanceof vscode.Uri || ref.anchor instanceof vscode.Location) {
                stream.reference(ref.anchor);
            }
        });

        const toolReferences = [...chatRequest.toolReferences];
        const accumulatedToolResults: Record<string, vscode.LanguageModelToolResult> = {};
        const toolCallRounds: ToolCallRound[] = [];

        // Limit the number of tool call loops to prevent infinite recursion in case the model keeps requesting tools.
        const maxLoopCount = 10;

        // In ask mode, the model may request tools multiple times in a single chat request, so we need to loop until the model stops requesting tools or we reach a maximum loop count.
        const executeToolCallLoop = async (loopCount = 0): Promise<void> => {
            if (loopCount >= maxLoopCount) {
                logger.error(`Stopped agent loop after ${maxLoopCount} iterations to prevent infinite tool-call recursion.`);
                stream.markdown(`Tool-call loop limit reached (${maxLoopCount}). Stopping to prevent an infinite tool-call cycle.`);
                return;
            }

            // If the model requested a tool, set the tool mode to required and filter the tools to only include the requested tool. Otherwise, set the tool mode to undefined and include all tools.
            const requestedTool = toolReferences.shift();
            if (requestedTool) {
                chatRequestOptions.toolMode = vscode.LanguageModelChatToolMode.Required;
                chatRequestOptions.tools = vscode.lm.tools.filter(tool => tool.name === requestedTool.name);
            } else {
                chatRequestOptions.toolMode = undefined;
                chatRequestOptions.tools = [...tools];
            }

            // Send request to LLM
            const chatResponse = await llm.sendRequest(renderedResult.messages, chatRequestOptions, cancellationToken);

            // Stream text output and collect tool calls from the response
            const toolCallParts: vscode.LanguageModelToolCallPart[] = [];
            let textParts = '';
            for await (const responsePart of chatResponse.stream) {
                if (responsePart instanceof vscode.LanguageModelToolCallPart) {
                    toolCallParts.push(responsePart);
                }
                if (responsePart instanceof vscode.LanguageModelTextPart) {
                    textParts += responsePart.value;
                    stream.markdown(responsePart.value);
                }
            }
            if (toolCallParts.length == 0) {
                return;
            }

            toolCallRounds.push({
                response: textParts,
                toolCalls: toolCallParts
            });

            // Rerender the prompt for the chat participant, which includes the agent instructions and any tool call results from previous rounds.
            renderedResult = await renderPrompt(ToolUserPrompt,
                {
                    context: chatContext,
                    request: chatRequest,
                    agentInstructions: agentInstructions,
                    toolCallRounds: toolCallRounds,
                    toolCallResults: accumulatedToolResults
                },
                { modelMaxPromptTokens: llm.maxInputTokens },
                llm
            );

            // Collect tool call results from the rendered prompt and accumulate them for the next loop iteration.
            renderedResult.metadata.getAll(ToolResultMetadata)?.forEach(meta => {
                accumulatedToolResults[meta.toolCallId] = meta.result;
            });

            // Recurse until the model stops requesting tools.
            return executeToolCallLoop(loopCount + 1);
        };

        await executeToolCallLoop();

        // Return the accumulated tool call results and the tool call rounds to the chat participant.
        const toolCallMetadata = {
            metadata: {
                toolCallsMetadata: {
                    toolCallRounds: toolCallRounds,
                    toolCallResults: accumulatedToolResults
                }
            } satisfies TsxToolUserMetadata,
        };
        return toolCallMetadata;
    };

    const chatParticipant = vscode.chat.createChatParticipant('webclient-uiapi-copilot', handler);
    // chatParticipant.iconPath = new vscode.ThemeIcon('tools');
    chatParticipant.iconPath = vscode.Uri.joinPath(context.extensionUri, 'resource/icons/chat-icon.png');
    context.subscriptions.push(chatParticipant);
    context.subscriptions.push(
        chatParticipant,
        vscode.commands.registerCommand(UiApiCommandLiterals.CREATE_WORKSPACE_IF_NOT_EXIST_COMMAND_ID, createWorkspaceIfNotExist),
        vscode.commands.registerCommand(UiApiCommandLiterals.OPEN_WORKSPACE_COMMAND_ID, openWorkspace),
        vscode.commands.registerCommand(UiApiCommandLiterals.COPY_SDK_TO_GLOBAL_NODE_MODULES_COMMAND_ID, installSdkToGlobalNodeModules),
        vscode.commands.registerCommand(UiApiCommandLiterals.OPEN_WEB_CLIENT_URL_SETTING_COMMAND_ID, openWebClientURLSetting)
    );
    chatParticipant.followupProvider = {
        provideFollowups(result: ICommandChatResult, _context: vscode.ChatContext, _token: vscode.CancellationToken) {
            if (result.metadata.command === UiApiCommandLiterals.PACKAGE_CHAT_COMMAND) {
                const prompt = `Show the instruction on how to deploy SAP Business One Web Client UI API extension. \nContext:\n` + DeployPrompt;
                return [{
                    prompt: prompt,
                    label: vscode.l10n.t('Deploy Web Client UI API Application'),
                    command: 'deploy'
                } satisfies vscode.ChatFollowup];
            }
            if (result.metadata.command === UiApiCommandLiterals.PREVIEW_CHAT_COMMAND || result.metadata.command === UiApiCommandLiterals.PREVIEW_EMBED_CHAT_COMMAND) {
                if ('status' in result.metadata && result.metadata.status == 'failed') {
                    return;
                }
                return [
                    {
                        prompt: 'Pack this Web Client UI API application.',
                        label: vscode.l10n.t('Pack Web Client UI API Application'),
                        command: UiApiCommandLiterals.PACKAGE_CHAT_COMMAND
                    } satisfies vscode.ChatFollowup,
                    {
                        prompt: 'Stop this Web Client UI API application.',
                        label: vscode.l10n.t('Stop Web Client UI API Development Server'),
                        command: UiApiCommandLiterals.STOP_CHAT_COMMAND
                    } satisfies vscode.ChatFollowup
                ];
            }
            if (result.metadata.command === UiApiCommandLiterals.START_CHAT_COMMAND) {
                return [
                    {
                        prompt: 'Preview this Web Client UI API application.',
                        label: vscode.l10n.t('Preview Web Client UI API Application'),
                        command: UiApiCommandLiterals.PREVIEW_CHAT_COMMAND
                    } satisfies vscode.ChatFollowup,
                    {
                        prompt: 'Preview this Web Client UI API application in Embedded mode.',
                        label: vscode.l10n.t('Embedded Preview Web Client UI API Application'),
                        command: UiApiCommandLiterals.PREVIEW_EMBED_CHAT_COMMAND
                    } satisfies vscode.ChatFollowup,
                ];
            }
            if (result.metadata.command === UiApiCommandLiterals.STOP_CHAT_COMMAND) {
                return [{
                    prompt: 'Start this Web Client UI API application.',
                    label: vscode.l10n.t('Start Web Client UI API Development Server'),
                    command: UiApiCommandLiterals.START_CHAT_COMMAND
                } satisfies vscode.ChatFollowup];
            }
            return undefined;
        }
    };
}