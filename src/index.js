import axios from 'axios';
import path from 'path';
import fs from 'fs/promises';
import {
  getFileName, getDirName, getNameFromUrl, getLocalLinks, editHtml,
} from './utilities.js';

// Здесь будут функции с побочными эффектами
const createDir = (dirpath) => fs.mkdir(dirpath, { recursive: true });

// Основная функция прнимает ссылку в виде строки
// И путь до папки куда складывать результат
export default (url, outputDir = process.cwd()) => {
  const { origin } = new URL(url);
  const fileName = getFileName(getNameFromUrl(url));
  const filePath = path.join(outputDir, fileName);
  const assetsDirName = getDirName(getNameFromUrl(url));
  const assetsDirPath = path.join(outputDir, assetsDirName);
  return axios.get(url)
    .then(({ data }) => {
      const localLinks = getLocalLinks(data, origin);
      return localLinks.map((link) => axios.get(link, { responseType: 'arraybuffer' })
        .then((res) => fs.writeFile(filePath, res.data)));
    });
};
