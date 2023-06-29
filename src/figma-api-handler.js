import axios from 'axios';
import axiosRetry from 'axios-retry';

import { errorTxt, warningTxt } from './logger.js';

const FIGMA_API_BASE_URL = 'https://api.figma.com';
let FIGMA_API_TOKEN;
let FIGMA_API_HEADERS;
let FIGMA_API_HEADERS_FOR_BINARY_FILES;
let FIGMA_API_ICONS_FILE;
let isLogging;

axiosRetry(axios, { retries: 5 });

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

  if (
    typeof FIGMA_API_TOKEN === 'undefined' ||
    typeof FIGMA_API_ICONS_FILE.file_key === 'undefined' ||
    typeof FIGMA_API_ICONS_FILE.node_id === 'undefined'
  ) {
    console.log(
      warningTxt(
        `\nPlease provide at least parameters ` +
          `Figma API key, File key and Node ID ` +
          `e.g. --apikey <personal-access-token> ` +
          `--filekey <figma-file-key> --nodeid <figma-file-node-id>\n` +
          `Read more at https://github.com/laitine/glypfig`
      )
    );
    process.exit(9);
  }
};

// Fetch data from Figma API
const fetchFileDataFromAPI = async () => {
  const nodeIdEncoded = encodeURI(FIGMA_API_ICONS_FILE.node_id);
  const figmaAPInodesURL =
    FIGMA_API_BASE_URL +
    `/v1/files/${FIGMA_API_ICONS_FILE.file_key}/nodes?ids=${nodeIdEncoded}`;

  try {
    return await axios.get(figmaAPInodesURL, FIGMA_API_HEADERS);
  } catch (err) {
    console.log(errorTxt(`Fetching data from Figma API failed: ${err}`));
    process.exit(9);
  }
};

// Parse node for a component
const parseNode = (childNode, nodeProperties, setName) => {
  if (childNode.type === 'COMPONENT') {
    // Don't include components without properties when filtering
    if (nodeProperties !== null && !childNode.name.includes('=')) {
      return null;
    }

    // Discard components not in filter scope
    const properties = childNode.name.replace(/\s/g, '').split(',');
    if (
      nodeProperties !== null &&
      nodeProperties.some((property) => properties.indexOf(property) === -1)
    ) {
      return null;
    }

    // Append component set name
    if (childNode.name.includes('=')) {
      childNode.setName = setName;
    }

    return childNode;
  }

  if (
    childNode.type === 'COMPONENT_SET' ||
    childNode.type === 'GROUP' ||
    (childNode.type === 'FRAME' && childNode.children.length !== 0)
  ) {
    const nodeSetName =
      childNode.type === 'COMPONENT_SET' ? childNode.name : null;
    return parseChildren(
      childNode.children,
      nodeProperties,
      childNode.name,
      nodeSetName
    );
  }
};

// Parse list of nodes
const parseChildren = (children, nodeProperties, nodeName, setName) => {
  const componentNodes = [];

  for (let i = 0; i < children.length; i++) {
    if (
      (children[i].name.charAt(0) !== '.' &&
        children[i].type === 'COMPONENT') ||
      children[i].type === 'COMPONENT_SET' ||
      children[i].type === 'GROUP' ||
      children[i].type === 'FRAME'
    ) {
      const result = parseNode(children[i], nodeProperties, nodeName, setName);
      if (result !== null) {
        componentNodes.push(result);
      }
    }
  }

  return componentNodes.flat();
};

