import { RuleTester } from 'vite-plus/lint/plugins-dev';
import { describe, expect, it } from 'vitest';
import plugin from './index.mjs';

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester();
const rule = plugin.rules['naming-convention'];

ruleTester.run('naming-convention', rule, {
  valid: [
    { code: 'export {}', filename: 'src/components/ImageInputPanel.tsx' },
    { code: 'export {}', filename: 'src/ui/Button.tsx' },
    { code: 'export {}', filename: 'pages/index.tsx' },
    { code: 'export {}', filename: 'pages/[id].tsx' },
    { code: 'export {}', filename: 'src/lanes.ts' },
    { code: 'export {}', filename: 'src/[id].ts' },
    { code: 'export {}', filename: 'src/lanes.test.ts' },
    { code: 'export {}', filename: 'middleware/01.stylex.ts' },
    { code: 'export {}', filename: 'src/my-components/Foo.tsx' },
    { code: 'const x = 1;', filename: 'lint/no-page-fetch/no-page-fetch.test.mjs' },
    { code: 'const x = 1;', filename: 'vite.config.ts' },
    { code: 'const x = 1;', filename: 'tests/Example.e2e.ts' },
    // アプリディレクトリ判定は先頭アンカー: 途中に src/ を含むだけでは対象外
    { code: 'const x = 1;', filename: 'tests/src/bad_name.tsx' },
    // 対象拡張子 (.tsx.bak のように末尾が対象拡張子でないもの) は判定しない
    { code: 'const x = 1;', filename: 'src/Bad.tsx.bak' },
  ],
  invalid: [
    {
      code: 'export {}',
      filename: 'src/components/image-input-panel.tsx',
      errors: [
        {
          message:
            '.tsx files must be PascalCase: image-input-panel.tsx (index.tsx is the only exception). Put helper components in src/components/.',
        },
      ],
    },
    {
      code: 'export {}',
      filename: 'src/Lanes.ts',
      errors: [{ message: 'Files other than .tsx must be camelCase: Lanes.ts' }],
    },
    {
      code: 'export {}',
      filename: 'src/myComponents/Foo.tsx',
      errors: [{ message: 'Directory "myComponents" must be kebab-case.' }],
    },
    {
      code: 'export {}',
      filename: 'src/components/myPanel.tsx',
      errors: [
        {
          message:
            '.tsx files must be PascalCase: myPanel.tsx (index.tsx is the only exception). Put helper components in src/components/.',
        },
      ],
    },
    // 末尾アンカー必須: プレフィックスだけ PascalCase/camelCase でも全体が不一致なら違反
    {
      code: 'export {}',
      filename: 'src/Bad_name.tsx',
      errors: [
        {
          message:
            '.tsx files must be PascalCase: Bad_name.tsx (index.tsx is the only exception). Put helper components in src/components/.',
        },
      ],
    },
    {
      code: 'export {}',
      filename: 'src/lanes_foo.ts',
      errors: [{ message: 'Files other than .tsx must be camelCase: lanes_foo.ts' }],
    },
  ],
});

// RuleTester の filename オプションだけでは context の各フォールバック
// (physicalFilename / getFilename / getCwd / パス正規化) を分岐させられないため、
// create() をフェイク context で直接呼んで報告された messageId を検証する。
const reportIds = (context) => {
  const reports = [];
  const visitors = rule.create({
    filename: '',
    physicalFilename: undefined,
    cwd: '',
    getFilename: () => context.filename ?? '',
    getCwd: () => context.cwd ?? '',
    report: (descriptor) => reports.push(descriptor),
    ...context,
  });
  visitors.Program?.({ type: 'Program' });
  return reports.map((descriptor) => descriptor.messageId);
};

describe('naming-convention context handling', () => {
  it('uses the plugin name expected by vite.config.ts', () => {
    expect(plugin.meta.name).toBe('local');
  });

  it('判定にはプロジェクト相対パスを使う (cwd + 絶対filename)', () => {
    expect(reportIds({ filename: '/repo/src/bad_name.tsx', cwd: '/repo' })).toEqual(['tsxNotPascal']);
  });

  it('filename が無い context では physicalFilename にフォールバックする', () => {
    expect(reportIds({ filename: undefined, physicalFilename: 'pages/bad_name.tsx', cwd: '/repo' })).toEqual([
      'tsxNotPascal',
    ]);
  });

  it('filename も physicalFilename も無い context では getFilename() にフォールバックする', () => {
    expect(
      reportIds({
        filename: undefined,
        physicalFilename: undefined,
        cwd: '/repo',
        getFilename: () => 'pages/bad_name.tsx',
      }),
    ).toEqual(['tsxNotPascal']);
  });

  it('cwd が無い context では getCwd() にフォールバックする', () => {
    expect(
      reportIds({
        filename: '/repo/src/bad_name.tsx',
        cwd: null,
        getCwd: () => '/repo',
      }),
    ).toEqual(['tsxNotPascal']);
  });

  it('cwd 配下でない filename はそのまま相対パスとして扱う', () => {
    expect(reportIds({ filename: 'src/bad_name.tsx', cwd: '/repo' })).toEqual(['tsxNotPascal']);
  });

  it('cwd が空でもアプリディレクトリ配下の相対パスを判定する', () => {
    expect(reportIds({ filename: 'src/bad_name.tsx', cwd: '' })).toEqual(['tsxNotPascal']);
  });

  it('Windows 形式のバックスラッシュ区切りパスを正規化して判定する', () => {
    expect(reportIds({ filename: 'C:\\repo\\src\\bad_name.tsx', cwd: 'C:\\repo' })).toEqual(['tsxNotPascal']);
  });

  it('動的ルートセグメント [id] は PascalCase/camelCase の例外とする', () => {
    expect(reportIds({ filename: 'pages/[id].tsx', cwd: '/repo' })).toEqual([]);
    expect(reportIds({ filename: 'src/[id].ts', cwd: '/repo' })).toEqual([]);
  });

  it('getFilename/getCwd を持たない context でも例外を投げずに判定する', () => {
    expect(
      reportIds({
        filename: undefined,
        physicalFilename: undefined,
        getFilename: undefined,
        cwd: '/repo',
      }),
    ).toEqual([]);
    expect(reportIds({ filename: 'src/bad_name.tsx', cwd: undefined, getCwd: undefined })).toEqual(['tsxNotPascal']);
  });

  it('cwd が得られない場合は filename をそのまま相対パスとして扱う', () => {
    expect(
      reportIds({
        filename: 'Stryker was here!/src/bad_name.tsx',
        cwd: null,
        getCwd: undefined,
      }),
    ).toEqual([]);
  });

  it('先頭の ./ は取り除くが途中の ./ には触れない', () => {
    expect(reportIds({ filename: './src/bad_name.tsx', cwd: '/repo' })).toEqual(['tsxNotPascal']);
    expect(reportIds({ filename: 'src/./bad_name.tsx', cwd: '/repo' })).toEqual(['dirNotKebab', 'tsxNotPascal']);
  });
});
