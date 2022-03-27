oimport path, { dirname } from 'path';
import os from 'os';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import nock from 'nock';
import pageLoader from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const getNormalizePath = (dirname) = path.join(dirpath)
// Блокируем исходящее соединение для исключения реальных запросов
nock.disableNetConnect();
const assetsDirName = 'ru-hexlet-io-courses_files';

let tempDir;
let htmlResponse,
let pathToHtml,
let pathToJpg,
let pathToCss,
let pathToJs,

// В данном хуке строятся пути до факстур, которые тестируются
// А также читается их содержимое
beforeAll(async () => {
  // Тестовый файл, для ответа от сервера
htmlResponse = await fs.readFile(htmlResponse, 'utf-8');
  // Тестовый файл скачанной страницы
pathToHtml = await fs.readFile(getFixturePath())
  // Тестовый файл скачанного ресурса

});
// В данном хуке создается временная папка
beforeEach(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

describe('Page loader performance', () => {
  test('Check file download', async () => {
    // Имитация запроса через nock
    nock(/ru\.hexlet\.io/)
      .get(/\/courses/)
      // Ответ со статусом 200 и содержимым - страница HTML
      .reply(200, response);
    // Проверяем правильно ли строится имя файла
   
    expect(filePath).toBe(expectedPath);
    // Сравниваем содержимое загруженной страницы с тем что должно получится
   
  });
});
