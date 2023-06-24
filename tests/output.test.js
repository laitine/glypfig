import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {rmSync} from 'node:fs';
import {readdir, readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {before, describe, it} from 'node:test';

import {APIKEY, FILEKEY} from './.keys.js';

describe('JPG output run', () => {
  const DEFAULT_OUTPUT_DIR = resolve(process.cwd(), 'icon-library');
  const DEFAULT_JPG_DIR = resolve(process.cwd(), 'icon-library/jpg');

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

  it('Files scaled to custom size', async () => {
    // TODO
  });

  it('Files optimized', async () => {
    // TODO
  });
});

describe('PNG output run', () => {
  const DEFAULT_OUTPUT_DIR = resolve(process.cwd(), 'icon-library');
  const DEFAULT_PNG_DIR = resolve(process.cwd(), 'icon-library/png');

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

  it('Files scaled to custom size', async () => {
    // TODO
  });

  it('Files optimized', async () => {
    // TODO
  });
});

describe('SVG output run', () => {
  const DEFAULT_OUTPUT_DIR = resolve(process.cwd(), 'icon-library');
  const DEFAULT_SVG_DIR = resolve(process.cwd(), 'icon-library/svg');

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

  it('Files optimized', async () => {
    // TODO
  });
});

describe('PDF output run', () => {
  const DEFAULT_OUTPUT_DIR = resolve(process.cwd(), 'icon-library');
  const DEFAULT_PDF_DIR = resolve(process.cwd(), 'icon-library/pdf');

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
});

describe('CSS output run', () => {
  const DEFAULT_OUTPUT_DIR = resolve(process.cwd(), 'icon-library');
  const DEFAULT_CSS_DIR = resolve(process.cwd(), 'icon-library/css');

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

  it('Creates css icon files', async () => {
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

  it('File index names are prefixed', async () => {
    // TODO
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

  it('Creates react icon files', async () => {
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
    const jsSlug = jsChars.substring(91, 102);
    assert.equal(jsSlug, 'MockCompany');
  });

  it('File index names are prefixed', async () => {
    const exportChars =
        await readFile(JS_INDEX_FILE_PATH, 'utf8');
    const exportSlug = exportChars.substring(0, 41);
    assert.equal(exportSlug, 'export {MockCompany} from \'./MockCompany\'');
  });
});
