import * as stylex from '@stylexjs/stylex';
import { C_LANES, LANE_CATEGORY_LABEL, type LaneCategory, type LaneId } from '@/lanes';

type Props = {
  lane: LaneCategory;
  cModel: LaneId;
  onLaneChange: (lane: LaneCategory) => void;
  onCModelChange: (id: LaneId) => void;
};

const CATEGORY_ORDER: readonly LaneCategory[] = ['A', 'B', 'C'];

const styles = stylex.create({
  bottomBar: {
    flexShrink: 0,
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: '#e2e5eb',
    backgroundColor: '#ffffff',
    paddingBottom: 'env(safe-area-inset-bottom)',
  },
  modelRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    paddingBlock: '8px',
    paddingInline: '16px',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: '#eef0f3',
  },
  modelLabel: {
    flexShrink: 0,
    fontSize: '12.5px',
    fontWeight: 600,
    color: '#3c4250',
  },
  select: {
    flexGrow: 1,
    minWidth: 0,
    maxWidth: '360px',
    paddingBlock: '6px',
    paddingInline: '10px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#c7cbd4',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    color: '#1f2330',
    fontSize: '13px',
  },
  tabs: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
  tab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    paddingBlock: '8px',
    paddingBottom: '10px',
    paddingInline: '4px',
    borderWidth: 0,
    borderTopWidth: '3px',
    borderTopStyle: 'solid',
    borderTopColor: 'transparent',
    backgroundColor: 'transparent',
    color: '#6d7482',
    cursor: 'pointer',
    transitionProperty: 'color, border-color, background-color',
    transitionDuration: '120ms',
    ':hover': {
      color: '#4f46e5',
    },
  },
  tabActive: {
    borderTopColor: '#4f46e5',
    backgroundColor: '#fafbff',
    color: '#4f46e5',
  },
  tabId: {
    fontSize: '10.5px',
    fontWeight: 800,
    letterSpacing: '0.06em',
    color: 'inherit',
  },
  tabName: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'inherit',
  },
});

export function LaneFooter({ lane, cModel, onLaneChange, onCModelChange }: Props) {
  return (
    <footer {...stylex.props(styles.bottomBar)}>
      {lane === 'C' && (
        <div {...stylex.props(styles.modelRow)}>
          <label htmlFor="c-model-select" {...stylex.props(styles.modelLabel)}>
            モデル
          </label>
          <select
            id="c-model-select"
            value={cModel}
            onChange={(e) => onCModelChange(e.target.value as LaneId)}
            {...stylex.props(styles.select)}
          >
            {C_LANES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.id}: {l.name} ({l.costHint})
              </option>
            ))}
          </select>
        </div>
      )}

      <nav {...stylex.props(styles.tabs)} role="tablist" aria-label="評価レーン">
        {CATEGORY_ORDER.map((category) => (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={lane === category}
            onClick={() => onLaneChange(category)}
            {...stylex.props(styles.tab, lane === category && styles.tabActive)}
          >
            <span {...stylex.props(styles.tabId)}>{category}</span>
            <span {...stylex.props(styles.tabName)}>{LANE_CATEGORY_LABEL[category]}</span>
          </button>
        ))}
      </nav>
    </footer>
  );
}
