import axios from 'axios';
import axiosRetry from 'axios-retry';

import {errorTxt, warningTxt} from './logger.js';

const FIGMA_API_BASE_URL = 'https://api.figma.com';
let FIGMA_API_TOKEN;
let FIGMA_API_HEADERS;
let FIGMA_API_HEADERS_FOR_BINARY_FILES;
let FIGMA_API_ICONS_FILE;
let isLogging;

axiosRetry(axios, {retries: 5});

// Initialize from parameters
const init = (apikey, filekey, nodeid, hasLogging) => {
  FIGMA_API_TOKEN = apikey;
  FIGMA_API_HEADERS = {
    headers: {
      'X-FIGMA-TOKEN': FIGMA_API_TOKEN,
    },
  };
  FIGMA_API_HEADERS_FOR_BINARY_FILES = {
    headers: {
      'X-FIGMA-TOKEN': FIGMA_API_TOKEN,
    },
    responseType: 'arraybuffer',
    responseEncoding: 'binary',
  };
  FIGMA_API_ICONS_FILE = {
    file_key: filekey,
    node_id: nodeid,
  };

  isLogging = hasLogging;

  if (typeof FIGMA_API_TOKEN === 'undefined' ||
      typeof FIGMA_API_ICONS_FILE.file_key === 'undefined' ||
      typeof FIGMA_API_ICONS_FILE.node_id === 'undefined' ) {
    console.log(warningTxt(
        `\nPlease provide at least parameters ` +
        `Figma API key, File key and Node ID ` +
        `e.g. --apikey <personal-access-token> `+
        `--filekey <figma-file-key> --nodeid <figma-file-node-id>\n` +
        `Read more at https://github.com/laitine/glypfig`));
    process.exit(9);
  }
};

// Fetch data from Figma API
const fetchFileDataFromAPI = async () => {
  const nodeIdEncoded = encodeURI(FIGMA_API_ICONS_FILE.node_id);
  const figmaAPInodesURL = FIGMA_API_BASE_URL +
      `/v1/files/${FIGMA_API_ICONS_FILE.file_key}/nodes?ids=${nodeIdEncoded}`;

  try {
    return await axios.get(figmaAPInodesURL, FIGMA_API_HEADERS);
  } catch (err) {
    console.log(errorTxt(`Fetching data from Figma API failed: ${err}`));
    process.exit(9);
  }
};

// Parse node for a component
const parseNode = (childNode) => {
  if (childNode.type === 'COMPONENT') {
    return childNode;
  }

  if (childNode.type == 'FRAME' ||
      childNode.type == 'GROUP' &&
      childNode.children.length !== 0) {
    return parseChildren(childNode.children);
  }
};

// Parse list of nodes
const parseChildren = (children) => {
  const componentNodes = [];

  for (let i = 0; i < children.length; i++) {
    if (children[i].name.charAt(0) !== '.') {
      const result = parseNode(children[i]);
      componentNodes.push(result);
    }
  }

  return componentNodes.flat();
};

// Parse fetched data
const parseFileData = (response) => {
  if (response.status === 404) {
    console.log(warningTxt('The Figma file was not found.'));
    process.exit(9);
  }

  try {
    const json = response.data;
    const nodes = json.nodes[FIGMA_API_ICONS_FILE.node_id].document.children;
    const iconsData = [];

    let figmaPageName =
      json.nodes[FIGMA_API_ICONS_FILE.node_id].document.name;
    figmaPageName =
      typeof figmaPageName !== 'undefined' ? figmaPageName : '';

    if (isLogging) {
      console.log(`Parsing data from project ${json.name}`);
    }

    const frames = [];
    nodes
        .filter((item) => {
          return item.type === 'FRAME' && item.children.length !== 0;
        })
        .forEach((item) => {
          frames.push(item);
        });

    let childNodes = [];
    frames.forEach((item) => {
      childNodes.push(item.children.concat());
    });
    childNodes = childNodes.flat();

    const iconNodes = parseChildren(childNodes);
    iconNodes.forEach((item) => {
      iconsData.push({
        id: item.id,
        name: item.name,
      });
    });

    if (isLogging) {
      console.log(`Found ${iconsData.length} components from node on page ` +
         `${figmaPageName}`);
    }

    return iconsData;
  } catch (err) {
    console.log(errorTxt(`Failed parsing Figma API JSON: ${err}`));
    process.exit(9);
  }
};

