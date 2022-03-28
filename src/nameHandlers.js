import path from 'path';

const regexp = /\W+/gi;
const replaceSymbols = (str) => str.replace(regexp, '-');

export const getNameFromUrl = (url) => {
  const myUrl = new URL(url);
  const { hostname, pathname } = myUrl;

  return `${hostname}${pathname}`;
};

export const getFileName = (url) => {
  const { dir, name, ext } = path.parse(url);
  const rawName = replaceSymbols(path.join(dir, name));
  const format = ext || '.html';

  return `${rawName}${format}`;
};

export const getDirName = (url) => {
  const { dir, name, ext } = path.parse(url);
  const rawName = replaceSymbols(path.join(dir, name, ext));

  return `${rawName}_files`;
};
