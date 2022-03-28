import axios from 'axios';
import path from 'path';
import fs from 'fs/promises';
import constants from 'constants';
import debug from 'debug';
import 'axios-debug-log';
import { getNameFromUrl, getFileName, getDirName } from './nameHandlers.js';
import { getLocalLinks, editHtml } from './utilities.js';

const logger = debug('page-loader');

const createDir = (dirpath) => fs.access(dirpath, constants.R_OK || constants.W_OK)
  .catch(() => fs.mkdir(dirpath, { recursive: true }));

export default (url, outputDir = process.cwd()) => {
  const { origin } = new URL(url);
  const fileName = getFileName(getNameFromUrl(url));
  const filePath = path.join(outputDir, fileName);
  const assetsDirName = getDirName(getNameFromUrl(url));
  const assetsDirPath = path.join(outputDir, assetsDirName);
  let response;
  logger(`Requesting ${url}`);
  return axios.get(url)
    .then(({ data }) => {
      response = data;
      logger('Creating assets dir');
      return createDir(assetsDirPath);
    })
    .catch((err) => {
      logger(`BAD REQUEST (GET ${url}`);
      console.error(err.message);
    })
    .then(() => {
      const localLinks = getLocalLinks(response, origin);
      return localLinks.map((link) => axios.get(link, { responseType: 'arraybuffer' })
        .then((localLinkResponse) => {
          const assetPath = path.join(assetsDirPath, getFileName(getNameFromUrl(link)));
          return fs.writeFile(assetPath, localLinkResponse.data);
        }));
    })
    .then(() => {
      const content = editHtml(response, origin, assetsDirPath);
      return fs.writeFile(filePath, content);
    })
    .then(() => filePath);
};
