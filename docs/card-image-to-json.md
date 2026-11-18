# カード画像から出力JSONを得る方針

## スコープ

本書は「カード画像から構造化された出力JSONをどう得るか」という前段の方針のみを扱う。
出力JSONが得られた後の共通実装（スキーマ検証・カードDB照合・APIプロキシの実装詳細・UI等）は**本書のスコープ外**とし、別途定める。

## 方針概要

2つのルートを評価し、いずれも**同一の出力スキーマに収束**させて比較する。

```
【ルートA: Devin直読み】
画像 → devin -p (SWE-2 vision) → JSON
  - Jevは介さない。エージェント1発で完結
  - Devin Proの定額内（swe-2系はFree表記）
  - 他レーンの評価用「正解データ」生成にも使う

【ルートB: OCR + Jev成形】
画像 → OCRエンジン → spans（テキスト+座標）
                ↘
                 → Jev typed questions → フィールド確定 → JSON
                ↗ （シンボル判定用に圧縮画像も同送）
```

## 評価レーン

| #   | 構成                            | 座標         | シンボル判定 | 日本語精度    | 概算/千枚                       | 画像送信   | 実装負荷 |
| --- | ------------------------------- | ------------ | ------------ | ------------- | ------------------------------- | ---------- | -------- |
| A   | `devin -p` SWE-2直読み          | LLM内部      | LLM内部      | ○〜◎          | ¥0（定額内）                    | サーバーへ | 最小     |
| B-1 | **manga-ocr+det（WASM）→ Jev**  | ○（det由来） | Jev（画像）  | ○〜◎          | ≈¥0（Jev入力$0.042/1M・誤差級） | 圧縮画像   | 大       |
| B-2 | Cloud Vision → Jev              | ◎            | Jev（画像）  | ◎             | ~$1.5＋Jev僅少                  | あり       | 小       |
| B-3 | Datalab API (Chandra 2.7) → Jev | ◎            | 同上         | ◎             | $4〜10                          | あり       | 小       |
| B-4 | LlamaParse (OCRia-1.5) → Jev    | ◎            | 同上         | ?（文書特化） | $4.5〜15                        | あり       | 小       |
| B-5 | Liquid `lfm3-vl-2b` 1発 → Jev   | △(grounding) | 同上         | ?             | 数円?（トークン従量）           | あり       | 最小     |

- **A（本命基準線）**: 実装ゼロで理想出力の基準を作る
- **B-1（本命構成）**: クライアントOCRで画像を端末内処理。限界コスト最安。manga-ocrは認識専用なので別途detector（RapidOCR-det等）で文字領域を検出する
- **B-2〜B-4**: ホストOCRの精度ベンチ。クライアントOCRの精度が足りない場合の代替
- **B-5**: ワンコール完結の実験枠

## Jev（Decisions API）の役割

TypeSafe AIの「System One」分類専用モデル（`typesafe/jev-1.14`、画像最大4枚可）。テキスト生成をせず、`state`＋型付き`questions`に対しcalibratedな確率つきの型付き回答を返す。

- **OCR spanの役割ラベル付け**: 各spanに対し `choice[name, hp, attack_name, attack_cost, damage, effect, flavor, card_number, set, illustrator, other]` を問う。bboxをstateに含めることで「上部中央＋固有名詞っぽい→name」のような位置の常識を証拠として使える
- **シンボル判定**: タイプ・弱点・にげるコスト・regulation mark等はアイコンなのでOCR不可。切り抜きは世代・特殊カードで座標がずれるため不採用とし、**画像を丸ごとJevに渡してchoice判定**する
- **特徴**: 出力が常に型に収まる（生成JSON破綻なし）・確度駆動のフォールバック設計が可能・非自己回帰で高速・出力トークン無料

`questions`マップは単なるJSONなので、外部定義として持ち、カードゲーム種別・フィールド構成の調整をコード変更なしで行えるようにする。

## 候補エンジンの注意点

- **ライセンス**: Datalab系（Chandra/Indra/Surya）とLiquid LFM系はself-hostの重み利用に収入制限あり（Chandra $2M、Indra $20M、LFM $10M）。当社規模ではself-host不可のため**ホストAPI利用のみ**が対象。manga-ocrとTesseract/RapidOCRはApache 2.0で制約なし
- **座標**: manga-ocr単体は座標を出さない（detector併用必須）。LFM3-VLのgrounding座標は生成値で精度不確か。Datalab/LlamaParse/Vision/RapidOCRはネイティブにbbox+confを返す
- **コスト感**: Jevは入力トークンのみ課金（$0.042/1M）で1枚あたりほぼ誤差級。無料枠はDatalab ~$20/月、LlamaParse 10k cr/月、Vision 月千枚、Liquid $2 cr

## 評価方法

同一のカード画像群を各レーンに通し、同一スキーマのJSONを得て正解とdiff比較する。正解データはルートAの出力を人手で検目して作成する。

## 未決事項（実測待ち）

- manga-ocrのカード実画像での認識精度（小さい番号・装飾フォント）
- Jevのシンボル判定精度（画像丸ごと入力）
- 各ホストAPIの日本語カードでの実精度
- 単位時間あたりのレイテンシ比較（devin -p起動 vs Jev非自己回帰）
