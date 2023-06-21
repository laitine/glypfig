import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {access, readdir, rm} from 'node:fs/promises';
import {resolve} from 'node:path';
import {before, describe, it} from 'node:test';

import {APIKEY, FILEKEY} from './.keys.js';

describe('Formats run', () => {
  const DEFAULT_OUTPUT_DIR = resolve(process.cwd(), 'icon-library');
  const DEFAULT_JPG_DIR = resolve(process.cwd(), 'icon-library/jpg');
  const DEFAULT_PNG_DIR = resolve(process.cwd(), 'icon-library/png');
  const DEFAULT_SVG_DIR = resolve(process.cwd(), 'icon-library/svg');
  const DEFAULT_PDF_DIR = resolve(process.cwd(), 'icon-library/pdf');
  const DEFAULT_CSS_DIR = resolve(process.cwd(), 'icon-library/css');
  const DEFAULT_REACT_TSX_DIR =
      resolve(process.cwd(), 'icon-library/react/tsx');

  before(async () => {
    await rm(DEFAULT_OUTPUT_DIR,
        {recursive: true, force: true});
    spawnSync('node',
        [
          resolve(process.cwd(), '.'),
          '--apikey', APIKEY,
          '--filekey', FILEKEY,
          '--nodeid', '0:1',
          '--format', 'jpg,png,svg,pdf,css,react',
          '--template', 'tsx',
        ],
        {
          shell: true,
        });
  });

  it('Creates builds in all formats', async () => {
    assert.ifError(await access(DEFAULT_JPG_DIR));
    assert.ifError(await access(DEFAULT_PNG_DIR));
    assert.ifError(await access(DEFAULT_SVG_DIR));
    assert.ifError(await access(DEFAULT_PDF_DIR));
    assert.ifError(await access(DEFAULT_CSS_DIR));
    assert.ifError(await access(DEFAULT_REACT_TSX_DIR));
  });

  it('Creates jpg files', async () => {
    try {
      const jpgFiles = await readdir(DEFAULT_JPG_DIR);
      assert.deepEqual(jpgFiles,
          [
            'company.jpg',
            'entrepreneur.jpg',
            'family.jpg',
            'mover.jpg',
            'senior.jpg',
            'traveler.jpg',
            'youth.jpg',
          ]);
    } catch (err) {
      console.error(err);
    }
  });

  it('Creates pdf files', async () => {
    try {
      const pdfFiles = await readdir(DEFAULT_PDF_DIR);
      assert.deepEqual(pdfFiles,
          [
            'company.pdf',
            'entrepreneur.pdf',
            'family.pdf',
            'mover.pdf',
            'senior.pdf',
            'traveler.pdf',
            'youth.pdf',
          ]);
    } catch (err) {
      console.error(err);
    }
  });

  it('Creates css files', async () => {
    try {
      const cssFiles = await readdir(DEFAULT_CSS_DIR);
      assert.deepEqual(cssFiles,
          [
            'icon-company.css',
            'icon-entrepreneur.css',
            'icon-family.css',
            'icon-mover.css',
            'icon-senior.css',
            'icon-traveler.css',
            'icon-youth.css',
            'icons.css',
          ]);
    } catch (err) {
      console.error(err);
    }
  });

  it('Creates react files in tsx', async () => {
    try {
      const reactFiles = await readdir(DEFAULT_REACT_TSX_DIR);
      assert.deepEqual(reactFiles,
          [
            'IconCompany.tsx',
            'IconEntrepreneur.tsx',
            'IconFamily.tsx',
            'IconMover.tsx',
            'IconSenior.tsx',
            'IconTraveler.tsx',
            'IconYouth.tsx',
            'index.ts',
          ]);
    } catch (err) {
      console.error(err);
    }
  });
});
