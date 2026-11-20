import * as v from 'valibot';

/**
 * OCR span。det+rec 一体型エンジンが返す「テキスト + 座標 + 確度」の最小単位。
 * B(クライアントWASM) と C(API OCR) はこの中間表現に揃えてから成形層へ渡す
 * (docs/card-image-to-json.md 参照)。
 */
export const ocrSpanSchema = v.object({
  text: v.string(),
  bbox: v.object({ x: v.number(), y: v.number(), w: v.number(), h: v.number() }),
  confidence: v.pipe(v.number(), v.minValue(0), v.maxValue(1)),
});
export type OcrSpan = v.InferOutput<typeof ocrSpanSchema>;

/** ワザ1つ分。attack_name / attack_cost / damage / effect をまとめたもの */
const cardAttackSchema = v.object({
  name: v.nullable(v.string()),
  cost: v.array(v.string()),
  damage: v.nullable(v.string()),
  effect: v.nullable(v.string()),
});

/**
 * 全レーン共通の出力スキーマ。評価はこの形に収束させて正解データとdiffする。
 * 読み取れなかったフィールドは null / 空配列で表現する。
 */
export const cardOutputSchema = v.object({
  name: v.nullable(v.string()),
  hp: v.nullable(v.number()),
  types: v.array(v.string()),
  attacks: v.array(cardAttackSchema),
  weakness: v.nullable(v.string()),
  resistance: v.nullable(v.string()),
  retreatCost: v.nullable(v.number()),
  regulationMark: v.nullable(v.string()),
  flavor: v.nullable(v.string()),
  cardNumber: v.nullable(v.string()),
  set: v.nullable(v.string()),
  illustrator: v.nullable(v.string()),
});
export type CardOutput = v.InferOutput<typeof cardOutputSchema>;

/** POST /api/ocr/[lane] のリクエストボディ */
export const ocrRequestSchema = v.object({
  /** カード画像。base64文字列（data URL prefix 付きも可） */
  image: v.pipe(v.string(), v.minLength(1)),
  /** レーンに渡す追加指示。省略時はデフォルトプロンプト */
  prompt: v.optional(v.string(), ''),
});
