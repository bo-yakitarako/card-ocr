import { defineConfig } from '@mizchi/mutator';

// lint/ 配下のカスタムルールは既にvitestのRuleTesterテストで検出可能
export default defineConfig({
  include: [
    'src/**/*.{ts,tsx,js,jsx}',
    'pages/**/*.{ts,tsx,js,jsx}',
    'middleware/**/*.{ts,tsx,js,jsx}',
    'lint/**/*.mjs',
  ],
});
