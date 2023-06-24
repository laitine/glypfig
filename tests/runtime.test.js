import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
import {before, describe, it} from 'node:test';

import {APIKEY, FILEKEY} from './.keys.js';

describe('Logging run', () => {
  let child = null;

  before(() => {
    child = spawnSync('node',
        [
          resolve(process.cwd(), '.'),
          '--apikey', APIKEY,
          '--filekey', FILEKEY,
          '--nodeid', '0:1',
          '--silent',
        ],
        {
          encoding: 'utf8',
          shell: true,
        });
  });

  it('Logging stays silent', () => {
    assert.equal(child.stdout, '');
  });
});

describe('Help run', () => {
  let child = null;

  before(() => {
    child = spawnSync('node',
        [
          resolve(process.cwd(), '.'),
          '--help',
        ],
        {
          encoding: 'utf8',
          shell: true,
        });
  });

  it('Prints manual', () => {
    const manualSlug = child.stdout.substring(0, 11);
    assert.equal(manualSlug, '.TH glypfig');
  });
});
