import { defineEnv, string } from 'void/env';

/**
 * 各レーンが使う外部APIのキー。未実装レーンのキーは optional のままにし、
 * 実装時に required へ切り替える。値は dotenvx 管理の env/.env.<name> に入れる。
 */
export default defineEnv({
  // B/C 共通: TypeSafe AI Jev (Decisions API)
  JEV_API_KEY: string().optional(),
  // C-1: Google Cloud Vision
  GOOGLE_VISION_API_KEY: string().optional(),
  // C-2: Datalab API (Chandra)
  DATALAB_API_KEY: string().optional(),
  // C-3: LlamaParse
  LLAMAPARSE_API_KEY: string().optional(),
  // C-4: Liquid LFM (hosted)
  LIQUID_API_KEY: string().optional(),
});
