import { codex } from '@e2e-dev/acp';
import { web } from '@e2e-dev/web';
import type { E2EConfig } from 'e2e';

export default {
  agents: {
    default: {
      // CodexのChatGPTログインでagent.actを実行（ACP経由）。外部モデルキーは不要
      executor: codex({
        model: 'gpt-6-luna',
        system: 'You are a thorough QA agent. Verify every outcome.',
      }),
    },
  },
  targets: [
    {
      engine: web(),
      app: {
        url: process.env.APP_URL ?? 'http://localhost:5173',
        // Or let the runner start the dev server:
        // command: { executable: 'npm', args: ['run', 'dev'] },
      },
    },
  ],
} satisfies E2EConfig;
