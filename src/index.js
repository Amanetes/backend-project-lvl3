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
  const filePath = path.join(outputDir, fileName); // путь до скачанной страницы
  const assetsDirName = getDirName(getNameFromUrl(url));
  const assetsDirPath = path.join(outputDir, assetsDirName); // путь до директории с файлами
  let response; // ввести переменную для того чтобы сохранить контент
  return axios.get(url)
    .then(({ data }) => {
      response = data;
      return createDir(assetsDirPath);
    })
    .then(() => {
      const localLinks = getLocalLinks(response, origin);
      return localLinks.map((link) => axios.get(link, { responseType: 'arraybuffer' })
        .then((localLinkResponse) => {
          // создать путь для сохранения, чтобы каждый файл сохранился отдельным экземпляром
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
