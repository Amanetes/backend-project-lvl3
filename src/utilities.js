import path from 'path';
import * as cheerio from 'cheerio';

// Здесь будет диспетчеризация по имени ХТМЛ тега
// Использовать массив объектов или объект как в теории по диспетчеризации?
const mapping = {
  img: 'src',
  link: 'href',
  script: 'src',
};
// Определяем локальные ссылки (или определять по Хостам?)
// на вход приходит ссылка и базовый URL
const isLocal = (link, baseUrl) => {
  // Входящая ссылка распашивается в объект
  const linkObj = new URL(link, baseUrl);
  // Из базовой ссылки выдираем Origin
  const { origin } = new URL(baseUrl);
  // Возвращаем true если origin одинаковые
  return linkObj.origin === origin;
};

const regexp = /\W+/gi;
const replaceSymbols = (str) => str.replace(regexp, '-');

export const getNameFromUrl = (url) => {
  const myUrl = new URL(url);
  const { hostname, pathname } = myUrl;
  return `${hostname}${pathname}`;
};
// Получаем имя файла - через path.parse удобнее получать расширение
export const getFileName = (url) => {
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
export const getLocalLinks = (html, url, outputDir) => {
  const $ = cheerio.load(html);
  const links = [];
  Object.keys(mapping).forEach((tag) => {
    $(tag).each((_i, el) => {
      const currentLink = $(el).attr(mapping[tag]);
      const localLink = isLocal(currentLink, url);
      // Проверка на undefined и локальность ссылки
      // В случае если ссылки по тегам отсутствуют, чтобы
      // они не попадали в итоговый документ
      if (currentLink && localLink) {
        const localLinkObj = new URL(currentLink, url);
        const fileName = getFileName(getNameFromUrl(localLinkObj));
        const filePath = path.join(outputDir, fileName);
        links.push(localLinkObj);
        $(el).attr(mapping[tag], filePath);
      }
    });
  });
  const page = $.html();
  return { page, links };
};
