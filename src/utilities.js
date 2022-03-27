import path from 'path';
import * as cheerio from 'cheerio';
import { getNameFromUrl, getFileName } from './nameHandlers.js';

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

// Вытаскивание ссылок из ХТМЛ страницы для последующей обработки
// С учетом диспетчеризации по тегам (ДОбавить фильтрацию по локальным ссылкам)
// { origin } = new URL (url)
export const getLocalLinks = (html, origin) => {
  const $ = cheerio.load(html);
  const links = [];
  Object.keys(mapping).forEach((tag) => {
    $(tag).each((_i, el) => {
      links.push($(el).attr(mapping[tag]));
    });
  });
  // Собрать массив АБСОЛЮТНЫХ ссылок, чтобы реализовать скачивание ресурсов по ним
  return links
    .filter((link) => link !== undefined && isLocal(link, origin))
    .reduce((acc, link) => {
      if (link.startsWith('/')) {
        return [...acc, new URL(link, origin).toString()];
      }
      return [...acc, new URL(link).toString()];
    }, []);
};
// Можно ли сюда запихнуть ссылки сразу? или редактировать путем достал - обработал?
export const editHtml = (html, origin, outputPath) => {
  const $ = cheerio.load(html);
  Object.keys(mapping).forEach((tag) => {
    $(tag).each((_i, el) => {
      const currentLink = $(el).attr(mapping[tag]);
      const currentLinkObj = new URL(currentLink, origin);
      // Проверка на undefined
      // Если локальная и существует то перезаписываем ссылку
      if (currentLink && isLocal(currentLink, origin)) {
        const fileName = getFileName(getNameFromUrl(currentLinkObj));
        const filePath = path.join(outputPath, fileName);
        $(el).attr(mapping[tag], filePath);
      }
    });
  });
  return $.html();
};
