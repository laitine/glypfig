import 'dotenv/config';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { access, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { before, describe, it } from 'node:test';

describe('Default run', () => {
  const DEFAULT_OUTPUT_DIR = resolve(process.cwd(), 'icon-library');
  const DEFAULT_PNG_DIR = resolve(process.cwd(), 'icon-library/png');
  const DEFAULT_SVG_DIR = resolve(process.cwd(), 'icon-library/svg');
  const DEFAULT_REACT_JSX_DIR = resolve(
    process.cwd(),
    'icon-library/react/jsx'
  );

  before(() => {
    rmSync(DEFAULT_OUTPUT_DIR, { recursive: true, force: true });
    const child = spawnSync(
      'node',
      [
        resolve(process.cwd(), '.'),
        '--apikey',
        process.env.FIGMA_API_KEY,
        '--filekey',
        process.env.FIGMA_FILE_KEY,
        '--nodeid',
        process.env.FIGMA_NODE_ID,
      ],
      {
        encoding: 'utf8',
        shell: true,
      }
    );
    if (child.output[2]) {
      console.log(child.output[2]);
    }
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
      assert.deepEqual(pngFiles, [
        'company.png',
        'entrepreneur.png',
        'family-1.png',
        'family-2.png',
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
      assert.deepEqual(svgFiles, [
        'company.svg',
        'entrepreneur.svg',
        'family-1.svg',
        'family-2.svg',
        'mover.svg',
        'senior.svg',
        'traveler.svg',
        'youth.svg',
      ]);
    } catch (err) {
      console.error(err);
    }
  });

  it('Creates react files in jsx', async () => {
    try {
      const reactFiles = await readdir(DEFAULT_REACT_JSX_DIR);
      assert.deepEqual(reactFiles, [
        'IconCompany.jsx',
        'IconEntrepreneur.jsx',
        'IconFamily1.jsx',
        'IconFamily2.jsx',
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
