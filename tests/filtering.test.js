import "dotenv/config";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { rmSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { before, describe, it } from "node:test";

describe("Multiple with same name run", () => {
  const DEFAULT_OUTPUT_DIR = resolve(process.cwd(), "icon-library");
  const DEFAULT_REACT_JSX_DIR = resolve(
    process.cwd(),
    "icon-library/react/jsx"
  );
  const JSX_ICON1_FILE_PATH = resolve(
    process.cwd(),
    "icon-library/react/jsx/IconFamily1.jsx"
  );
  const JSX_ICON2_FILE_PATH = resolve(
    process.cwd(),
    "icon-library/react/jsx/IconFamily2.jsx"
  );
  const JSX_INDEX_FILE_PATH = resolve(
    process.cwd(),
    "icon-library/react/jsx/index.js"
  );

  before(() => {
    rmSync(DEFAULT_OUTPUT_DIR, { recursive: true, force: true });
    const child = spawnSync(
      "node",
      [
        resolve(process.cwd(), "."),
        "--apikey",
        process.env.FIGMA_API_KEY,
        "--filekey",
        process.env.FIGMA_FILE_KEY,
        "--nodeid",
        process.env.FIGMA_NODE_ID,
        "--format",
        "react",
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

  it("Files with same name as numbered", async () => {
    try {
      const reactFiles = await readdir(DEFAULT_REACT_JSX_DIR);
      assert.deepEqual(reactFiles, [
        "IconCompany.jsx",
        "IconEntrepreneur.jsx",
        "IconFamily1.jsx",
        "IconFamily2.jsx",
        "IconMover.jsx",
        "IconSenior.jsx",
        "IconTraveler.jsx",
        "IconYouth.jsx",
        "index.js",
      ]);
    } catch (err) {
      console.error(err);
    }
  });

  it("Component names are numbered", async () => {
    const jsxChars1 = await readFile(JSX_ICON1_FILE_PATH, "utf8");
    const jsxChars2 = await readFile(JSX_ICON2_FILE_PATH, "utf8");
    const jsxSlug1 = jsxChars1.substring(94, 105);
    const jsxSlug2 = jsxChars2.substring(94, 105);
    assert.equal(jsxSlug1, "IconFamily1");
    assert.equal(jsxSlug2, "IconFamily2");
  });

  it("File index names are numbered", async () => {
    const exportChars = await readFile(JSX_INDEX_FILE_PATH, "utf8");
    const exportSlug1 = exportChars.substring(96, 138);
    const exportSlug2 = exportChars.substring(139, 181);
    assert.equal(exportSlug1, "export {IconFamily1} from './IconFamily1';");
    assert.equal(exportSlug2, "export {IconFamily2} from './IconFamily2';");
  });
});

describe("Multiple with same name using property names run", () => {
  const DEFAULT_OUTPUT_DIR = resolve(process.cwd(), "icon-library");
  const DEFAULT_REACT_JSX_DIR = resolve(
    process.cwd(),
    "icon-library/react/jsx"
  );
  const JSX_ICON1_FILE_PATH = resolve(
    process.cwd(),
    "icon-library/react/jsx/IconFamilyColorDefaultSizeLarge.jsx"
  );
  const JSX_ICON2_FILE_PATH = resolve(
    process.cwd(),
    "icon-library/react/jsx/IconFamilyColorDefaultSizeRegular.jsx"
  );
  const JSX_INDEX_FILE_PATH = resolve(
    process.cwd(),
    "icon-library/react/jsx/index.js"
  );

  before(() => {
    rmSync(DEFAULT_OUTPUT_DIR, { recursive: true, force: true });
    const child = spawnSync(
      "node",
      [
        resolve(process.cwd(), "."),
        "--apikey",
        process.env.FIGMA_API_KEY,
        "--filekey",
        process.env.FIGMA_FILE_KEY,
        "--nodeid",
        process.env.FIGMA_NODE_ID,
        "--format",
        "react",
        "--propnames",
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

  it("Outputs files with differential property names", async () => {
    try {
      const reactFiles = await readdir(DEFAULT_REACT_JSX_DIR);
      assert.deepEqual(reactFiles, [
        "IconCompany.jsx",
        "IconEntrepreneur.jsx",
        "IconFamilyColorDefaultSizeLarge.jsx",
        "IconFamilyColorDefaultSizeRegular.jsx",
        "IconMover.jsx",
        "IconSenior.jsx",
        "IconTraveler.jsx",
        "IconYouth.jsx",
        "index.js",
      ]);
    } catch (err) {
      console.error(err);
    }
  });

  it("Component names use property names", async () => {
    const jsxChars1 = await readFile(JSX_ICON1_FILE_PATH, "utf8");
    const jsxChars2 = await readFile(JSX_ICON2_FILE_PATH, "utf8");
    const jsxSlug1 = jsxChars1.substring(94, 125);
    const jsxSlug2 = jsxChars2.substring(94, 127);
    assert.equal(jsxSlug1, "IconFamilyColorDefaultSizeLarge");
    assert.equal(jsxSlug2, "IconFamilyColorDefaultSizeRegular");
  });

  it("File index names use property names", async () => {
    const exportChars = await readFile(JSX_INDEX_FILE_PATH, "utf8");
    const exportSlug1 = exportChars.substring(96, 178);
    const exportSlug2 = exportChars.substring(179, 265);
    assert.equal(
      exportSlug1,
      "export {IconFamilyColorDefaultSizeLarge} from " +
        "'./IconFamilyColorDefaultSizeLarge';"
    );
    assert.equal(
      exportSlug2,
      "export {IconFamilyColorDefaultSizeRegular} from " +
        "'./IconFamilyColorDefaultSizeRegular';"
    );
  });
});

describe("Single filter output run", () => {
  const DEFAULT_OUTPUT_DIR = resolve(process.cwd(), "icon-library");
  const DEFAULT_REACT_JSX_DIR = resolve(
    process.cwd(),
    "icon-library/react/jsx"
  );

  before(() => {
    rmSync(DEFAULT_OUTPUT_DIR, { recursive: true, force: true });
    const child = spawnSync(
      "node",
      [
        resolve(process.cwd(), "."),
        "--apikey",
        process.env.FIGMA_API_KEY,
        "--filekey",
        process.env.FIGMA_FILE_KEY,
        "--nodeid",
        process.env.FIGMA_NODE_ID,
        "--format",
        "react",
        "--filter",
        "Color=Default",
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

  it("Outputs only icons with one matching property", async () => {
    try {
      const reactFiles = await readdir(DEFAULT_REACT_JSX_DIR);
      assert.deepEqual(reactFiles, [
        "IconFamily1.jsx",
        "IconFamily2.jsx",
        "index.js",
      ]);
    } catch (err) {
      console.error(err);
    }
  });
});

describe("Single filter with property names output run", () => {
  const DEFAULT_OUTPUT_DIR = resolve(process.cwd(), "icon-library");
  const DEFAULT_REACT_JSX_DIR = resolve(
    process.cwd(),
    "icon-library/react/jsx"
  );

  before(() => {
    rmSync(DEFAULT_OUTPUT_DIR, { recursive: true, force: true });
    const child = spawnSync(
      "node",
      [
        resolve(process.cwd(), "."),
        "--apikey",
        process.env.FIGMA_API_KEY,
        "--filekey",
        process.env.FIGMA_FILE_KEY,
        "--nodeid",
        process.env.FIGMA_NODE_ID,
        "--format",
        "react",
        "--filter",
        "Color=Default",
        "--propnames",
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

  it("Outputs only icons with one matching property using property names", async () => {
    try {
      const reactFiles = await readdir(DEFAULT_REACT_JSX_DIR);
      assert.deepEqual(reactFiles, [
        "IconFamilyColorDefaultSizeLarge.jsx",
        "IconFamilyColorDefaultSizeRegular.jsx",
        "index.js",
      ]);
    } catch (err) {
      console.error(err);
    }
  });
});

describe("Multiple filter output run", () => {
  const DEFAULT_OUTPUT_DIR = resolve(process.cwd(), "icon-library");
  const DEFAULT_REACT_JSX_DIR = resolve(
    process.cwd(),
    "icon-library/react/jsx"
  );

  before(() => {
    rmSync(DEFAULT_OUTPUT_DIR, { recursive: true, force: true });
    const child = spawnSync(
      "node",
      [
        resolve(process.cwd(), "."),
        "--apikey",
        process.env.FIGMA_API_KEY,
        "--filekey",
        process.env.FIGMA_FILE_KEY,
        "--nodeid",
        process.env.FIGMA_NODE_ID,
        "--format",
        "react",
        "--filter",
        "Color=Default,Size=Regular",
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

  it("Outputs only icons matching two properties", async () => {
    try {
      const reactFiles = await readdir(DEFAULT_REACT_JSX_DIR);
      assert.deepEqual(reactFiles, ["IconFamily.jsx", "index.js"]);
    } catch (err) {
      console.error(err);
    }
  });
});

describe("Multiple filter with property names output run", () => {
  const DEFAULT_OUTPUT_DIR = resolve(process.cwd(), "icon-library");
  const DEFAULT_REACT_JSX_DIR = resolve(
    process.cwd(),
    "icon-library/react/jsx"
  );

  before(() => {
    rmSync(DEFAULT_OUTPUT_DIR, { recursive: true, force: true });
    const child = spawnSync(
      "node",
      [
        resolve(process.cwd(), "."),
        "--apikey",
        process.env.FIGMA_API_KEY,
        "--filekey",
        process.env.FIGMA_FILE_KEY,
        "--nodeid",
        process.env.FIGMA_NODE_ID,
        "--format",
        "react",
        "--filter",
        "Color=Default,Size=Regular",
        "--propnames",
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

  it(
    "Outputs only icons with two matching properties using " + "property names",
    async () => {
      try {
        const reactFiles = await readdir(DEFAULT_REACT_JSX_DIR);
        assert.deepEqual(reactFiles, [
          "IconFamilyColorDefaultSizeRegular.jsx",
          "index.js",
        ]);
      } catch (err) {
        console.error(err);
      }
    }
  );
});
