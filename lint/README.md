# カスタムlintルール

このプロジェクト固有のOxlint JSプラグインルール置き場。追加手順は `AGENTS.md` の「Preventing repeat mistakes with lint」セクションを参照。

## ディレクトリ構成

1ルール = 1ディレクトリ。ディレクトリ名 = ルール名（kebab-case）。

```
lint/
  <rule-name>/
    index.mjs              # ルール本体（definePluginでラップ、meta.name は 'local'）
    <rule-name>.test.mjs   # RuleTesterのテストケース（`vp test`で実行）
```

- `index.mjs` は `definePlugin({ meta: { name: 'local' }, rules: { '<rule-name>': rule } })` をデフォルトエクスポートする。`vite.config.ts` の `lint.rules` では `local/<rule-name>` として有効化する。
- ルールAPIは `vite-plus/lint/plugins`（`definePlugin`, `defineRule`）から、テストの`RuleTester`は `vite-plus/lint/plugins-dev` からimportする。`oxlint` や `@oxlint/plugins` を直接importしない（バージョン乖離防止）。
- `create(context)` はファイルごとに呼ばれる。パスで絞るルールは `context.filename` / `context.physicalFilename` を使う。

## ルールの登録

```ts [vite.config.ts]
lint: {
  jsPlugins: ['./lint/no-page-fetch/index.mjs', './lint/<rule-name>/index.mjs'],
  rules: {
    'local/no-page-fetch': 'error',
    'local/<rule-name>': 'error',
  },
}
```

## 動作確認

- `pnpm exec vp test run lint/` — 全ルールのテストを実行
- `pnpm exec vp lint` — 新ルール込みでプロジェクトをlint
- `pnpm exec vp check` — fmt + lint + 型チェック

`vp staged` がステージ済みの `lint/**/*.test.mjs` に対して `vp test run` を自動実行する。
