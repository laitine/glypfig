import "dotenv/config";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { before, describe, it } from "node:test";

describe("Logging run", () => {
  let child = null;

  before(() => {
    child = spawnSync(
      "node",
      [
        resolve(process.cwd(), "."),
        "--apikey",
        process.env.FIGMA_API_KEY,
        "--filekey",
        process.env.FIGMA_FILE_KEY,
        "--nodeid",
        process.env.FIGMA_NODE_ID,
        "--silent",
      ],
      {
        encoding: "utf8",
        shell: true,
      }
    );
    if (child.output[2]) {
      console.log(child.output[2]);
    }
  });

  it("Logging stays silent", () => {
    assert.equal(child.stdout, "");
  });
});

describe("Help run", () => {
  let child = null;

  before(() => {
    child = spawnSync("node", [resolve(process.cwd(), "."), "--help"], {
      encoding: "utf8",
      shell: true,
    });
    if (child.output[2]) {
      console.log(child.output[2]);
    }
  });

  it("Prints manual", () => {
    const manualSlug = child.stdout.substring(0, 11);
    assert.equal(manualSlug, ".TH glypfig");
  });
});
