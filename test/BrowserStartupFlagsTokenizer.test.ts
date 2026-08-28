import assert from 'node:assert/strict';
import Module from 'node:module';
import test from 'node:test';

const originalLoad = (Module as unknown as { _load: Function })._load;
(Module as unknown as { _load: Function })._load = function (request: string, parent: unknown, isMain: boolean) {
  if (request === 'vscode') {
    return {};
  }
  return originalLoad.call(this, request, parent, isMain);
};

async function getTokenizer(): Promise<(flags: string) => string[]> {
  const utils = await import('../src/utils/Utils.js');
  return utils.tokenizeBrowserStartupFlags;
}

test('tokenizeBrowserStartupFlags splits simple unquoted flags', async () => {
  const tokenizeBrowserStartupFlags = await getTokenizer();
  const flags = '--disable-web-security --disable-features=PrivateNetworkAccessForPrivateWebsiteRequests --user-data-dir=${workspaceFolder}/.vscode/chrome-dev-profile';

  assert.deepEqual(tokenizeBrowserStartupFlags(flags), [
    '--disable-web-security',
    '--disable-features=PrivateNetworkAccessForPrivateWebsiteRequests',
    '--user-data-dir=${workspaceFolder}/.vscode/chrome-dev-profile'
  ]);
});

test('tokenizeBrowserStartupFlags preserves quoted and escaped values', async () => {
  const tokenizeBrowserStartupFlags = await getTokenizer();
  const flags = '--user-data-dir="/tmp/my profile" --proxy-server=\'http://127.0.0.1:8888\' --name=My\\ App --title="Dev Browser"';

  assert.deepEqual(tokenizeBrowserStartupFlags(flags), [
    '--user-data-dir=/tmp/my profile',
    '--proxy-server=http://127.0.0.1:8888',
    '--name=My App',
    '--title=Dev Browser'
  ]);
});
