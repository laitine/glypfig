import camelcase from "camelcase";
import * as cheerio from "cheerio";
import { Eta } from "eta";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { errorTxt } from "./logger.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = join(__dirname, "../templates");
const JS_DEFAULT_TEMPLATE_FORMAT = ["jsx"];
const CSS_TEMPLATE_FILENAME = "css.eta";
const CSS_PREFIX = "icon-";
const JSX_TEMPLATE_FILENAME = "react-jsx.eta";
const TSX_TEMPLATE_FILENAME = "react-tsx.eta";
const JS_PREFIX = "Icon";

let eta = new Eta({
  autoEscape: false,
  views: TEMPLATES_DIR,
});

const readComponentSVGData = async (iconNodesData) => {
  return Promise.all(
    iconNodesData.map(async (nodeItem) => {
      const baseFilename = basename(nodeItem.svgFilePath, ".svg");
      const iconComponentSVG = await parseComponentSVG(nodeItem.svgFilePath);

      const iconComponentData = {
        ...nodeItem,
        iconName: baseFilename,
        componentSVGData: iconComponentSVG.data,
        componentSVGAttributes: iconComponentSVG.attributes,
        componentSVGContents: iconComponentSVG.contents,
      };

      return iconComponentData;
    })
  );
};

const parseComponentSVG = async (FilePath) => {
  // Parse SVG as string
  try {
    let svgData = await readFile(FilePath, "utf8");
    const $ = cheerio.load(svgData);
    const svgElementAttributes = $("svg").get(0).attribs;
    let svgContents = $("svg").html();

    svgContents = svgContents
      .replaceAll(/fill=\"(none|.+?)\"/g, (match) => {
        if (match === 'fill="none"') {
          return match;
        } else {
          return 'fill="currentColor"';
        }
      })
      .replaceAll(/stroke=\"(none|.+?)\"/g, (match) => {
        if (match === 'stroke="none"') {
          return match;
        } else {
          return 'stroke="currentColor"';
        }
      });

    svgData =
      `<svg role="img"` +
      `${
        typeof svgElementAttributes.xmlns !== "undefined"
          ? ` xmlns="${svgElementAttributes.xmlns}"`
          : ' xmlns="http://www.w3.org/2000/svg"'
      }` +
      `${
        typeof svgElementAttributes.viewBox !== "undefined"
          ? ` viewBox="${svgElementAttributes.viewBox}"`
          : ""
      }` +
      `>${svgContents}</svg>`;

    // convert attribute names to camelcase for React
    svgContents = svgContents
      .replaceAll(/(?:\s)([\w]+-[\w]+)(?:=)/g, (match) => {
        const attributeName = camelcase(match);
        return " " + attributeName;
      })
      .trim();

    return {
      data: svgData,
      attributes: svgElementAttributes,
      contents: svgContents.concat("\n"),
    };
  } catch (err) {
    console.log(errorTxt(`Processing SVG data failed: ${err}`));
    process.exit(9);
  }
};

const renderComponent = async (componentData, componentFormat) => {
  try {
    const componentTemplate =
      componentData[`component${componentFormat}Template`];
    const componentContents = eta.render(componentTemplate, componentData);
    return componentContents;
  } catch (err) {
    console.log(errorTxt(`Rendering component contents failed: ${err}`));
    process.exit(9);
  }
};

const writeComponentToFile = async (
  outputPath,
  componentContent,
  componentFilename
) => {
  try {
    const dirpath = dirname(outputPath);
    if (!existsSync(dirpath)) {
      await mkdir(dirpath, { recursive: true });
    }
    await writeFile(outputPath, componentContent, { encoding: "utf8" });
  } catch (err) {
    console.log(
      errorTxt(`Failed writing ${componentFilename} to disk: ${err}`)
    );
    process.exit(9);
  }
};

const createCSSImports = (iconNodesData) => {
  return iconNodesData
    .map((nodeItem) => {
      return `@import url("${nodeItem.componentCSSName}.css");`;
    })
    .join("\n")
    .concat("\n");
};

const createJSExports = (iconNodesData) => {
  return iconNodesData
    .map((nodeItem) => {
      return (
        `export {${nodeItem.componentJSName}} from ` +
        `'./${nodeItem.componentJSName}';`
      );
    })
    .join("\n")
    .concat("\n");
};

const generateComponentsIndex = async (
  iconNodesData,
  outputDir,
  format,
  isLogging
) => {
  const name = format === "css" ? "icons" : "index";
  const fileformat = format === "css" ? format : format.slice(0, -1);
  const indexFilename = `${name}.${fileformat}`;

  if (isLogging) {
    console.log(`Generating components ${indexFilename} file...`);
  }

  const indexPath = join(`${outputDir}/${format}`, indexFilename);

  const indexData =
    format === "css"
      ? createCSSImports(iconNodesData)
      : createJSExports(iconNodesData);

  await writeComponentToFile(indexPath, indexData, indexFilename);
};