// Parse fetched data
const parseFileData = (response, nodeProperties, isPropertyNames) => {
  if (response.status === 404) {
    console.log(warningTxt('The Figma file was not found.'));
    process.exit(9);
  }

  try {
    const json = response.data;
    const nodes = json.nodes[FIGMA_API_ICONS_FILE.node_id].document.children;
    const iconsData = [];

    let figmaPageName = json.nodes[FIGMA_API_ICONS_FILE.node_id].document.name;
    figmaPageName = typeof figmaPageName !== 'undefined' ? figmaPageName : '';

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

    // Filter components from data
    const iconNodes = parseChildren(childNodes, nodeProperties, null);

    // Construct icon object from data
    const nameMap = new Map();
    iconNodes.forEach((item) => {
      let iconName = item.name;
      let iconProperties = null;

      // Only rename components with properties
      if (item.name.includes('=')) {
        const properties = item.name.replace(/\s/g, '').split(',');
        const nodeProperties = properties.map((property) =>
          property.split('=')
        );
        iconProperties = Object.fromEntries(nodeProperties);

        // Use component set name with numbering or
        // component set name with property values
        iconName = item.setName;
        if (!isPropertyNames) {
          nameMap.set(item.setName, (nameMap.get(item.setName) || 0) + 1);
        } else {
          Object.entries(iconProperties).forEach((property) => {
            iconName +=
              '-' + property[0].toLowerCase() + '-' + property[1].toLowerCase();
          });
        }
      }

      iconsData.push({
        id: item.id,
        name: item.name,
        iconName: iconName,
        properties: iconProperties,
      });
    });

    // Rename duplicates with numbering
    if (!isPropertyNames) {
      nameMap.forEach((value, key) => {
        if (value > 1) {
          let count = 0;
          iconsData.forEach((item) => {
            if (key === item.iconName) {
              count++;
              item.iconName += '-' + count;
            }
          });
        }
      });
    }

    if (isLogging) {
      console.log(
        `Found ${iconsData.length} components from node on page ` +
          `${figmaPageName}`
      );
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
  const figmaAPIimagesURL =
    FIGMA_API_BASE_URL +
    `/v1/images/${FIGMA_API_ICONS_FILE.file_key}` +
    `?ids=${iconDataIdsParams}&${imageOptionsParams}`;

  try {
    const response = await axios.get(figmaAPIimagesURL, FIGMA_API_HEADERS);
    return response.data.images;
  } catch (err) {
    console.log(errorTxt(`Exporting icons from Figma API failed.`));

    if (err.response.data.status === 400) {
      console.log(errorTxt('Invalid parameter was provided for Figma API.'));
    }

    if (err.response.data.status === 404) {
      console.log(errorTxt('The file was not found from Figma API.'));
    }

    if (err.response.data.status === 500) {
      console.log(errorTxt('The Figma API had an unexpected rendering error.'));
    }

    process.exit(9);
  }
};

// Combine Node IDs with assets file URLs
const combineNodeIDsWithAssetFileURLs = async (iconNodes, formats, scales) => {
  for (const format of formats) {
    const scale = scales[format + 'Scale'];

    const exportedIconFileURLs = await exportFigmaNodesAsFiles(
      iconNodes,
      format,
      scale
    );
    for (const nodeURL in exportedIconFileURLs) {
      if (Object.prototype.hasOwnProperty.call(exportedIconFileURLs, nodeURL)) {
        const idx = iconNodes.findIndex((nodeItem) => nodeItem.id === nodeURL);

        if (idx === -1) {
          console.log(
            errorTxt(
              `Parsing asset file data failed ` + `due to missing asset URL.`
            )
          );
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
    console.log(`Downloading ${iconNodes.length} icon(s) as files...`);
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
            nodeItem.jpgUrl,
            FIGMA_API_HEADERS_FOR_BINARY_FILES
          );
          nodeItem.jpg = jpgFileResponse.data;
          if (isLogging) {
            console.log(`Downloaded ${nodeItem.iconName}.jpg`);
          }
        } catch {
          console.log(
            errorTxt(`Failed downloading image file: ${nodeItem.iconName}.jpg`)
          );
          process.exit(9);
        }
      }

      if (typeof nodeItem.pngUrl !== 'undefined') {
        try {
          pngFileResponse = await axios.get(
            nodeItem.pngUrl,
            FIGMA_API_HEADERS_FOR_BINARY_FILES
          );
          nodeItem.png = pngFileResponse.data;
          if (isLogging) {
            console.log(`Downloaded ${nodeItem.iconName}.png`);
          }
        } catch {
          console.log(
            errorTxt(`Failed downloading image file: ${nodeItem.iconName}.png`)
          );
          process.exit(9);
        }
      }

      if (typeof nodeItem.svgUrl !== 'undefined') {
        try {
          svgFileResponse = await axios.get(nodeItem.svgUrl, FIGMA_API_HEADERS);
          nodeItem.svg = svgFileResponse.data;
          if (isLogging) {
            console.log(`Downloaded ${nodeItem.iconName}.svg`);
          }
        } catch (err) {
          console.log(
            errorTxt(`Failed downloading image file: ${nodeItem.iconName}.svg`)
          );
          process.exit(9);
        }
      }

      if (typeof nodeItem.pdfUrl !== 'undefined') {
        try {
          pdfFileResponse = await axios.get(nodeItem.pdfUrl, FIGMA_API_HEADERS);
          nodeItem.pdf = pdfFileResponse.data;
          if (isLogging) {
            console.log(`Downloaded ${nodeItem.iconName}.pdf`);
          }
        } catch {
          console.log(
            errorTxt(`Failed downloading image file: ${nodeItem.iconName}.pdf`)
          );
          process.exit(9);
        }
      }

      return nodeItem;
    })
  );
};

export {
  init,
  fetchFileDataFromAPI,
  parseFileData,
  combineNodeIDsWithAssetFileURLs,
  downloadAssetFilesData,
};
