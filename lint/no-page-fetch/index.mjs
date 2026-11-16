import { definePlugin, defineRule } from 'vite-plus/lint/plugins';

// Example scaffold for the lint/<rule-name>/ convention (see lint/README.md).
// Void pages load data via companion .server.ts loaders; direct fetch() calls
// inside page components bypass that contract.
const noPageFetch = defineRule({
  meta: {
    messages: {
      noPageFetch: 'Do not call fetch() in pages/. Load data in the companion .server.ts loader instead.',
    },
  },
  create(context) {
    const filename = context.filename ?? context.physicalFilename ?? context.getFilename?.() ?? '';
    const path = filename.replaceAll('\\', '/');
    if (!path.includes('/pages/') || /\.server\.[^/]+$/.test(path)) {
      return {};
    }
    return {
      CallExpression(node) {
        if (node.callee.type === 'Identifier' && node.callee.name === 'fetch') {
          context.report({ node, messageId: 'noPageFetch' });
        }
      },
    };
  },
});

export default definePlugin({
  meta: { name: 'local' },
  rules: { 'no-page-fetch': noPageFetch },
});
