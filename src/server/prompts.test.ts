import { describe, expect, it } from 'vite-plus/test';
import { LANE_IDS } from '@/lanes';
import { LANE_PROMPTS } from '@/server/prompts';

describe('LANE_PROMPTS', () => {
  it('全レーンのmdが同梱されている', () => {
    for (const id of LANE_IDS) {
      expect(LANE_PROMPTS[id].length).toBeGreaterThan(0);
    }
  });

  it('mdを追加・削除した場合はLANE_IDSと同期する', () => {
    expect(Object.keys(LANE_PROMPTS).sort()).toEqual([...LANE_IDS].sort());
  });
});
