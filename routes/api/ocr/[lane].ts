import * as v from 'valibot';
import { defineHandler } from 'void';
import { LANE_BY_ID, LANE_IDS } from '@/lanes';
import { LaneNotImplementedError, runLane } from '@/server/lanes';
import { ocrRequestSchema } from '@/server/schema';

/**
 * base64文字列をデコードする。`data:image/png;base64,` 形式の場合は
 * MIME も取り出す。prefix なしの素のbase64は image/png 扱い。
 */
function decodeImage(image: string): { bytes: Uint8Array; mimeType: string } {
  const match = /^data:([\w/+.-]+);base64,(.+)$/s.exec(image);
  const mimeType = match?.[1] ?? 'image/png';
  const data = match?.[2] ?? image;
  const bin = atob(data);
  return { bytes: Uint8Array.from(bin, (ch) => ch.charCodeAt(0)), mimeType };
}

export const POST = defineHandler.withValidator({
  body: ocrRequestSchema,
  params: v.object({ lane: v.picklist(LANE_IDS) }),
})(async (c, { body, params }) => {
  const lane = LANE_BY_ID[params.lane];
  if (!lane.implemented) {
    return c.json({ error: `lane ${lane.id} is not implemented` }, 501);
  }
  try {
    const { bytes, mimeType } = decodeImage(body.image);
    return await runLane(lane.id, { image: bytes, mimeType, prompt: body.prompt });
  } catch (e) {
    if (e instanceof LaneNotImplementedError) return c.json({ error: e.message }, 501);
    throw e;
  }
});
