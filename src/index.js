#!/usr/bin/env node

/* ****************************************************
 * Glypfig
 ******************************************************/

import {resolve} from 'node:path';
import {parseArgs} from 'node:util';

import * as assetFileHandler from './asset-file-handler.js';
import * as figmaApiHandler from './figma-api-handler.js';
import {printManual} from './help.js';
import {boldTxt} from './logger.js';
import * as uiComponentBuilder from './ui-component-builder.js';

const options = {
  'apikey': {
    type: 'string',
    short: 'a',
  },
  'filekey': {
    type: 'string',
    short: 'k',
  },
  'nodeid': {
    type: 'string',
    short: 'n',
  },
  'format': {
    type: 'string',
    short: 'f',
    default: 'png,svg,react',
  },
  'output': {
    type: 'string',
    short: 'o',
    default: './icon-library',
  },
  'silent': {
    type: 'boolean',
    short: 's',
    default: false,
  },
  'optimize': {
    type: 'boolean',
    short: 'p',
    default: false,
  },
  'template': {
    type: 'string',
    short: 't',
  },
  'csspath': {
    type: 'string',
    short: 'c',
  },
  'jspath': {
    type: 'string',
    short: 'j',
  },
  'cssprefix': {
    type: 'string',
    short: 'r',
  },
  'jsprefix': {
    type: 'string',
    short: 'e',
  },
  'license': {
    type: 'string',
    short: 'l',
  },
  'jpgscale': {
    type: 'string',
    short: 'b',
  },
  'pngscale': {
    type: 'string',
    short: 'd',
  },
  'filter': {
    type: 'string',
    short: 'i',
  },
  'propnames': {
    type: 'boolean',
    short: 'm',
    default: false,
  },
  'help': {
    type: 'boolean',
    short: 'h',
    default: false,
  },
};

const {values} = parseArgs({options});
const argValues = values;

if (typeof argValues.help !== 'undefined' && argValues.help) {
  await printManual();
  process.exit(1);
}

const outputFormats = argValues.format.split(',');

const isLogging = typeof argValues.silent !== 'undefined' && !argValues.silent;

const outputPath = resolve(process.cwd(), argValues.output);

const isOptimized = typeof argValues.optimize !== 'undefined' &&
    argValues.optimize;

const templateFormats =
    typeof argValues.template !== 'undefined' ?
    argValues.template.split(',') : null;

const cssTemplatePath = typeof argValues.csspath === 'undefined' ?
    null : argValues.csspath;

const jsTemplatePath = typeof argValues.jspath === 'undefined' ?
    null : argValues.jspath;

const cssPrefix = typeof argValues.cssprefix === 'undefined' ?
    null : argValues.cssprefix;

const jsPrefix = typeof argValues.jsprefix === 'undefined' ?
    null : argValues.jsprefix;

const licensePath =
    typeof argValues.license === 'undefined' ? null : argValues.license;

const jpgScale = typeof argValues.jpgscale === 'undefined' ?
    null : argValues.jpgscale;

const pngScale = typeof argValues.pngscale === 'undefined' ?
    null : argValues.pngscale;

const propertiesFilters =
    typeof argValues.filter !== 'undefined' ?
    argValues.filter.replace(/\s/g, '').split(',') : null;

const isPropNames = typeof argValues.propnames !== 'undefined' &&
    argValues.propnames;

const main = async () => {
  // Handle parameters
  figmaApiHandler.init(
      argValues.apikey, argValues.filekey, argValues.nodeid, isLogging);

  const outputFormatsToFetch = outputFormats;
  const componentFormatsToBuild = [];

  let formatIdx = outputFormatsToFetch.indexOf('css');
  if (formatIdx !== -1) {
    componentFormatsToBuild.push('css');
    outputFormatsToFetch.splice(formatIdx, 1);
    if (!outputFormatsToFetch.includes('svg')) {
      outputFormatsToFetch.push('svg');
    }
  }
  formatIdx = outputFormatsToFetch.indexOf('react');
  if (formatIdx !== -1) {
    componentFormatsToBuild.push('react');
    outputFormatsToFetch.splice(formatIdx, 1);
    if (!outputFormatsToFetch.includes('svg')) {
      outputFormatsToFetch.push('svg');
    }
  }

  if (outputFormats.includes('react')) {
    if (!outputFormats.includes('svg')) {
      outputFormats.push('svg');
    }
  }

  const outputFormatScale = {};
  if (typeof jpgScale !== 'undefined') {
    outputFormatScale.jpgScale = jpgScale;
  }
  if (typeof pngScale !== 'undefined') {
    outputFormatScale.pngScale = pngScale;
  }

  // Fetch image assets
  if (isLogging) {
    console.log(boldTxt('💠 Glypfig generating icon library\n'));
  }

  const figmaData = await figmaApiHandler.fetchFileDataFromAPI();

  let iconNodeData = figmaApiHandler.parseFileData(figmaData,
      propertiesFilters, isPropNames);

  iconNodeData = await figmaApiHandler.combineNodeIDsWithAssetFileURLs(
      iconNodeData, outputFormatsToFetch, outputFormatScale);

  iconNodeData = await figmaApiHandler.downloadAssetFilesData(iconNodeData);

  iconNodeData = await assetFileHandler.writeAssetDataToFile(
      iconNodeData, outputPath);

  // Optimize image assets
  if (isOptimized) {
    await assetFileHandler.optimizeAssetFiles(outputPath, isLogging);
  }

  // Build UI components
  if (componentFormatsToBuild.length !== 0) {
    iconNodeData = await uiComponentBuilder.readComponentSVGData(iconNodeData);

    for (const componentFormat of componentFormatsToBuild) {
      let templatePath = null;
      let prefix = null;

      if (componentFormat === 'css') {
        if (cssTemplatePath !== null) {
          templatePath = cssTemplatePath;
        }
        if (cssPrefix !== null) {
          prefix = cssPrefix;
        }
      } else if (componentFormat === 'react') {
        if (jsTemplatePath !== null) {
          templatePath = jsTemplatePath;
        }
        if (jsPrefix !== null) {
          prefix = jsPrefix;
        }
      }

      iconNodeData = await uiComponentBuilder.generateComponents(
          iconNodeData,
          outputPath,
          componentFormat,
          templateFormats,
          templatePath,
          prefix,
          isLogging,
      );
    }
  }

  // Create license file
  if (licensePath !== null) {
    await assetFileHandler.createLicense(licensePath, outputPath, isLogging);
  }

  if (isLogging) {
    console.log(
        boldTxt(
            `\n🎉 Icon library with ${iconNodeData.length} ` +
            `unique icons successfully created!`,
        ),
    );
  }
};

main();
