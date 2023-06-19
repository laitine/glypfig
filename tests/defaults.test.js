import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {access, readdir, rm} from 'node:fs/promises';
import {resolve} from 'node:path';
import {before, describe, it} from 'node:test';

import {APIKEY, FILEKEY} from './.keys.js';

describe('Default run', () => {
  const DEFAULT_OUTPUT_DIR = resolve(process.cwd(), 'icon-library');
  const DEFAULT_PNG_DIR = resolve(process.cwd(), 'icon-library/png');
  const DEFAULT_SVG_DIR = resolve(process.cwd(), 'icon-library/svg');
  const DEFAULT_REACT_JSX_DIR =
      resolve(process.cwd(), 'icon-library/react/jsx');

  before(async () => {
    await rm(DEFAULT_OUTPUT_DIR,
        {recursive: true, force: true});
    spawnSync('node',
        [
          resolve(process.cwd(), '.'),
          '--apikey', APIKEY,
          '--filekey', FILEKEY,
          '--nodeid', '0:1',
        ],
        {
          shell: true,
        });
  });

  it('Creates build directory', async () => {
    assert.ifError(await access(DEFAULT_OUTPUT_DIR));
  });

  it('Creates default format png, svg and react directories', async () => {
    assert.ifError(await access(DEFAULT_PNG_DIR));
    assert.ifError(await access(DEFAULT_SVG_DIR));
    assert.ifError(await access(DEFAULT_REACT_JSX_DIR));
  });

  it('Creates png files', async () => {
    try {
      const pngFiles = await readdir(DEFAULT_PNG_DIR);
      assert.deepEqual(pngFiles,
          [
            'company.png',
            'entrepreneur.png',
            'family.png',
            'mover.png',
            'senior.png',
            'traveler.png',
            'youth.png',
          ]);
    } catch (err) {
      console.error(err);
    }
  });

  it('Creates svg files', async () => {
    try {
      const svgFiles = await readdir(DEFAULT_SVG_DIR);
      assert.deepEqual(svgFiles,
          [
            'company.svg',
            'entrepreneur.svg',
            'family.svg',
            'mover.svg',
            'senior.svg',
            'traveler.svg',
            'youth.svg',
          ]);
    } catch (err) {
      console.error(err);
    }
  });

  it('Creates react files', async () => {
    try {
      const reactFiles = await readdir(DEFAULT_REACT_JSX_DIR);
      assert.deepEqual(reactFiles,
          [
            'IconCompany.jsx',
            'IconEntrepreneur.jsx',
            'IconFamily.jsx',
            'IconMover.jsx',
            'IconSenior.jsx',
            'IconTraveler.jsx',
            'IconYouth.jsx',
            'index.js',
          ]);
    } catch (err) {
      console.error(err);
    }
  });
});
