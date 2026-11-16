import { RuleTester } from 'vite-plus/lint/plugins-dev';
import { describe, it } from 'vitest';
import plugin from './index.mjs';

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester();

ruleTester.run('no-page-fetch', plugin.rules['no-page-fetch'], {
  valid: [
    { code: 'const x = 1;', filename: 'pages/index.tsx' },
    { code: 'await fetch("/api/cards");', filename: 'pages/index.server.ts' },
    { code: 'await fetch("/api/cards");', filename: 'src/lib/api.ts' },
    { code: 'obj.fetch("/x");', filename: 'pages/index.tsx' },
  ],
  invalid: [
    {
      code: 'await fetch("/api/cards");',
      filename: 'pages/index.tsx',
      errors: [{ messageId: 'noPageFetch' }],
    },
  ],
});
