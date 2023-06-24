import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {rmSync} from 'node:fs';
import {readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {before, describe, it} from 'node:test';

import {APIKEY, FILEKEY} from './.keys.js';

describe('Multiple with same name run', () => {
  const DEFAULT_OUTPUT_DIR = resolve(process.cwd(), 'icon-library');
  const DEFAULT_REACT_JSX_DIR =
      resolve(process.cwd(), 'icon-library/react/jsx');

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
        ],
        {
          encoding: 'utf8',
          shell: true,
        });
    if (child.output[2]) {
      console.log(child.output[2]);
    }
  });

  it('Outputs files with same names numbered', async () => {
    try {
      const reactFiles = await readdir(DEFAULT_REACT_JSX_DIR);
      assert.deepEqual(reactFiles,
          [
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

describe('Multiple with same name using property names run', () => {
  const DEFAULT_OUTPUT_DIR = resolve(process.cwd(), 'icon-library');
  const DEFAULT_REACT_JSX_DIR =
      resolve(process.cwd(), 'icon-library/react/jsx');

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
          '--propnames',
        ],
        {
          encoding: 'utf8',
          shell: true,
        });
    if (child.output[2]) {
      console.log(child.output[2]);
    }
  });

  it('Outputs files with differential property names', async () => {
    try {
      const reactFiles = await readdir(DEFAULT_REACT_JSX_DIR);
      assert.deepEqual(reactFiles,
          [
            'IconCompany.jsx',
            'IconEntrepreneur.jsx',
            'IconFamilyColorDefaultSizeLarge.jsx',
            'IconFamilyColorDefaultSizeRegular.jsx',
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

describe('Single filter output run', () => {
  const DEFAULT_OUTPUT_DIR = resolve(process.cwd(), 'icon-library');
  const DEFAULT_REACT_JSX_DIR =
      resolve(process.cwd(), 'icon-library/react/jsx');

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
          '--filter', 'Color=Default',
        ],
        {
          encoding: 'utf8',
          shell: true,
        });
    if (child.output[2]) {
      console.log(child.output[2]);
    }
  });

  it('Outputs only icons with one property', async () => {
    try {
      const reactFiles = await readdir(DEFAULT_REACT_JSX_DIR);
      assert.deepEqual(reactFiles,
          [
            'IconFamily1.jsx',
            'IconFamily2.jsx',
            'index.js',
          ]);
    } catch (err) {
      console.error(err);
    }
  });
});

describe('Single filter with property names output run', () => {
  const DEFAULT_OUTPUT_DIR = resolve(process.cwd(), 'icon-library');
  const DEFAULT_REACT_JSX_DIR =
      resolve(process.cwd(), 'icon-library/react/jsx');

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
          '--filter', 'Color=Default',
          '--propnames',
        ],
        {
          encoding: 'utf8',
          shell: true,
        });
    if (child.output[2]) {
      console.log(child.output[2]);
    }
  });

  it('Outputs only icons with one property using property names', async () => {
    try {
      const reactFiles = await readdir(DEFAULT_REACT_JSX_DIR);
      assert.deepEqual(reactFiles,
          [
            'IconFamilyColorDefaultSizeLarge.jsx',
            'IconFamilyColorDefaultSizeRegular.jsx',
            'index.js',
          ]);
    } catch (err) {
      console.error(err);
    }
  });
});

describe('Multiple filter output run', () => {
  const DEFAULT_OUTPUT_DIR = resolve(process.cwd(), 'icon-library');
  const DEFAULT_REACT_JSX_DIR =
      resolve(process.cwd(), 'icon-library/react/jsx');

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
          '--filter', 'Color=Default,Size=Regular',
        ],
        {
          encoding: 'utf8',
          shell: true,
        });
    if (child.output[2]) {
      console.log(child.output[2]);
    }
  });

  it('Outputs only icons matching two properties', async () => {
    try {
      const reactFiles = await readdir(DEFAULT_REACT_JSX_DIR);
      assert.deepEqual(reactFiles,
          [
            'IconFamily.jsx',
            'index.js',
          ]);
    } catch (err) {
      console.error(err);
    }
  });
});

describe('Multiple filter with property names output run', () => {
  const DEFAULT_OUTPUT_DIR = resolve(process.cwd(), 'icon-library');
  const DEFAULT_REACT_JSX_DIR =
      resolve(process.cwd(), 'icon-library/react/jsx');

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
          '--filter', 'Color=Default,Size=Regular',
          '--propnames',
        ],
        {
          encoding: 'utf8',
          shell: true,
        });
    if (child.output[2]) {
      console.log(child.output[2]);
    }
  });

  it('Outputs only icons with multiple properties using property names',
      async () => {
        try {
          const reactFiles = await readdir(DEFAULT_REACT_JSX_DIR);
          assert.deepEqual(reactFiles,
              [
                'IconFamilyColorDefaultSizeRegular.jsx',
                'index.js',
              ]);
        } catch (err) {
          console.error(err);
        }
      });
});
