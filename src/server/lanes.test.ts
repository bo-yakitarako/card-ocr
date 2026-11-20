import * as v from 'valibot';
import { describe, expect, it } from 'vite-plus/test';
import { LaneNotImplementedError, runLane } from '@/server/lanes';
import { cardOutputSchema, ocrRequestSchema, ocrSpanSchema } from '@/server/schema';

describe('runLane', () => {
  it('未実装レーンは LaneNotImplementedError を投げる', async () => {
    const run = runLane('A', { image: new Uint8Array([1, 2, 3]), mimeType: 'image/png', prompt: '' });
    await expect(run).rejects.toThrow(LaneNotImplementedError);
    await expect(run).rejects.toThrow('lane A is not implemented');
  });
});

describe('ocrRequestSchema', () => {
  it('imageのみでpromptはデフォルト空文字になる', () => {
    const parsed = v.parse(ocrRequestSchema, { image: 'aGVsbG8=' });
    expect(parsed.prompt).toBe('');
  });

  it('imageが空ならinvalid', () => {
    expect(v.safeParse(ocrRequestSchema, { image: '' }).success).toBe(false);
  });
});

describe('ocrSpanSchema', () => {
  it('confidenceが範囲外ならinvalid', () => {
    const base = { text: 'ピカチュウ', bbox: { x: 0, y: 0, w: 10, h: 10 } };
    expect(v.safeParse(ocrSpanSchema, { ...base, confidence: 0.9 }).success).toBe(true);
    expect(v.safeParse(ocrSpanSchema, { ...base, confidence: 1.1 }).success).toBe(false);
  });
});

describe('cardOutputSchema', () => {
  it('全null/空でもvalid（読み取り失敗を表現できる）', () => {
    const result = v.safeParse(cardOutputSchema, {
      name: null,
      hp: null,
      types: [],
      attacks: [],
      weakness: null,
      resistance: null,
      retreatCost: null,
      regulationMark: null,
      flavor: null,
      cardNumber: null,
      set: null,
      illustrator: null,
    });
    expect(result.success).toBe(true);
  });
});
