import path from 'path';
import * as cheerio from 'cheerio';

// Здесь будет диспетчеризация по имени ХТМЛ тега
// Использовать массив объектов или объект как в теории по диспетчеризации?
const mapping = {
  img: 'src',
  link: 'href',
  script: 'src',
};
// Определяем локальные ссылки
// В объекте URL содержится атрибут ORIGIN
const isLocal = (url, baseUrl) => {
  const { origin } = new URL(url);
  return origin === baseUrl;
};

const regexp = /\W+/gi;
const replaceSymbols = (str) => str.replace(regexp, '-');
// Получаем имя файла - через path.parse удобнее получать расширение
export const getFileName = (url) => {
  console.log(path.parse(url));
  const { dir, name, ext } = path.parse(url);
  const rawName = replaceSymbols(path.join(dir, name));
  // Если расширение отсутствует - добавлять ХТМЛ
  const format = ext ?? '.html';

  return `${rawName}${format}`;
};
// Получаем имя папки для ресурсов
export const getDirName = (url) => {
  const { dir, name, ext } = path.parse(url);
  const rawName = replaceSymbols(path.join(dir, name, ext));

  return `${rawName}_files`;
};

// Вытаскивание ссылок из ХТМЛ страницы для последующей обработки
// С учетом диспетчеризации по тегам (ДОбавить фильтрацию по локальным ссылкам)
const getLocalLinks = (html, url) => {
  const $ = cheerio.load(html);
  const links = [];
  Object.keys(mapping).forEach((tag) => {
    $(tag).each((_i, el) => {
      links.push($(el).attr(mapping[tag]));
    });
  });
};