const encodeSVGtoURL = (svgData) => {
  return svgData
    .replace(/%/g, "%25")
    .replace(/</g, "%3C")
    .replace(/>/g, "%3E")
    .replace(/&/g, "%26")
    .replace(/#/g, "%23")
    .replace(/{/g, "%7B")
    .replace(/}/g, "%7D")
    .replace(/'/g, "%22")
    .replace(/"/g, "'")
    .replace(/\s+/g, " ")
    .trim();
};

const createCSSComponents = async (
  iconNodesData,
  outputDir,
  iconComponentFormat,
  customTemplatePath,
  prefix
) => {
  let templateFilename = CSS_TEMPLATE_FILENAME;
  if (customTemplatePath !== null) {
    customTemplatePath = resolve(process.cwd(), customTemplatePath);
    eta = new Eta({
      autoEscape: false,
      views: dirname(customTemplatePath),
    });
    templateFilename = basename(customTemplatePath);
  }

  let namePrefix = CSS_PREFIX;
  if (prefix !== null) {
    namePrefix = prefix;
  }

  return Promise.all(
    iconNodesData.map(async (nodeItem) => {
      const baseFilename = basename(nodeItem.svgFilePath, ".svg");
      const iconComponentName = namePrefix + baseFilename;
      const componentFilename = `${iconComponentName}.${iconComponentFormat}`;
      const componentPath = join(outputDir, componentFilename);

      const iconComponentData = {
        ...nodeItem,
        componentCSSName: iconComponentName,
        componentCSSPath: componentPath,
        componentCSSTemplate: templateFilename,
        componentSVGDataEncoded: encodeSVGtoURL(nodeItem.componentSVGData),
      };

      const iconComponentContents = await renderComponent(
        iconComponentData,
        "CSS"
      );

      await writeComponentToFile(
        componentPath,
        iconComponentContents,
        componentFilename
      );

      return iconComponentData;
    })
  );
};

const createJSComponents = async (
  iconNodesData,
  outputDir,
  iconComponentFormat,
  customTemplatePath,
  prefix
) => {
  let templateFilename = JSX_TEMPLATE_FILENAME;
  if (customTemplatePath === null) {
    if (iconComponentFormat === "tsx") {
      templateFilename = TSX_TEMPLATE_FILENAME;
    }
  } else {
    customTemplatePath = resolve(process.cwd(), customTemplatePath);
    eta = new Eta({
      autoEscape: false,
      views: dirname(customTemplatePath),
    });
    templateFilename = basename(customTemplatePath);
  }

  let namePrefix = JS_PREFIX;
  if (prefix !== null) {
    namePrefix = prefix;
  }

  return Promise.all(
    iconNodesData.map(async (nodeItem) => {
      const iconComponentName =
        namePrefix + camelcase(nodeItem.iconName, { pascalCase: true });
      const componentFilename = `${iconComponentName}.${iconComponentFormat}`;
      const componentPath = join(
        outputDir,
        iconComponentFormat,
        componentFilename
      );

      const iconComponentData = {
        ...nodeItem,
        componentJSName: iconComponentName,
        componentJSPath: componentPath,
        componentJSTemplate: templateFilename,
      };

      const iconComponentContents = await renderComponent(
        iconComponentData,
        "JS"
      );

      await writeComponentToFile(
        componentPath,
        iconComponentContents,
        componentFilename
      );

      return iconComponentData;
    })
  );
};

const generateComponents = async (
  iconNodesData,
  outputDir,
  componentFormat,
  templateFormats,
  customTemplatePath,
  prefix,
  isLogging
) => {
  if (isLogging) {
    const techName = componentFormat.toUpperCase();
    console.log(`Generating ${techName} components...`);
  }

  const componentsOutputDir = join(outputDir, componentFormat);
  await mkdir(outputDir, { recursive: true });

  let iconComponentsData = null;
  if (componentFormat === "css") {
    iconComponentsData = await createCSSComponents(
      iconNodesData,
      componentsOutputDir,
      componentFormat,
      customTemplatePath,
      prefix
    );
    await generateComponentsIndex(
      iconComponentsData,
      outputDir,
      componentFormat,
      isLogging
    );
  } else if (componentFormat === "react") {
    if (templateFormats === null) {
      templateFormats = JS_DEFAULT_TEMPLATE_FORMAT;
    }
    for (const templateFormat of templateFormats) {
      iconComponentsData = await createJSComponents(
        iconNodesData,
        componentsOutputDir,
        templateFormat,
        customTemplatePath,
        prefix
      );
      await generateComponentsIndex(
        iconComponentsData,
        componentsOutputDir,
        templateFormat,
        isLogging
      );
    }
  }
  return iconComponentsData;
};

export { generateComponents, readComponentSVGData };
