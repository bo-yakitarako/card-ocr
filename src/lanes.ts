/**
 * 評価レーン定義。
 * カテゴリの分け目は「OCRがどこで動くか」(docs/card-image-to-json.md 参照):
 *   A = Devin直読み, B = クライアントOCR(WASM)+Jev, C = API OCR+Jev
 */

export type LaneCategory = 'A' | 'B' | 'C';
export type LaneId = 'A' | 'B' | 'C-1' | 'C-2' | 'C-3' | 'C-4';

export type Lane = {
  /** レーン表記 (docsの「#」列に対応)。A/Bはカテゴリと同じ文字 */
  id: LaneId;
  category: LaneCategory;
  /** 構成の短い名前 */
  name: string;
  /** OCRエンジン or 読み取り方式 */
  engine: string;
  /** 概算コスト/千枚 */
  costHint: string;
  /** 実装済みなら true。false のレーンは実行不可 */
  implemented: boolean;
};

export const LANE_CATEGORY_LABEL: Record<LaneCategory, string> = {
  A: 'Devin直読み',
  B: 'クライアントOCR',
  C: 'API OCR',
};

export const LANES: readonly Lane[] = [
  {
    id: 'A',
    category: 'A',
    name: 'devin -p 直読み',
    engine: 'SWE-2 (vision)',
    costHint: '¥0 / 定額内',
    implemented: false,
  },
  {
    id: 'B',
    category: 'B',
    name: 'RapidOCR → Jev',
    engine: 'RapidOCR (WASM・端末内)',
    costHint: '≈¥0 / Jev入力のみ',
    implemented: false,
  },
  {
    id: 'C-1',
    category: 'C',
    name: 'Cloud Vision → Jev',
    engine: 'Google Cloud Vision',
    costHint: '~$1.5 + Jev僅少',
    implemented: false,
  },
  {
    id: 'C-2',
    category: 'C',
    name: 'Datalab Chandra 2.7 → Jev',
    engine: 'Datalab API',
    costHint: '$4〜10',
    implemented: false,
  },
  {
    id: 'C-3',
    category: 'C',
    name: 'LlamaParse OCRia-1.5 → Jev',
    engine: 'LlamaParse',
    costHint: '$4.5〜15',
    implemented: false,
  },
  {
    id: 'C-4',
    category: 'C',
    name: 'Liquid lfm3-vl-2b → Jev',
    engine: 'Liquid LFM (hosted)',
    costHint: '数円? / トークン従量',
    implemented: false,
  },
];

export const C_LANES = LANES.filter((lane) => lane.category === 'C');

export const LANE_BY_ID = Object.fromEntries(LANES.map((lane) => [lane.id, lane])) as Record<LaneId, Lane>;
