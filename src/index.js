import axios from 'axios';
import path from 'path';
import fs from 'fs/promises';
import constants from 'constants';
import debug from 'debug';
import 'axios-debug-log';
import Listr from 'listr';
import { getNameFromUrl, getFileName, getDirName } from './nameHandlers.js';
import { getLocalLinks, editHtml } from './utilities.js';

const logger = debug('page-loader');

const createDir = (dirpath) => fs.access(dirpath, constants.R_OK || constants.W_OK)
  .catch(
    () => fs.mkdir(dirpath, { recursive: true }),
    logger('Assets directory created'),
  );

export default (url, outputDir = process.cwd()) => {
  const { origin } = new URL(url);
  const fileName = getFileName(getNameFromUrl(url));
  const filePath = path.join(outputDir, fileName);
  const assetsDir = getDirName(getNameFromUrl(url));
  const assetsDirPath = path.join(outputDir, assetsDir);

  let response;

  logger(`Accessing ${url}`);
  return axios.get(url)
    .then(({ data }) => {
      logger(`The request succeeded. ${url} has been fetched and transmitted in the message body`);
      response = data;
      logger(`Creating dir ${assetsDir}`);
      return createDir(assetsDirPath);
    })
    .then(() => {
      logger('Fetching local links');
      const localLinks = getLocalLinks(response, origin);
      logger(`Downloading assets from ${localLinks}`);
      const tasks = localLinks.map((link) => ({
        title: link,
        task: () => axios.get(link, { responseType: 'arraybuffer' })
          .then((localLinkResponse) => {
            const assetPath = path.join(assetsDirPath, getFileName(getNameFromUrl(link)));
            return fs.writeFile(assetPath, localLinkResponse.data);
          }),
      }));
      return new Listr(tasks, { concurrent: true, exitOnError: false })
        .run()
        .catch((error) => console.error(error.message));
    })
    .then(() => {
      logger('Processing HTML data');
      const content = editHtml(response, origin, assetsDir);
      logger(`Saving data to ${filePath}`);
      return fs.writeFile(filePath, content);
    })
    .then(() => {
      logger(`HTML has been saved to ${filePath}`);
      return filePath;
    })
    .catch((error) => {
      if (error.response) {
        logger('HTTP Error!');
        throw new Error(`Request failed with status code ${error.response.status}`);
      }
      logger('FS Error!');
      throw error;
    });
};
