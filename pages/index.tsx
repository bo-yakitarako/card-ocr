import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { ImageInputPanel, type SelectedImage } from '@/components/ImageInputPanel';
import { LaneFooter } from '@/components/LaneFooter';
import { OutputPanel } from '@/components/OutputPanel';
import { LANE_BY_ID, LANES, type LaneCategory, type LaneId } from '@/lanes';
import '@/styles.css';

const PC_MEDIA = '@media (min-width: 768px)';

const styles = stylex.create({
  app: {
    display: 'flex',
    flexDirection: 'column',
    height: '100dvh',
    backgroundColor: '#f6f7f9',
    color: '#111318',
    fontFamily:
      '"Noto Sans JP", "Noto Sans CJK JP", "Hiragino Sans", "Hiragino Kaku Gothic ProN", system-ui, -apple-system, "Segoe UI", sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '10px',
    flexShrink: 0,
    paddingBlock: '10px',
    paddingInline: '16px',
  },
  headerTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: 800,
    letterSpacing: '-0.01em',
  },
  headerSub: {
    fontSize: '11.5px',
    color: '#6d7482',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flexGrow: 1,
    minHeight: 0,
    paddingInline: '12px',
    paddingBottom: '12px',
    [PC_MEDIA]: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
      gap: '16px',
      paddingInline: '20px',
      paddingBottom: '16px',
    },
  },
});

export default function HomePage() {
  const [image, setImage] = useState<SelectedImage | null>(null);
  const [lane, setLane] = useState<LaneCategory>('B');
  const [cModel, setCModel] = useState<LaneId>('C-1');
  const [prompts, setPrompts] = useState<Record<LaneId, string>>(
    () => Object.fromEntries(LANES.map((l) => [l.id, ''])) as Record<LaneId, string>,
  );

  const handleFile = (file: File | null) => {
    if (file && !file.type.startsWith('image/')) return;
    if (image) URL.revokeObjectURL(image.url);
    setImage(file ? { file, url: URL.createObjectURL(file) } : null);
  };

  const currentLaneId: LaneId = lane === 'C' ? cModel : lane;
  const currentLane = LANE_BY_ID[currentLaneId];

  return (
    <div {...stylex.props(styles.app)}>
      <header {...stylex.props(styles.header)}>
        <h1 {...stylex.props(styles.headerTitle)}>カードOCR</h1>
        <span {...stylex.props(styles.headerSub)}>カード画像 → 構造化JSON 評価ワークベンチ</span>
      </header>

      <main {...stylex.props(styles.main)}>
        <ImageInputPanel image={image} onFile={handleFile} />
        <OutputPanel
          lane={currentLane}
          hasImage={image !== null}
          prompt={prompts[currentLaneId]}
          onPromptChange={(value) => setPrompts((prev) => ({ ...prev, [currentLaneId]: value }))}
        />
      </main>

      <LaneFooter lane={lane} cModel={cModel} onLaneChange={setLane} onCModelChange={setCModel} />
    </div>
  );
}
