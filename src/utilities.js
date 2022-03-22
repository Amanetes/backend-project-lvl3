// Здесь будут функции без побочных эффектов

// Здесь будет диспетчеризация по имени ХТМЛ тега
// const mapping = {
//   img: () => 'src',
// };

const regexp = /[^a-zA-Z0-9]/g;
const replaceSymbols = (str) => str.replace(regexp, '-');

// Внутрь данной функции передается "объект", с ключами, а не строка
const getFileName = (url) => {
  const { hostname, pathname } = url;
  const fileName = `${hostname}${pathname}`;
  return `${replaceSymbols(fileName)}.html`;
};

// getExtension = (fileName) => {}

export default getFileName;
