import "dotenv/config";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { rmSync } from "node:fs";
import { access, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { before, describe, it } from "node:test";

describe("Formats run", () => {
  const DEFAULT_OUTPUT_DIR = resolve(process.cwd(), "icon-library");
  const DEFAULT_JPG_DIR = resolve(process.cwd(), "icon-library/jpg");
  const DEFAULT_PNG_DIR = resolve(process.cwd(), "icon-library/png");
  const DEFAULT_SVG_DIR = resolve(process.cwd(), "icon-library/svg");
  const DEFAULT_PDF_DIR = resolve(process.cwd(), "icon-library/pdf");
  const DEFAULT_CSS_DIR = resolve(process.cwd(), "icon-library/css");
  const DEFAULT_REACT_TSX_DIR = resolve(
    process.cwd(),
    "icon-library/react/tsx"
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
        "jpg,png,svg,pdf,css,react",
        "--template",
        "tsx",
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

  it("Creates builds in all formats", async () => {
    assert.ifError(await access(DEFAULT_JPG_DIR));
    assert.ifError(await access(DEFAULT_PNG_DIR));
    assert.ifError(await access(DEFAULT_SVG_DIR));
    assert.ifError(await access(DEFAULT_PDF_DIR));
    assert.ifError(await access(DEFAULT_CSS_DIR));
    assert.ifError(await access(DEFAULT_REACT_TSX_DIR));
  });

  it("Creates jpg files", async () => {
    try {
      const jpgFiles = await readdir(DEFAULT_JPG_DIR);
      assert.deepEqual(jpgFiles, [
        "company.jpg",
        "entrepreneur.jpg",
        "family-1.jpg",
        "family-2.jpg",
        "mover.jpg",
        "senior.jpg",
        "traveler.jpg",
        "youth.jpg",
      ]);
    } catch (err) {
      console.error(err);
    }
  });

  it("Creates png files", async () => {
    try {
      const pngFiles = await readdir(DEFAULT_PNG_DIR);
      assert.deepEqual(pngFiles, [
        "company.png",
        "entrepreneur.png",
        "family-1.png",
        "family-2.png",
        "mover.png",
        "senior.png",
        "traveler.png",
        "youth.png",
      ]);
    } catch (err) {
      console.error(err);
    }
  });

  it("Creates svg files", async () => {
    try {
      const svgFiles = await readdir(DEFAULT_SVG_DIR);
      assert.deepEqual(svgFiles, [
        "company.svg",
        "entrepreneur.svg",
        "family-1.svg",
        "family-2.svg",
        "mover.svg",
        "senior.svg",
        "traveler.svg",
        "youth.svg",
      ]);
    } catch (err) {
      console.error(err);
    }
  });

  it("Creates pdf files", async () => {
    try {
      const pdfFiles = await readdir(DEFAULT_PDF_DIR);
      assert.deepEqual(pdfFiles, [
        "company.pdf",
        "entrepreneur.pdf",
        "family-1.pdf",
        "family-2.pdf",
        "mover.pdf",
        "senior.pdf",
        "traveler.pdf",
        "youth.pdf",
      ]);
    } catch (err) {
      console.error(err);
    }
  });

  it("Creates css files", async () => {
    try {
      const cssFiles = await readdir(DEFAULT_CSS_DIR);
      assert.deepEqual(cssFiles, [
        "icon-company.css",
        "icon-entrepreneur.css",
        "icon-family-1.css",
        "icon-family-2.css",
        "icon-mover.css",
        "icon-senior.css",
        "icon-traveler.css",
        "icon-youth.css",
        "icons.css",
      ]);
    } catch (err) {
      console.error(err);
    }
  });

  it("Creates react files in tsx", async () => {
    try {
      const reactFiles = await readdir(DEFAULT_REACT_TSX_DIR);
      assert.deepEqual(reactFiles, [
        "IconCompany.tsx",
        "IconEntrepreneur.tsx",
        "IconFamily1.tsx",
        "IconFamily2.tsx",
        "IconMover.tsx",
        "IconSenior.tsx",
        "IconTraveler.tsx",
        "IconYouth.tsx",
        "index.ts",
      ]);
    } catch (err) {
      console.error(err);
    }
  });
});
