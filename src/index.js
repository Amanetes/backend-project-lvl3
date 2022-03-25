import axios from 'axios';
import path from 'path';
import fs from 'fs/promises';
import {
  getFileName, getDirName, getNameFromUrl, getLocalLinks,
} from './utilities.js';

// Здесь будут функции с побочными эффектами
const createDir = (dirpath) => fs.mkdir(dirpath, { recursive: true });
// Основная функция прнимает ссылку в виде строки
// И путь до папки куда складывать результат
export default (url, ouputDir = process.cwd()) => {
  const { origin } = new URL(url);
  const fileName = getFileName(url);
  const filePath = path.join(ouputDir, fileName);
  const assetsDirName = getDirName(url);
  const assetsDirPath = path.join(ouputDir, assetsDirName);
  return axios.get(url)
    .then((response) => getLocalLinks(response.data, url, assetsDirName))
    .then(({ page, links }) => fs.writeFile(filePath, page)
      .then(() => links))
    .then(() => filePath);
};
