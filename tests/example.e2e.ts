import { test } from '@e2e-dev/web';
import { expect } from 'e2e';

test('app opens', async ({ app, browser }) => {
  await app.open('/');
  await expect(browser.locator('body')).toBeVisible();
});

// Devinのログインを使うACPエグゼキュータなのでモデルキー不要で実行できる
test('the agent reads the page', async ({ app, agent }) => {
  await app.open('/');
  await agent.assert('the page has a visible heading');
});
