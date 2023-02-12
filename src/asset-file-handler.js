import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminOptipng from 'imagemin-optipng';
import imageminSvgo from 'imagemin-svgo';
import imageminZopfli from 'imagemin-zopfli';
import {basename, join, resolve} from 'node:path';
import {copyFile, mkdir, writeFile} from 'node:fs/promises';

import {errorTxt} from '../src/logger.js';

const CWD = process.cwd();
const TEMPLATES_DIR = join(CWD, './templates');
const LICENSE_FILENAME = 'LICENSE.txt';
const DEFAULT_LICENSE_PATH = join(TEMPLATES_DIR, LICENSE_FILENAME);

// Write Asset files to disk
const writeAssetDataToFile = async (iconsData, outputDir) => {
  await mkdir(outputDir, {recursive: true});

  return Promise.all(
      iconsData.map(async (nodeItem) => {
        if (typeof nodeItem.jpg !== 'undefined') {
          try {
            await mkdir(join(outputDir, 'jpg'), {recursive: true});

            const filePath = outputDir + '/jpg/' + nodeItem.name + '.jpg';
            await writeFile(filePath,
                Buffer.from(nodeItem.jpg), {encoding: 'utf8'});
            nodeItem.jpgFilePath = filePath;
          } catch (err) {
            console.log(
                errorTxt(
                    `Failed writing ${nodeItem.name}.jpg to disk: ${err}`));
            process.exit(9);
          }
        }

        if (typeof nodeItem.png !== 'undefined') {
          try {
            await mkdir(join(outputDir, 'png'), {recursive: true});

            const filePath = outputDir + '/png/' + nodeItem.name + '.png';
            await writeFile(filePath,
                Buffer.from(nodeItem.png), {encoding: 'utf8'});
            nodeItem.pngFilePath = filePath;
          } catch (err) {
            console.log(
                errorTxt(
                    `Failed writing ${nodeItem.name}.png to disk: ${err}`));
            process.exit(9);
          }
        }

        if (typeof nodeItem.pdf !== 'undefined') {
          try {
            await mkdir(join(outputDir, 'pdf'), {recursive: true});

            const filePath = outputDir + '/pdf/' + nodeItem.name + '.pdf';
            await writeFile(filePath, nodeItem.pdf, {encoding: 'utf8'});
            nodeItem.pdfFilePath = filePath;
          } catch (err) {
            console.log(
                errorTxt(
                    `Failed writing ${nodeItem.name}.pdf to disk: ${err}`));
            process.exit(9);
          }
        }

        if (typeof nodeItem.svg !== 'undefined') {
          try {
            await mkdir(join(outputDir, 'svg'), {recursive: true});

            const filePath = outputDir + '/svg/' + nodeItem.name + '.svg';
            await writeFile(filePath, nodeItem.svg, {encoding: 'utf8'});
            nodeItem.svgFilePath = filePath;
          } catch (err) {
            console.log(
                errorTxt(
                    `Failed writing ${nodeItem.name}.svg to disk: ${err}`));
            process.exit(9);
          }
        }

        return nodeItem;
      }),
  );
};

// Optimize downloaded asset files
const optimizeAssetFiles = async (outputDir, isLogging) => {
  if (isLogging) {
    console.log('Optimizing asset files...');
  }

  return imagemin(
      [join(outputDir, '*.{jpg,png,svg}')],
      {
        destination: outputDir,
        Plugins: [
          imageminJpegtran(),
          imageminOptipng(),
          imageminSvgo({
            plugins: [
              {
                convertColors: {
                  currentColor: true,
                  names2hex: false,
                  rgb2hex: false,
                  shorthex: false,
                  shortname: false,
                },
              },
              {
                removeUselessStrokeAndFill: {
                  removeNone: true,
                },
              },
              {
                prefixIds: {
                  prefix: () => {
                    return base;
                  },
                },
              },
              {
                cleanupIDs: {
                  minify: false,
                },
              },
              {
                cleanupNumericValues: {
                  floatPrecision: 2,
                },
              },
              {
                removeDimensions: true,
              },
            ],
          }),
          imageminZopfli(),
        ],
      },
  );
};

const createLicense = async (licensePath, outputDir, isLogging) => {
  if (isLogging) {
    console.log('Creating license file...');
  }

  const licenseFilePath = licensePath === '' ?
      DEFAULT_LICENSE_PATH : resolve(CWD, licensePath);
  const licenseFilename = typeof licensePath === '' ?
      LICENSE_FILENAME : basename(licenseFilePath);
  const licenseOutputPath = join(outputDir, licenseFilename);

  try {
    await copyFile(licenseFilePath, licenseOutputPath);
  } catch (err) {
    console.log(
        errorTxt(`Failed copying license file ${licenseFilename}: ${err}`));
    process.exit(9);
  }
};

export {
  writeAssetDataToFile,
  optimizeAssetFiles,
  createLicense,
};
