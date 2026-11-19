import * as stylex from '@stylexjs/stylex';
import { Button } from '@/ui/button';
import '@/styles.css';

const styles = stylex.create({
  page: {
    display: 'grid',
    placeItems: 'center',
    minHeight: '100dvh',
    padding: '24px',
    backgroundColor: '#f6f7f9',
    color: '#111318',
    fontFamily:
      '"Noto Sans JP", "Noto Sans CJK JP", "Hiragino Sans", "Hiragino Kaku Gothic ProN", system-ui, -apple-system, "Segoe UI", sans-serif',
  },
  card: {
    width: '100%',
    maxWidth: '560px',
    paddingBlock: '32px',
    paddingInline: '32px',
    borderRadius: '16px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#e2e5eb',
    backgroundColor: '#ffffff',
    boxShadow: '0 18px 40px -12px rgb(16 24 40 / 0.12)',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
    paddingBlock: '4px',
    paddingInline: '10px',
    borderRadius: '999px',
    backgroundColor: '#eef0ff',
    color: '#4f46e5',
    fontSize: '12px',
    fontWeight: 600,
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '999px',
    backgroundColor: '#4f46e5',
  },
  title: {
    margin: 0,
    fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
    lineHeight: 1.2,
    letterSpacing: '-0.03em',
    fontWeight: 800,
  },
  lead: {
    marginBlock: '12px',
    marginInline: 0,
    fontSize: '15px',
    lineHeight: 1.8,
    color: '#5b6270',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBlock: '24px',
    marginInline: 0,
    paddingInline: '20px',
    fontSize: '14px',
    lineHeight: 1.7,
    color: '#3c4250',
  },
  code: {
    paddingBlock: '1px',
    paddingInline: '5px',
    borderRadius: '5px',
    backgroundColor: '#f1f3f6',
    fontFamily: '"SFMono-Regular", ui-monospace, Menlo, Consolas, monospace',
    fontSize: '0.9em',
  },
  buttonRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
  },
  note: {
    margin: 0,
    paddingTop: '20px',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: '#e2e5eb',
    fontSize: '12.5px',
    lineHeight: 1.7,
    color: '#6d7482',
  },
});

export default function HomePage() {
  return (
    <main {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.card)}>
        <span {...stylex.props(styles.badge)}>
          <span {...stylex.props(styles.dot)} />
          StyleX ready
        </span>

        <h1 {...stylex.props(styles.title)}>Welcome to Void</h1>
        <p {...stylex.props(styles.lead)}>
          React + Void で StyleX を使うためのスターターです。このページを書き換えて始めてください。
        </p>

        <ul {...stylex.props(styles.list)}>
          <li>
            スタイルは <code {...stylex.props(styles.code)}>stylex.create()</code> で定義
          </li>
          <li>
            JSX へは <code {...stylex.props(styles.code)}>stylex.props()</code> をスプレッド （
            <code {...stylex.props(styles.code)}>className</code> と <code {...stylex.props(styles.code)}>style</code>{' '}
            を返す）
          </li>
          <li>
            dev では <code {...stylex.props(styles.code)}>middleware/01.stylex.ts</code> が仮想 CSS を注入
          </li>
          <li>本番ビルドでは CSS が自動でアセットにまとめられる</li>
        </ul>

        <div {...stylex.props(styles.buttonRow)}>
          <Button>Solid</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Disabled</Button>
        </div>

        <p {...stylex.props(styles.note)}>
          <code {...stylex.props(styles.code)}>pages/*.server.ts</code>、{' '}
          <code {...stylex.props(styles.code)}>routes/</code>、 <code {...stylex.props(styles.code)}>void/db</code>{' '}
          を追加すると、フルスタック機能に広がる
        </p>
      </div>
    </main>
  );
}
