import { fileURLToPath } from 'node:url';
import stylex from '@stylexjs/unplugin';
import { voidReact } from '@void/react/plugin';
import { defineConfig } from 'vite-plus';
import { voidPlugin } from 'void';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  fmt: {
    printWidth: 120,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: true,
    trailingComma: 'all',
    bracketSpacing: true,
    arrowParens: 'always',
    sortImports: {
      groups: [['builtin'], ['external'], ['internal'], ['parent', 'sibling', 'index']],
      sortSideEffects: false,
      ignoreCase: true,
      newlinesBetween: false,
    },
    ignorePatterns: [
      'node_modules/*',
      'dist/*',
      '.cloudflare/*',
      '.void/*',
      '.wrangler/*',
      '.agents/*',
      '.claude/*',
      '.codex/*',
      '.cursor/*',
      '.windsurf/*',
      'skills/*',
      'pnpm-lock.yaml',
    ],
  },
  staged: {
    '*': 'vp check --fix',
    'lint/**/*.test.mjs': 'vp test run',
  },
  lint: {
    ignorePatterns: [
      'dist/**',
      '.cloudflare/**',
      '.void/**',
      '.wrangler/**',
      '.agents/**',
      '.claude/**',
      '.codex/**',
      '.cursor/**',
      '.windsurf/**',
      'skills/**',
    ],
    plugins: ['typescript', 'unicorn', 'oxc', 'import'],
    jsPlugins: ['./lint/no-page-fetch/index.mjs'],
    rules: {
      'local/no-page-fetch': 'error',
      'import/no-relative-parent-imports': 'error',
    },
    overrides: [
      {
        files: ['src/**', 'pages/**', 'middleware/**', 'routes/**', 'db/**', 'crons/**', 'queues/**'],
        rules: {
          'no-restricted-imports': [
            'error',
            {
              patterns: ['./**', '../**'],
            },
          ],
        },
      },
    ],
  },
  plugins: [voidPlugin(), stylex.vite(), voidReact()],
  server: {
    allowedHosts: ['vite.bo-yakitarako.dev'],
  },
});
