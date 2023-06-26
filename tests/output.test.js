import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {rmSync, statSync} from 'node:fs';
import {readdir, readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {before, describe, it} from 'node:test';

import {APIKEY, FILEKEY} from './.keys.js';

describe('JPG output run', () => {
  const DEFAULT_OUTPUT_DIR = resolve(process.cwd(), 'icon-library');
  const DEFAULT_JPG_DIR = resolve(process.cwd(), 'icon-library/jpg');
  const JPG_ICON_FILE_PATH =
      resolve(process.cwd(), 'icon-library/jpg/company.jpg');

  before(() => {
    rmSync(DEFAULT_OUTPUT_DIR,
        {recursive: true, force: true});
    const child = spawnSync('node',
        [
          resolve(process.cwd(), '.'),
          '--apikey', APIKEY,
          '--filekey', FILEKEY,
          '--nodeid', '0:1',
          '--format', 'jpg',
          '--optimize',
          '--jpgscale', '2.66',
        ],
        {
          encoding: 'utf8',
          shell: true,
        });
    if (child.output[2]) {
      console.log(child.output[2]);
    }
  });

  it('Creates jpg icon files', async () => {
    try {
      const jpgFiles = await readdir(DEFAULT_JPG_DIR);
      assert.deepEqual(jpgFiles,
          [
            'company.jpg',
            'entrepreneur.jpg',
            'family-1.jpg',
            'family-2.jpg',
            'mover.jpg',
            'senior.jpg',
            'traveler.jpg',
            'youth.jpg',
          ]);
    } catch (err) {
      console.error(err);
    }
  });

  it('File is optimized and scaled to custom size', () => {
    assert.equal(3230, statSync(JPG_ICON_FILE_PATH).size);
  });
});

describe('PNG output run', () => {
  const DEFAULT_OUTPUT_DIR = resolve(process.cwd(), 'icon-library');
  const DEFAULT_PNG_DIR = resolve(process.cwd(), 'icon-library/png');
  const PNG_ICON_FILE_PATH =
      resolve(process.cwd(), 'icon-library/png/company.png');

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
          '--optimize',
          '--pngscale', '2.66',
        ],
        {
          encoding: 'utf8',
          shell: true,
        });
    if (child.output[2]) {
      console.log(child.output[2]);
    }
  });

  it('Creates png icon files', async () => {
    try {
      const pngFiles = await readdir(DEFAULT_PNG_DIR);
      assert.deepEqual(pngFiles,
          [
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

  it('File is optimized and scaled to custom size', () => {
    assert.equal(535, statSync(PNG_ICON_FILE_PATH).size);
  });
});

describe('SVG output run', () => {
  const DEFAULT_OUTPUT_DIR = resolve(process.cwd(), 'icon-library');
  const DEFAULT_SVG_DIR = resolve(process.cwd(), 'icon-library/svg');
  const SVG_ICON_FILE_PATH =
      resolve(process.cwd(), 'icon-library/png/company.png');

  before(() => {
    rmSync(DEFAULT_OUTPUT_DIR,
        {recursive: true, force: true});
    const child = spawnSync('node',
        [
          resolve(process.cwd(), '.'),
          '--apikey', APIKEY,
          '--filekey', FILEKEY,
          '--nodeid', '0:1',
          '--format', 'svg',
          '--optimize',
        ],
        {
          encoding: 'utf8',
          shell: true,
        });
    if (child.output[2]) {
      console.log(child.output[2]);
    }
  });

  it('Creates svg icon files', async () => {
    try {
      const svgFiles = await readdir(DEFAULT_SVG_DIR);
      assert.deepEqual(svgFiles,
          [
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

  it('File is optimized', () => {
    assert.equal(304, statSync(SVG_ICON_FILE_PATH).size);
  });
});

describe('PDF output run', () => {
  const DEFAULT_OUTPUT_DIR = resolve(process.cwd(), 'icon-library');
  const DEFAULT_PDF_DIR = resolve(process.cwd(), 'icon-library/pdf');
  const PDF_ICON_FILE_PATH =
      resolve(process.cwd(), 'icon-library/pdf/company.pdf');

  before(() => {
    rmSync(DEFAULT_OUTPUT_DIR,
        {recursive: true, force: true});
    const child = spawnSync('node',
        [
          resolve(process.cwd(), '.'),
          '--apikey', APIKEY,
          '--filekey', FILEKEY,
          '--nodeid', '0:1',
          '--format', 'pdf',
        ],
        {
          encoding: 'utf8',
          shell: true,
        });
    if (child.output[2]) {
      console.log(child.output[2]);
    }
  });

  it('Creates pdf icon files', async () => {
    try {
      const pdfFiles = await readdir(DEFAULT_PDF_DIR);
      assert.deepEqual(pdfFiles,
          [
            'company.pdf',
            'entrepreneur.pdf',
            'family-1.pdf',
            'family-2.pdf',
            'mover.pdf',
            'senior.pdf',
            'traveler.pdf',
            'youth.pdf',
          ]);
    } catch (err) {
      console.error(err);
    }
  });

  it('File has expected contents', () => {
    assert.equal(1561, statSync(PDF_ICON_FILE_PATH).size);
  });
});

describe('CSS output run', () => {
  const DEFAULT_OUTPUT_DIR = resolve(process.cwd(), 'icon-library');
  const DEFAULT_CSS_DIR = resolve(process.cwd(), 'icon-library/css');
  const CSS_ICON_FILE_PATH =
      resolve(process.cwd(), 'icon-library/css/mock-company.css');
  const CSS_INDEX_FILE_PATH =
      resolve(process.cwd(), 'icon-library/css/icons.css');

  before(() => {
    rmSync(DEFAULT_OUTPUT_DIR,
        {recursive: true, force: true});
    const child = spawnSync('node',
        [
          resolve(process.cwd(), '.'),
          '--apikey', APIKEY,
          '--filekey', FILEKEY,
          '--nodeid', '0:1',
          '--format', 'css',
          '--cssprefix', 'mock-',
        ],
        {
          encoding: 'utf8',
          shell: true,
        });
    if (child.output[2]) {
      console.log(child.output[2]);
    }
  });

  it('Creates prefixed css icon files', async () => {
    try {
      const cssFiles = await readdir(DEFAULT_CSS_DIR);
      assert.deepEqual(cssFiles,
          [
            'icons.css',
            'mock-company.css',
            'mock-entrepreneur.css',
            'mock-family-1.css',
            'mock-family-2.css',
            'mock-mover.css',
            'mock-senior.css',
            'mock-traveler.css',
            'mock-youth.css',
          ]);
    } catch (err) {
      console.error(err);
    }
  });

  it('File has expected contents', () => {
    assert.equal(1022, statSync(CSS_ICON_FILE_PATH).size);
  });

  it('File index names are prefixed', async () => {
    const importChars =
        await readFile(CSS_INDEX_FILE_PATH, 'utf8');
    const importSlug = importChars.substring(0, 32);
    assert.equal(importSlug, '@import url(\"mock-company.css\")\;');
  });
});

describe('REACT output run', () => {
  const DEFAULT_OUTPUT_DIR = resolve(process.cwd(), 'icon-library');
  const DEFAULT_REACT_JSX_DIR =
      resolve(process.cwd(), 'icon-library/react/jsx');
  const JS_ICON_FILE_PATH =
      resolve(process.cwd(), 'icon-library/react/jsx/MockCompany.jsx');
  const JS_INDEX_FILE_PATH =
      resolve(process.cwd(), 'icon-library/react/jsx/index.js');

  before(() => {
    rmSync(DEFAULT_OUTPUT_DIR,
        {recursive: true, force: true});
    const child = spawnSync('node',
        [
          resolve(process.cwd(), '.'),
          '--apikey', APIKEY,
          '--filekey', FILEKEY,
          '--nodeid', '0:1',
          '--format', 'react',
          '--jsprefix', 'Mock',
        ],
        {
          encoding: 'utf8',
          shell: true,
        });
    if (child.output[2]) {
      console.log(child.output[2]);
    }
  });

  it('Creates prefixed react icon files', async () => {
    try {
      const reactFiles = await readdir(DEFAULT_REACT_JSX_DIR);
      assert.deepEqual(reactFiles,
          [
            'MockCompany.jsx',
            'MockEntrepreneur.jsx',
            'MockFamily1.jsx',
            'MockFamily2.jsx',
            'MockMover.jsx',
            'MockSenior.jsx',
            'MockTraveler.jsx',
            'MockYouth.jsx',
            'index.js',
          ]);
    } catch (err) {
      console.error(err);
    }
  });

  it('Component name is prefixed', async () => {
    const jsChars =
        await readFile(JS_ICON_FILE_PATH, 'utf8');
    const jsSlug = jsChars.substring(94, 105);
    assert.equal(jsSlug, 'MockCompany');
  });

  it('Component has expected contents', () => {
    assert.equal(959, statSync(JS_ICON_FILE_PATH).size);
  });

  it('File index names are prefixed', async () => {
    const exportChars =
        await readFile(JS_INDEX_FILE_PATH, 'utf8');
    const exportSlug = exportChars.substring(0, 42);
    assert.equal(exportSlug, 'export {MockCompany} from \'./MockCompany\'\;');
  });
});