// Export file assets from Figma as files
const exportFigmaNodesAsFiles = async (iconsDataWithIds, format, scale) => {
  if (isLogging) {
    console.log(`Exporting ${format} assets as files from Figma...`);
  }

  const iconDataIds = iconsDataWithIds.map((item) => item.id);
  const iconDataIdsParams = iconDataIds.join(',');
  const imageOptions = {
    scale: scale ? scale : 1,
    format: format,
  };

  const imageOptionsParams = JSON.stringify(imageOptions)
      .replace(/:/g, '=')
      .replace(/,/g, '&')
  // eslint-disable-next-line no-useless-escape
      .replace(/[\{\}"]/gi, '');
  const figmaAPIimagesURL = FIGMA_API_BASE_URL +
              `/v1/images/${FIGMA_API_ICONS_FILE.file_key}` +
              `?ids=${iconDataIdsParams}&${imageOptionsParams}`;

  try {
    const response = await axios.get(figmaAPIimagesURL, FIGMA_API_HEADERS);
    return response.data.images;
  } catch (err) {
    console.log(
        errorTxt(`Exporting icons from Figma API failed.`));

    if (err.response.data.status === 400) {
      console.log(
          errorTxt('Invalid parameter was provided for Figma API.'));
    }

    if (err.response.data.status === 404) {
      console.log(errorTxt('The file was not found from Figma API.'));
    }

    if (err.response.data.status === 500) {
      console.log(
          errorTxt('The Figma API had an unexpected rendering error.'));
    }

    process.exit(9);
  }
};

// Combine Node IDs with assets file URLs
const combineNodeIDsWithAssetFileURLs = async (iconNodes, formats, scales) => {
  for (const format of formats) {
    const scale = scales[format + 'Scale'];

    const exportedIconFileURLs = await exportFigmaNodesAsFiles(iconNodes,
        format, scale);
    for (const nodeURL in exportedIconFileURLs) {
      if (Object.prototype.hasOwnProperty.call(exportedIconFileURLs, nodeURL)) {
        const idx = iconNodes.findIndex(
            (nodeItem) => nodeItem.id === nodeURL);

        if (idx === -1) {
          console.log(
              errorTxt(`Parsing asset file data failed ` +
                    `due to missing asset URL.`));
          process.exit(9);
        }

        iconNodes[idx][format + 'Url'] = exportedIconFileURLs[nodeURL];
      }
    }
  }

  return iconNodes;
};

// Download asset files data
const downloadAssetFilesData = async (iconNodes) => {
  if (isLogging) {
    console.log(`Downloading ${iconNodes.length} different icons as files...`);
  }

  return Promise.all(
      iconNodes.map(async (nodeItem) => {
        let jpgFileResponse;
        let pngFileResponse;
        let svgFileResponse;
        let pdfFileResponse;

        if (typeof nodeItem.jpgUrl !== 'undefined') {
          try {
            jpgFileResponse = await axios.get(
                nodeItem.jpgUrl, FIGMA_API_HEADERS_FOR_BINARY_FILES);
            nodeItem.jpg = jpgFileResponse.data;
            if (isLogging) {
              console.log(`Downloaded ${nodeItem.name}.jpg`);
            }
          } catch {
            console.log(
                errorTxt(
                    `Failed downloading image file: ${nodeItem.name}.jpg`));
            process.exit(9);
          }
        }

        if (typeof nodeItem.pngUrl !== 'undefined') {
          try {
            pngFileResponse = await axios.get(
                nodeItem.pngUrl, FIGMA_API_HEADERS_FOR_BINARY_FILES);
            nodeItem.png = pngFileResponse.data;
            if (isLogging) {
              console.log(`Downloaded ${nodeItem.name}.png`);
            }
          } catch {
            console.log(
                errorTxt(
                    `Failed downloading image file: ${nodeItem.name}.png`));
            process.exit(9);
          }
        }

        if (typeof nodeItem.svgUrl !== 'undefined') {
          try {
            svgFileResponse = await axios.get(
                nodeItem.svgUrl, FIGMA_API_HEADERS);
            nodeItem.svg = svgFileResponse.data;
            if (isLogging) {
              console.log(`Downloaded ${nodeItem.name}.svg`);
            }
          } catch (err) {
            console.log(
                errorTxt(
                    `Failed downloading image file: ${nodeItem.name}.svg`));
            process.exit(9);
          }
        }

        if (typeof nodeItem.pdfUrl !== 'undefined') {
          try {
            pdfFileResponse = await axios.get(
                nodeItem.pdfUrl, FIGMA_API_HEADERS);
            nodeItem.pdf = pdfFileResponse.data;
            if (isLogging) {
              console.log(`Downloaded ${nodeItem.name}.pdf`);
            }
          } catch {
            console.log(
                errorTxt(
                    `Failed downloading image file: ${nodeItem.name}.pdf`));
            process.exit(9);
          }
        }

        return nodeItem;
      }),
  );
};

export {
  init,
  fetchFileDataFromAPI,
  parseFileData,
  combineNodeIDsWithAssetFileURLs,
  downloadAssetFilesData,
};
