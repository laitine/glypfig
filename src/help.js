import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { errorTxt } from "./logger.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MANUAL_PATH = join(__dirname, "../man/doc.1");

const printManual = async () => {
  try {
    const manual = await readFile(MANUAL_PATH, "utf8");
    console.log(manual);
  } catch (err) {
    console.log(errorTxt(`Failed to print manual: ${err}`));
    process.exit(9);
  }
};

export { printManual };
