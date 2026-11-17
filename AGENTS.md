<!--injected-by-void-v1.1.12-->

## Void

- This project uses [Void](https://void.cloud), a full-stack Vite framework for Cloudflare Workers with file-based API routing, server-rendered pages, and typed backend services.
- Use Void's CLI and typed APIs. Before working with Void, read the relevant Markdown docs in `node_modules/void/docs/`; start with `guide/quickstart.md` for setup and `reference/cli.md` for commands.

<!--/injected-by-void-->

---

<!-- fallow:setup-hooks:start -->

## Fallow checks

Use fallow for code-quality, cleanup, and setup tasks in this repository. Fallow checks the changed code before each `git commit` and `git push`. In Claude Code and Codex, a PreToolUse hook from `fallow agent install` runs this check and blocks the command when the verdict is `fail`. Other agents run the check themselves: `fallow audit --format json --quiet --explain --gate-marker agent`. If the verdict is `fail`, fix the reported findings before you try again. A JSON runtime error such as `{ "error": true, ... }` does not block.

Audit defaults to `gate=new-only`: only findings introduced by the current changeset affect the verdict. Inherited findings on touched files are reported under `attribution` and annotated with `introduced: false`, but do not block the commit. Set `[audit] gate = "all"` in `fallow.toml` to gate every finding in changed files.

For non-skill agents, treat the task map below as the local onboarding source: run the listed fallow command before destructive edits, before commits, and before pull request handoff.

## Fallow task map

| When the agent is about to...                                        | Run                                                                                                                                                             |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| delete an "unused" export or file                                    | `fallow dead-code --trace <file>:<export>`                                                                                                                      |
| prove a TypeScript symbol's exact consumers before refactoring       | `fallow dead-code --type-aware --symbol-impact <file>:<export-or-class.method>`                                                                                 |
| find how one module reaches another                                  | `fallow trace --path <from> <to>` (Reports `reachable: false` instead of failing when no import path exists; type-only hops are reported, not skipped.)         |
| delete an "unused" dependency                                        | `fallow dead-code --trace-dependency <name>`                                                                                                                    |
| migrate a dependency                                                 | `fallow trace --dependency <name> --sites` (Counts each imported name, follows one hop through project wrappers, and counts each use that it cannot resolve.)   |
| commit or open a PR                                                  | `fallow audit --base <ref>`                                                                                                                                     |
| read a diff before approving it                                      | `fallow review --base <ref> --brief` (orientation, never gates: deterministic and always exit 0, unlike the audit row)                                          |
| prioritize refactoring                                               | `fallow health --hotspots --targets`                                                                                                                            |
| ask who owns code                                                    | `fallow health --ownership`                                                                                                                                     |
| check untested-but-reachable code                                    | `fallow health --coverage-gaps`                                                                                                                                 |
| improve or check the tests of a change                               | `fallow mutation --plan --base <ref>` (The plan runs no code. Without `--plan`, the command runs the project tests against each mutant, so ask the user first.) |
| consolidate duplication                                              | `fallow dupes --trace dup:<fingerprint>`                                                                                                                        |
| find feature flags                                                   | `fallow flags`                                                                                                                                                  |
| check which architecture rules apply to a file before changing it    | `fallow guard <files>`                                                                                                                                          |
| check import cycles, boundaries and policy rules after changing code | `fallow architecture`                                                                                                                                           |
| surface security candidates                                          | `fallow security`                                                                                                                                               |
| understand a finding                                                 | `fallow explain <issue-type>`                                                                                                                                   |
| scope a monorepo                                                     | `--workspace <glob> / --changed-workspaces <ref>` (global flags, prefix any command)                                                                            |

<!-- fallow:setup-hooks:end -->

<!-- checks:start -->

## 実装中のチェック

チェックはこの順で実行すること（安い修正から先に）:

1. **fmt + lint + 型:** `pnpm exec vp check --fix`（フォーマットとlintを自動修正）。確認のみなら `pnpm exec vp check`。
2. **React Doctor** は `.tsx`/Reactコードを変更した後: `pnpm exec react-doctor --verbose --scope changed` — スコア（0〜100）を下げる退行はコミット前に直すこと。`npx react-doctor@latest`ではなくローカルインストール版のCLIを使う。
3. **Fallow** は `git commit`/`git push` の前: 上のauditブロックを参照。

`vite.config.ts` の `staged` ブロックにより `.vite-hooks/pre-commit` がステージファイルに `vp check --fix` を実行し、その後React Doctorのステージスキャンが走る。エージェントが手動で回す順序も同じ。

ブラウザ実測が必要な視覚的変更は`pnpm browser`（`open`/`eval`/`screenshot`。`AGENT_BROWSER_ARGS=--no-sandbox`込み）で確認する。

devサーバーはすべて`scripts/dev.sh`経由にすること（`start`/`stop`/`restart`/`status`/`logs`/`toggle`）。`pnpm dev`の直接起動は禁止。

React Doctorのコマンド:

- フルスキャン: `pnpm exec react-doctor --verbose`（または `pnpm doctor`）
- ステージのみスキャン: `pnpm exec react-doctor --staged --blocking warning`
- UI/a11yに絞った監査: `pnpm exec react-doctor design --verbose`
- ルール詳細・設定: `pnpm exec react-doctor rules explain <rule>`（設定は `doctor.config.ts`）

Claude CodeとCursorではStopフックがターン終了時にReact Doctorスキャンを自動実行する。それ以外のエージェントは上記コマンドを自分で実行すること: React編集後、および `git commit`/`git push` の前。
<!-- checks:end -->

<!-- lint-policy:start -->

## プロジェクト規約

- プロジェクト内のドキュメントやコメントは日本語で書く（`README.md`、ガイド、ルールのドキュメント）。ツール生成のエージェント向け指示ブロックは英語のままでよい。
- `AGENTS.md`は100行以内に抑える。詳細は各ドキュメント（`lint/README.md`、`node_modules/*/docs/`等）に書き、ここには要点と参照先だけを置く。
- プロジェクト内のimportは`@/`（`src/`のエイリアス、`vite.config.ts`の`resolve.alias` + `tsconfig.json`の`paths`で定義）を使った絶対パスで書く。`src/`・`pages/`・`middleware/`・`routes/`・`db/`・`crons/`・`queues/`では相対import（`./`・`../`）をlintで禁止済み。`lint/`のような対象外でも`../`は禁止。共有コードは`src/`に置くこと。
- 依存のインストール・追加・更新は`sfw`を前置して実行する（`sfw pnpm install`、`sfw pnpm add <pkg>`）。Socket Firewallが確定マルウェアをネットワーク層で遮断する。miseで`npm:sfw`として提供済み。
- コーディングでは`ponytail`スキルの最小変更原則（必要十分・既存再利用・検証は削らない）に従う。変更のレビューは`/ponytail-review`、リポジトリ全体の棚卸しは`/ponytail-audit`。

## lintで再発防止する運用

ユーザーが「〜しないようにして」「don't do X」「never do X」のようにコードパターン禁止を指示したら、lintルール化して再発を防ぐこと。目の前の箇所を直すだけで終わらせない。

1. **まずビルトイン/プラグインのルールを探す。** `vp lint`の組み込みルールと有効プラグイン（Oxlintのcorrectness、react/unicorn/jsx-a11y）を確認し、既存ルールで防げるなら `vite.config.ts` の `lint.rules` で有効化して終わり（ファイル限定なら `lint.overrides`）。
2. **無理ならカスタムルールを作る。** `lint/<rule-name>/` 以下に配置（契約は `lint/README.md` 参照）:
   - `lint/<rule-name>/index.mjs` — `definePlugin({ meta: { name: 'local' }, rules: { '<rule-name>': rule } })`。importは `vite-plus/lint/plugins` から
   - `lint/<rule-name>/<rule-name>.test.mjs` — `vite-plus/lint/plugins-dev` の `RuleTester` + vitest で valid/invalid ケース
   - `lint/no-page-fetch/` が実動サンプルなのでコピーして使う
3. **登録:** `vite.config.ts` の `lint.jsPlugins` にindex.mjsのパスを追加し、`lint.rules` に `'local/<rule-name>': 'error'` を設定。
4. **検証:** `pnpm exec vp test run lint/`（ルールテスト通過）と `pnpm exec vp lint`（意図通り発火・誤検出なし）を確認してからユーザーに報告。

<!-- lint-policy:end -->
