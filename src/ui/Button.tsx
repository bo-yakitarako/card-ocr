import { Button as BaseButton } from '@base-ui/react/button';
import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';

type ButtonVariant = 'solid' | 'outline' | 'ghost';

type ButtonProps = Omit<React.ComponentPropsWithoutRef<typeof BaseButton>, 'className'> & {
  variant?: ButtonVariant;
  sx?: StyleXStyles;
};

const styles = stylex.create({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    paddingBlock: '8px',
    paddingInline: '14px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: 1.4,
    cursor: 'pointer',
    transitionProperty: 'background-color, color, border-color',
    transitionDuration: '120ms',
    ':focus-visible': {
      outline: '2px solid #4f46e5',
      outlineOffset: '2px',
    },
  },
  solid: {
    borderColor: 'transparent',
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    ':hover': { backgroundColor: '#4338ca' },
    ':active': { backgroundColor: '#3730a3' },
  },
  outline: {
    borderColor: '#c7cbd4',
    backgroundColor: '#ffffff',
    color: '#1f2330',
    ':hover': { backgroundColor: '#f4f5f7' },
    ':active': { backgroundColor: '#eceef1' },
  },
  ghost: {
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    color: '#3c4250',
    ':hover': { backgroundColor: '#eceef1' },
    ':active': { backgroundColor: '#e2e5eb' },
  },
  disabled: {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
});

/**
 * Base UI の Button に StyleX スタイルを適用したラッパー。
 * Base UI の className は状態を受け取る関数を受け付けるため、
 * stylex.props() の結果をその中で条件付き合成する。
 */
export function Button({ variant = 'solid', sx, ...props }: ButtonProps) {
  return (
    <BaseButton
      {...props}
      className={(state) => stylex.props(styles.root, styles[variant], state.disabled && styles.disabled, sx).className}
    />
  );
}
