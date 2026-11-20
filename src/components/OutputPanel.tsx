import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Panel } from '@/components/Panel';
import type { Lane } from '@/lanes';

type Props = {
  lane: Lane;
  hasImage: boolean;
  prompt: string;
  onPromptChange: (value: string) => void;
};

const styles = stylex.create({
  seg: {
    display: 'flex',
    gap: '2px',
    flexShrink: 0,
    padding: '2px',
    borderRadius: '8px',
    backgroundColor: '#f1f3f6',
  },
  segButton: {
    paddingBlock: '4px',
    paddingInline: '10px',
    borderWidth: 0,
    borderRadius: '6px',
    backgroundColor: 'transparent',
    color: '#6d7482',
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: 1.5,
    cursor: 'pointer',
  },
  segActive: {
    backgroundColor: '#ffffff',
    color: '#4f46e5',
    boxShadow: '0 1px 3px rgb(16 24 40 / 0.15)',
  },
  output: {
    flexGrow: 1,
    minHeight: 0,
    margin: 0,
    padding: '14px',
    borderRadius: '10px',
    backgroundColor: '#0f1420',
    color: '#c8d0e0',
    fontFamily: '"SFMono-Regular", ui-monospace, Menlo, Consolas, monospace',
    fontSize: '12.5px',
    lineHeight: 1.7,
    overflow: 'auto',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
  },
  outputEmpty: {
    color: '#5b6478',
  },
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  },
  statusDot: {
    width: '7px',
    height: '7px',
    borderRadius: '999px',
    backgroundColor: '#4f46e5',
    animationName: stylex.keyframes({
      '0%, 100%': { opacity: 0.3 },
      '50%': { opacity: 1 },
    }),
    animationDuration: '1.2s',
    animationIterationCount: 'infinite',
  },
  promptCaption: {
    marginBlock: 0,
    marginBottom: '8px',
    flexShrink: 0,
    fontSize: '11.5px',
    color: '#6d7482',
  },
  promptArea: {
    flexGrow: 1,
    minHeight: 0,
    padding: '14px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#e2e5eb',
    borderRadius: '10px',
    backgroundColor: '#fafbfc',
    color: '#1f2330',
    fontFamily: '"SFMono-Regular", ui-monospace, Menlo, Consolas, monospace',
    fontSize: '12.5px',
    lineHeight: 1.7,
    resize: 'none',
  },
});

export function OutputPanel({ lane, hasImage, prompt, onPromptChange }: Props) {
  const [view, setView] = useState<'json' | 'prompt'>('prompt');

  const viewToggle = (
    <div {...stylex.props(styles.seg)} role="group" aria-label="表示切替">
      <button
        type="button"
        aria-pressed={view === 'prompt'}
        onClick={() => setView('prompt')}
        {...stylex.props(styles.segButton, view === 'prompt' && styles.segActive)}
      >
        プロンプト
      </button>
      <button
        type="button"
        aria-pressed={view === 'json'}
        onClick={() => setView('json')}
        {...stylex.props(styles.segButton, view === 'json' && styles.segActive)}
      >
        JSON
      </button>
    </div>
  );

  return (
    <Panel title={view === 'json' ? '出力 JSON' : 'プロンプト'} ariaLabel="出力" sizing="grow" actions={viewToggle}>
      {view === 'json' ? (
        <pre {...stylex.props(styles.output)}>
          {hasImage ? (
            <span {...stylex.props(styles.statusRow)}>
              <span {...stylex.props(styles.statusDot)} />
              <span {...stylex.props(styles.outputEmpty)}>レーン{lane.id}で解析中…（パイプライン未実装）</span>
            </span>
          ) : (
            <span {...stylex.props(styles.outputEmpty)}>画像を選択すると、レーン{lane.id}で自動解析されます。</span>
          )}
        </pre>
      ) : (
        <>
          <p {...stylex.props(styles.promptCaption)}>
            レーン {lane.id}: {lane.name}
          </p>
          <textarea
            {...stylex.props(styles.promptArea)}
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder={`レーン${lane.id}で使うプロンプト（編集・保存は後で実装）`}
            aria-label={`レーン${lane.id}のプロンプト`}
          />
        </>
      )}
    </Panel>
  );
}
