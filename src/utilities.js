import path from 'path';
import * as cheerio from 'cheerio';
import { getNameFromUrl, getFileName } from './nameHandlers.js';

const mapping = {
  img: 'src',
  link: 'href',
  script: 'src',
};

const isLocal = (link, baseUrl) => {
  const linkObj = new URL(link, baseUrl);
  const { origin } = new URL(baseUrl);

  return linkObj.origin === origin;
};

export const getLocalLinks = (html, origin) => {
  const $ = cheerio.load(html);
  const links = [];
  Object.keys(mapping).forEach((tag) => {
    $(tag).each((_i, el) => {
      links.push($(el).attr(mapping[tag]));
    });
  });

  return links
    .filter((link) => link !== undefined && isLocal(link, origin))
    .reduce((acc, link) => {
      if (link.startsWith('/')) {
        return [...acc, new URL(link, origin).toString()];
      }
      return [...acc, new URL(link).toString()];
    }, []);
};

export const editHtml = (html, origin, outputPath) => {
  const $ = cheerio.load(html);
  Object.keys(mapping).forEach((tag) => {
    $(tag).each((_i, el) => {
      const currentLink = $(el).attr(mapping[tag]);
      const currentLinkObj = new URL(currentLink, origin);

      if (currentLink && isLocal(currentLink, origin)) {
        const fileName = getFileName(getNameFromUrl(currentLinkObj));
        const filePath = path.join(outputPath, fileName);
        $(el).attr(mapping[tag], filePath);
      }
    });
  });
  return $.html();
};
