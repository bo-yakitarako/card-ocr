---
name: dev-server
description: card-ocrのdevサーバーをバックグラウンドで起動・停止する。devサーバーが必要なとき、ブラウザ実測や動作確認をするとき、「サーバー立てて」「止めて」と言われたときに使う。`pnpm dev`を直接バックグラウンド起動してはいけない。
---

# dev-server 制御

devサーバーは `scripts/dev.sh` 経由でデーモン管理する。`pnpm dev` の直接起動は禁止（PID管理されず、exec終了時に殺される・取り残されるため）。

## トグル（引数なし = `/dev-server` だけ）

```sh
scripts/dev.sh toggle
```

起動中なら停止、停止中なら起動する。

## 起動

```sh
scripts/dev.sh start
```

ViteのURL出力を検出してから `up: http://localhost:<port>/ (pid ..., log: .dev-server.log)` と報告する。既に起動中なら何もしない。

## 停止

```sh
scripts/dev.sh stop
```

プロセスグループごと確実に終了する。作業が終わったら必ず止めること。

## 補足

- 起動中のURL・PIDは `scripts/dev.sh status`、ログは `scripts/dev.sh logs` で確認できる
- ブラウザでの確認は `pnpm browser open <URL>` → `eval` / `screenshot`
