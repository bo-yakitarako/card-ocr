import { defineMiddleware } from 'void';

/**
 * StyleX compiles CSS in dev and serves it from `/virtual:stylex.css`.
 * Void renders its own HTML shell, so there is no `index.html` for the
 * StyleX plugin to inject into — add the dev stylesheet and HMR runtime here.
 * In production the compiled CSS is bundled into the emitted stylesheet instead.
 */
export default defineMiddleware(async (c, next) => {
  if (import.meta.env.DEV) {
    c.set('headDefaults', {
      link: [{ rel: 'stylesheet', href: '/virtual:stylex.css' }],
      script: [{ type: 'module', src: '/@id/virtual:stylex:runtime' }],
    });
  }

  await next();
});
