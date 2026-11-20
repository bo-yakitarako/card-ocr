import type { LaneId } from '@/lanes';
import type { CardOutput, OcrSpan } from '@/server/schema';

/** ランナーへの入力。画像はデコード済みバイト列で渡す */
export type LaneInput = {
  image: Uint8Array;
  mimeType: string;
  prompt: string;
};

/** 各レーンの実行結果。latencyMs は runLane が計測して付与する */
export type LaneResult = {
  lane: LaneId;
  /** 共通スキーマの出力。失敗・未出力の場合は null */
  output: CardOutput | null;
  /** OCR中間表現。A(Devin直読み)のようにspanを経由しないレーンは空配列 */
  spans: OcrSpan[];
  latencyMs: number;
  /** エンジン生レスポンス（検目・デバッグ用） */
  raw?: unknown;
};

type LaneRunner = (input: LaneInput) => Promise<Omit<LaneResult, 'lane' | 'latencyMs'>>;

export class LaneNotImplementedError extends Error {
  constructor(public readonly laneId: LaneId) {
    super(`lane ${laneId} is not implemented`);
    this.name = 'LaneNotImplementedError';
  }
}

/** lane id → ランナー。各レーンの実装ができたらここに登録する */
const RUNNERS: Partial<Record<LaneId, LaneRunner>> = {};

export async function runLane(laneId: LaneId, input: LaneInput): Promise<LaneResult> {
  const runner = RUNNERS[laneId];
  if (!runner) throw new LaneNotImplementedError(laneId);
  const started = performance.now();
  const result = await runner(input);
  return { ...result, lane: laneId, latencyMs: Math.round(performance.now() - started) };
}
