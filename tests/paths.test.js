import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {rmSync} from 'node:fs';
import {access, readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {before, describe, it} from 'node:test';

import {APIKEY, FILEKEY} from './.keys.js';

describe('Paths run', () => {
  const DEFAULT_OUTPUT_DIR = resolve(process.cwd(), 'icon-library-alt');
  const DEFAULT_JPG_DIR = resolve(process.cwd(), 'icon-library-alt/jpg');
  const DEFAULT_PNG_DIR = resolve(process.cwd(), 'icon-library-alt/png');
  const DEFAULT_SVG_DIR = resolve(process.cwd(), 'icon-library-alt/svg');
  const DEFAULT_PDF_DIR = resolve(process.cwd(), 'icon-library-alt/pdf');
  const DEFAULT_CSS_DIR = resolve(process.cwd(), 'icon-library-alt/css');
  const DEFAULT_REACT_JSX_DIR =
      resolve(process.cwd(), 'icon-library-alt/react/jsx');
  const CSS_ICON_FILE_PATH =
      resolve(process.cwd(), 'icon-library-alt/css/icon-company.css');
  const JS_ICON_FILE_PATH =
      resolve(process.cwd(), 'icon-library-alt/react/jsx/IconCompany.jsx');
  const LICENSE_FILE_PATH = resolve(process.cwd(), 'icon-library-alt/LICENSE');

  before(() => {
    rmSync(DEFAULT_OUTPUT_DIR,
        {recursive: true, force: true});
    const child = spawnSync('node',
        [
          resolve(process.cwd(), '.'),
          '--apikey', APIKEY,
          '--filekey', FILEKEY,
          '--nodeid', '0:1',
          '--format', 'jpg,png,svg,pdf,css,react',
          '--output', './icon-library-alt',
          '--csspath', './tests/css-mock-template.eta',
          '--jspath', './tests/react-jsx-mock-template.eta',
          '--license', './LICENSE',
        ],
        {
          encoding: 'utf8',
          shell: true,
        });
    if (child.output[2]) {
      console.log(child.output[2]);
    }
  });

  it('Creates build at custom path', async () => {
    assert.ifError(await access(DEFAULT_OUTPUT_DIR));
  });

  it('Creates all formats at custom path', async () => {
    assert.ifError(await access(DEFAULT_JPG_DIR));
    assert.ifError(await access(DEFAULT_PNG_DIR));
    assert.ifError(await access(DEFAULT_SVG_DIR));
    assert.ifError(await access(DEFAULT_PDF_DIR));
    assert.ifError(await access(DEFAULT_CSS_DIR));
    assert.ifError(await access(DEFAULT_REACT_JSX_DIR));
  });

  it('Uses custom css template', async () => {
    const cssChars =
        await readFile(CSS_ICON_FILE_PATH, 'utf8');
    const cssSlug = cssChars.substring(0, 9);
    assert.equal(cssSlug, '.css-mock');
  });

  it('Uses custom js template', async () => {
    const jsChars =
        await readFile(JS_ICON_FILE_PATH, 'utf8');
    const jsSlug = jsChars.substring(0, 10);
    assert.equal(jsSlug, '// js-mock');
  });

  it('Copies custom license file', async () => {
    assert.ifError(await access(LICENSE_FILE_PATH));
  });
});

describe('Default license file run', () => {
  const DEFAULT_OUTPUT_DIR = resolve(process.cwd(), 'icon-library');
  const DEFAULT_LICENSE_FILE_PATH =
      resolve(process.cwd(), 'icon-library/LICENSE.txt');

  before(() => {
    rmSync(DEFAULT_OUTPUT_DIR,
        {recursive: true, force: true});
    const child = spawnSync('node',
        [
          resolve(process.cwd(), '.'),
          '--apikey', APIKEY,
          '--filekey', FILEKEY,
          '--nodeid', '0:1',
          '--format', 'png',
          '--license', '\'\'',
        ],
        {
          encoding: 'utf8',
          shell: true,
        });
    if (child.output[2]) {
      console.log(child.output[2]);
    }
  });

  it('Creates license file in output directory', async () => {
    assert.ifError(await access(DEFAULT_LICENSE_FILE_PATH));
  });
});
