import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';

type PanelProps = {
  title: string;
  ariaLabel: string;
  /** 'grow' でSP縦積み時に残り高さを占有。既定は内容量に従う固定高 */
  sizing?: 'fixed' | 'grow';
  /** ヘッダー右側に置く要素(トグル等) */
  actions?: ReactNode;
  children: ReactNode;
};

const styles = stylex.create({
  panel: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    padding: '14px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#e2e5eb',
    borderRadius: '14px',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  fixed: {
    flexShrink: 0,
  },
  grow: {
    flexGrow: 1,
  },
  head: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: '8px',
    marginBottom: '10px',
    flexShrink: 0,
  },
  title: {
    margin: 0,
    fontSize: '13.5px',
    fontWeight: 700,
  },
});

export function Panel({ title, ariaLabel, sizing = 'fixed', actions, children }: PanelProps) {
  return (
    <section
      {...stylex.props(styles.panel, sizing === 'grow' && styles.grow, sizing === 'fixed' && styles.fixed)}
      aria-label={ariaLabel}
    >
      <div {...stylex.props(styles.head)}>
        <h2 {...stylex.props(styles.title)}>{title}</h2>
        {actions}
      </div>
      {children}
    </section>
  );
}
