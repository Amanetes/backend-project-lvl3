import axios from 'axios';
import path from 'path';
import fs from 'fs/promises';
import getFileName from './utilities.js';

// Здесь будут функции с побочными эффектами

// pageLoader - принимает ссылку и путь до папки
// для загрузки. По умолчанию = путь откуда запущен процесс
export default (url, ouputDir = process.cwd()) => {
  // создаем объект-экземпляр класса URL
  // чтобы извлечь данные и построить имя файла
  const myUrl = new URL(url);
  const fileName = getFileName(myUrl);
  // Построить путь до папки куда будет скачиваться файл
  const filePath = path.join(ouputDir, fileName);
  // Axios делает запрос к серверу по переданной ссылке
  return axios.get(url)
  // Записать ответ(поле data из запроса) в файл
    .then((responce) => fs.writeFile(filePath, responce.data))
  // Вернуть путь до файла
    .then(() => filePath);
};
