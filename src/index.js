import axios from 'axios';
import path from 'path';
import fs from 'fs/promises';

// Формируем имя файла из переданной ссылке

const getFileName = (url) => {
  // создаем экземпляр класса URL
  // т.к у переданной ссылка - это строка, а не объект со свойствами
  const myUrl = new URL(url);
  const { hostname, pathname } = myUrl;
  const fileName = `${hostname}${pathname}`;
  return `${fileName.replace(/\W/g, '-')}.html`;
};
// pageLoader - принимает ссылку и путь до папки
// для загрузки. Выполняет запрос по ссылке
// Возвращает промис.
export default (async (url, dirPath) => {
  const fileName = getFileName(url);
  const filePath = path.join(dirPath, fileName);
  try {
    const response = await axios.get(url);
    await fs.writeFile(filePath, response.data);
    console.log('Writing finished!');
  } catch (error) {
    throw new Error('Unable to write!');
  }
});
