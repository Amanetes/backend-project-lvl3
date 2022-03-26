import axios from 'axios';
import path from 'path';
import fs from 'fs/promises';
import {
  getFileName, getDirName, getNameFromUrl, getLocalLinks, editHtml
} from './utilities.js';

// Здесь будут функции с побочными эффектами
const createDir = (dirpath) => fs.mkdir(dirpath, { recursive: true });
const loadAsset = (url, outputPath) => axios.get(url, { responseType: 'stream' })
  .then((response) => response.data.pipe(fs.createWriteStream(outputPath)));

// Основная функция прнимает ссылку в виде строки
// И путь до папки куда складывать результат
export default (url, ouputDir = process.cwd()) => {
  const { origin } = new URL(url);
  const fileName = getFileName(getNameFromUrl(url));
  const filePath = path.join(ouputDir, fileName);
  const assetsDirName = getDirName(getNameFromUrl(url));
  const assetsDirPath = path.join(ouputDir, assetsDirName);
  return axios.get(url)
    .then(({ data }) => data)
    .then((content) => {
      const localLinks = getLocalLinks(content, origin);
    
