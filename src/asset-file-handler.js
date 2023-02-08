import {join} from 'node:path';
import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminOptipng from 'imagemin-optipng';
import imageminSvgo from 'imagemin-svgo';
import imageminZopfli from 'imagemin-zopfli';
import {mkdir, writeFile} from 'node:fs/promises';

import {errorTxt} from '../src/logger.js';

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

export {writeAssetDataToFile, optimizeAssetFiles};
