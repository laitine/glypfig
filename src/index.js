#!/usr/bin/env node

/* ****************************************************
 * Glypfig
 ******************************************************/

import {resolve} from 'node:path';
import {parseArgs} from 'node:util';

import * as assetFileHandler from './asset-file-handler.js';
import * as figmaApiHandler from './figma-api-handler.js';
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
    default: 'jsx',
  },
  'path': {
    type: 'string',
    short: 'h',
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
    short: 'c',
  },
};

const {values} = parseArgs({options, strict: false});
const argValues = values;

const outputFormats = argValues.format.split(',');

const isLogging = typeof argValues.silent !== 'undefined' && !argValues.silent;

const outputPath = resolve(process.cwd(), argValues.output);

const isOptimized = typeof argValues.optimize !== 'undefined' &&
  argValues.optimize;

const templateFormat = argValues.template;

const templatePath = argValues.path;

const isLicensed = argValues.license;

const jpgScale = argValues.jpgscale;

const pngScale = argValues.pngscale;

const main = async () => {
  // Handle parameters
  figmaApiHandler.init(
      argValues.apikey, argValues.filekey, argValues.nodeid, isLogging);

  let isReact = false;
  if (outputFormats.includes('react')) {
    isReact = true;
    const idx = outputFormats.indexOf('react');
    outputFormats.splice(idx, 1);

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

  // Start executing features
  if (isLogging) {
    console.log(boldTxt('💠 Glypfig generating icon library\n'));
  }

  const figmaData = await figmaApiHandler.fetchFileDataFromAPI();

  let iconNodeData = figmaApiHandler.parseFileData(figmaData);

  iconNodeData = await figmaApiHandler.combineNodeIDsWithAssetFileURLs(
      iconNodeData, outputFormats, outputFormatScale);

  iconNodeData = await figmaApiHandler.downloadAssetFilesData(iconNodeData);

  iconNodeData = await assetFileHandler.writeAssetDataToFile(
      iconNodeData, outputPath);

  if (isOptimized) {
    await assetFileHandler.optimizeAssetFiles(outputPath, isLogging);
  }

  if (isReact) {
    iconNodeData = await uiComponentBuilder.generateReactComponents(
        iconNodeData, outputPath, templateFormat, templatePath, isLogging);
    await uiComponentBuilder.generateComponentsIndex(
        iconNodeData, outputPath, templateFormat, 'react', isLogging);
  }

  if (isLicensed) {
    await uiComponentBuilder.createLicense(isLicensed, outputPath, isLogging);
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
