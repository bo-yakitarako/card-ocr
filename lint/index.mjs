import { definePlugin } from 'vite-plus/lint/plugins';
import namingConvention from './naming-convention/index.mjs';
import noPageFetch from './no-page-fetch/index.mjs';

// oxlint は同名プラグインを複数登録できないため、全 local ルールを
// この集約プラグイン1つにまとめる。新規ルールはここに rules を追加する。
export default definePlugin({
  meta: { name: 'local' },
  rules: {
    ...noPageFetch.rules,
    ...namingConvention.rules,
  },
});
