import { defineHandler, type InferProps } from 'void';
import { LANE_PROMPTS } from '@/server/prompts';

export type Props = InferProps<typeof loader>;

export const loader = defineHandler(() => ({ prompts: LANE_PROMPTS }));
