import { definePlugin, defineRule } from 'vite-plus/lint/plugins';

// ファイル/ディレクトリ命名規約:
//   .tsx      → PascalCase (index.tsx とルート動的セグメント [id] は除く)
//   その他     → camelCase (`01.stylex.ts` のような数字プレフィックスは許容)
//   ディレクトリ → kebab-case
// 対象はアプリのソースディレクトリのみ (lint/・tests/・設定ファイルは対象外)。
const APP_DIR = /^(src|pages|middleware|routes|db|crons|queues)\//;
const KEBAB_SEGMENT = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const PASCAL_STEM = /^([A-Z][a-zA-Z0-9]*(\.(test|spec|stories))?|index|\[.+\])$/;
const CAMEL_STEM = /^(\d+\.)?([a-z][a-zA-Z0-9]*|\[.+\])(\.[a-z0-9][a-zA-Z0-9]*)*$/;
const CHECKED_EXT = /\.(tsx?|mts|cts|mjs|cjs|jsx)$/;

const namingConvention = defineRule({
  meta: {
    messages: {
      tsxNotPascal:
        '.tsx files must be PascalCase: {{name}} (index.tsx is the only exception). Put helper components in src/components/.',
      fileNotCamel: 'Files other than .tsx must be camelCase: {{name}}',
      dirNotKebab: 'Directory "{{dir}}" must be kebab-case.',
    },
  },
  create(context) {
    const filename = context.filename ?? context.physicalFilename ?? context.getFilename?.() ?? '';
    const path = filename.replaceAll('\\', '/');
    const cwd = (context.cwd ?? context.getCwd?.() ?? '').replaceAll('\\', '/');
    const rel = cwd && path.startsWith(`${cwd}/`) ? path.slice(cwd.length + 1) : path.replace(/^\.\//, '');
    if (!APP_DIR.test(rel) || !CHECKED_EXT.test(rel)) {
      return {};
    }
    return {
      Program(node) {
        const segments = rel.split('/');
        const base = segments[segments.length - 1];
        const badDir = segments.slice(0, -1).find((dir) => !KEBAB_SEGMENT.test(dir));
        if (badDir) {
          context.report({ node, messageId: 'dirNotKebab', data: { dir: badDir } });
        }
        const stem = base.slice(0, base.lastIndexOf('.'));
        if (base.endsWith('.tsx')) {
          if (!PASCAL_STEM.test(stem)) {
            context.report({ node, messageId: 'tsxNotPascal', data: { name: base } });
          }
        } else if (!CAMEL_STEM.test(stem)) {
          context.report({ node, messageId: 'fileNotCamel', data: { name: base } });
        }
      },
    };
  },
});

export default definePlugin({
  meta: { name: 'local' },
  rules: { 'naming-convention': namingConvention },
});
