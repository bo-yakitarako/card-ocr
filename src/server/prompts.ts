import type { LaneId } from '@/lanes';
import promptA from '@/prompts/A.md?raw';
import promptB from '@/prompts/B.md?raw';
import promptC1 from '@/prompts/C-1.md?raw';
import promptC2 from '@/prompts/C-2.md?raw';
import promptC3 from '@/prompts/C-3.md?raw';
import promptC4 from '@/prompts/C-4.md?raw';

/**
 * レーン別プロンプト。`src/prompts/<laneId>.md` を ?raw で文字列同梱する。
 * Workers には実行時fsが無いため、fs.readFile ではなくビルド時バンドル。
 * DB移行前の簡易保持。レーン追加時は md とマップの両方を足すこと。
 * （import.meta.glob は mutator の instrument が静的解析を壊すため明示import）
 */
export type LanePrompts = Record<LaneId, string>;

export const LANE_PROMPTS: LanePrompts = {
  A: promptA.trim(),
  B: promptB.trim(),
  'C-1': promptC1.trim(),
  'C-2': promptC2.trim(),
  'C-3': promptC3.trim(),
  'C-4': promptC4.trim(),
};
