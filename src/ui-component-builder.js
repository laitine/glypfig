import camelcase from 'camelcase';
import * as cheerio from 'cheerio';
import * as eta from 'eta';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {basename, dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

import {errorTxt} from './logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = join(__dirname, '../templates');
const JSX_TEMPLATE_PATH = join(TEMPLATES_DIR, 'react-jsx.eta');
const TSX_TEMPLATE_PATH = join(TEMPLATES_DIR, 'react-tsx.eta');

eta.configure({autoEscape: false});

const parseComponentSVG = async (FilePath) => {
  // Parse SVG as string
  try {
    let svgContents = await readFile(FilePath, 'utf8');
    const $ = cheerio.load(svgContents);
    const svgElementAttributes = $('svg').get(0).attribs;

    svgContents = $('svg').html();
    svgContents = svgContents
        .replaceAll(/fill=\"(none|.+?)\"/g,
            (match) => {
              if (match === 'fill="none"') {
                return match;
              } else {
                return 'fill="currentColor"';
              }
            })
        .replaceAll(/stroke=\"(none|.+?)\"/g,
            (match) => {
              if (match === 'stroke="none"') {
                return match;
              } else {
                return 'stroke="currentColor"';
              }
            })
        .replaceAll(/(?:\s)([\w]+-[\w]+)(?:=)/g,
            (match) => {
              const attributeName = camelcase(match);
              return ' ' + attributeName;
            })
        .trim()
        .concat('\n');
    return {
      attributes: svgElementAttributes,
      contents: svgContents,
    };
  } catch (err) {
    console.log(errorTxt(`Processing SVG data failed: ${err}`));
    process.exit(9);
  }
};

const renderComponent = async (componentData) => {
  try {
    const componentContents = await eta.renderFile(
        componentData.componentTemplate,
        componentData);
    return componentContents;
  } catch (err) {
    console.log(errorTxt(`Rendering component contents failed: ${err}`));
    process.exit(9);
  }
};

const writeComponentToFile = async (
    outputPath, componentContent, componentFilename) => {
  try {
    await writeFile(outputPath, componentContent, {encoding: 'utf8'});
  } catch (err) {
    console.log(
        errorTxt(
            `Failed writing ${componentFilename} to disk: ${err}`));
    process.exit(9);
  }
};

const generateComponentsIndex = async (
    iconNodesData, outputDir, fileFormat, framework, isLogging) => {
  const indexFilename = `index.${fileFormat.slice(0, -1)}`;

  if (isLogging) {
    console.log(`Generating components ${indexFilename} file...`);
  }

  const indexPath = join(`${outputDir}/${framework}`, indexFilename);

  const indexData = iconNodesData.map((nodeItem) => {
    return `export {${nodeItem.componentName}} from ` +
        `'./${nodeItem.componentName}';`;
  })
      .join('\n')
      .concat('\n');

  await writeComponentToFile(indexPath, indexData, indexFilename);
};

const generateReactComponents = async (
    iconNodesData, outputDir, templateFormat, templatePath, isLogging) => {
  if (isLogging) {
    console.log('Generating React components...');
  }

  const reactOutputDir = join(outputDir, 'react');
  await mkdir(reactOutputDir, {recursive: true});

  const iconComponentFormat = templateFormat;

  if (typeof templatePath === 'undefined') {
    templatePath = iconComponentFormat === 'jsx' ?
     JSX_TEMPLATE_PATH : TSX_TEMPLATE_PATH;
  }
  const iconComponentTemplatePath = resolve(process.cwd(), templatePath);

  return Promise.all(
      iconNodesData.map(async (nodeItem) => {
        const baseFilename = basename(nodeItem.svgFilePath, '.svg');
        const iconComponentName = 'Icon' + camelcase(
            baseFilename, {pascalCase: true});
        const componentFilename = `${iconComponentName}.${iconComponentFormat}`;
        const componentPath = join(reactOutputDir, componentFilename);

        const iconComponentSVG = await parseComponentSVG(nodeItem.svgFilePath);

        const iconComponentData = {
          ...nodeItem,
          iconName: baseFilename,
          componentName: iconComponentName,
          componentPath: componentPath,
          componentTemplate: iconComponentTemplatePath,
          componentSVGattributes: iconComponentSVG.attributes,
          componentSVGContents: iconComponentSVG.contents,
        };

        const iconComponentContents = await renderComponent(iconComponentData);

        await writeComponentToFile(
            componentPath, iconComponentContents, componentFilename);

        return iconComponentData;
      }),
  );
};

export {
  generateReactComponents,
  generateComponentsIndex,
};
