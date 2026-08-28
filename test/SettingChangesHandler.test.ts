import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import Module from 'node:module';
import test from 'node:test';

interface ConfigChangeEvent {
  affectsConfiguration: (section: string) => boolean;
}

const requireForTest = createRequire(__filename);
const moduleId = requireForTest.resolve('../src/settings/SettingChangesHandler.js');

const configListeners: Array<(event: ConfigChangeEvent) => void> = [];
let currentLogLevel = 'error';
let currentSourceTracking = false;
let changedLevel: string | undefined;
let changedSourceTracking: boolean | undefined;
let logDetailsCalls = 0;

const mockVscode = {
  workspace: {
    onDidChangeConfiguration: (listener: (event: ConfigChangeEvent) => void) => {
      configListeners.push(listener);
      return { dispose: () => undefined };
    }
  }
};

const mockLoggerWrapper = {
  getLogger: () => ({
    changeLevel: (level: string) => {
      changedLevel = level;
    },
    changeSourceLocationTracking: (enabled: boolean) => {
      changedSourceTracking = enabled;
    }
  }),
  reportLoggerConfig: (_context: unknown, _configLogLevel: string) => {
    logDetailsCalls += 1;
  }
};

const mockSettingItems = {
  LOGGING_LEVEL_PROP: 'WebClientUIAPICopilot.loggingLevel',
  SOURCE_TRACKING_PROP: 'WebClientUIAPICopilot.sourceLocationTracking',
  getLoggingLevelSetting: () => currentLogLevel,
  getSourceLocationTrackingSetting: () => currentSourceTracking
};

const originalLoad = (Module as unknown as { _load: Function })._load;
(Module as unknown as { _load: Function })._load = function (request: string, parent: unknown, isMain: boolean) {
  if (request === 'vscode') {
    return mockVscode;
  }
  if (request === '../logger/LoggerWrapper') {
    return mockLoggerWrapper;
  }
  if (request === './SettingItems') {
    return mockSettingItems;
  }
  return originalLoad.call(this, request, parent, isMain);
};

function resetState(): void {
  configListeners.length = 0;
  currentLogLevel = 'error';
  currentSourceTracking = false;
  changedLevel = undefined;
  changedSourceTracking = undefined;
  logDetailsCalls = 0;
  delete requireForTest.cache[moduleId];
}

async function loadModule(): Promise<typeof import('../src/settings/SettingChangesHandler.js')> {
  delete requireForTest.cache[moduleId];
  return requireForTest(moduleId) as typeof import('../src/settings/SettingChangesHandler.js');
}

test('registerLogSettingsListeners registers two configuration listeners', async () => {
  resetState();
  const moduleRef = await loadModule();
  const context = { subscriptions: [] as unknown[] };

  moduleRef.registerLogSettingsListeners(context as never);

  assert.equal(configListeners.length, 2);
  assert.equal(context.subscriptions.length, 2);
});

test('logging level change updates logger level and logs details', async () => {
  resetState();
  const moduleRef = await loadModule();
  const context = { subscriptions: [] as unknown[] };
  moduleRef.registerLogSettingsListeners(context as never);

  currentLogLevel = 'debug';
  configListeners[0]({
    affectsConfiguration: (section: string) => section === mockSettingItems.LOGGING_LEVEL_PROP
  });

  assert.equal(changedLevel, 'debug');
  assert.equal(logDetailsCalls, 1);
});

test('source tracking change updates logger tracking flag', async () => {
  resetState();
  const moduleRef = await loadModule();
  const context = { subscriptions: [] as unknown[] };
  moduleRef.registerLogSettingsListeners(context as never);

  currentSourceTracking = true;
  configListeners[1]({
    affectsConfiguration: (section: string) => section === mockSettingItems.SOURCE_TRACKING_PROP
  });

  assert.equal(changedSourceTracking, true);
});
