import path, { dirname } from 'path';
import os from 'os';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import nock from 'nock';
import pageLoader from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
// Блокируем исходящее соединение для исключения реальных запросов
nock.disableNetConnect();

let responce;
let tempDir;
let expectedJpg;
let expectedHtml;

// В данном хуке строятся пути до факстур, которые тестируются
// А также читается их содержимое
beforeAll(async () => {
  // Тестовый файл, для ответа от сервера
  responce = await fs.readFile(getFixturePath('responce.html'), 'utf-8');
  // Тестовый файл скачанной страницы
  expectedPage = await fs.readFile(getFixturePath('expectedHtml.html'), 'utf-8');
  // Тестовый файл скачанного ресурса
  expectedJpg = await fs.readFile(getFixturePath('assets/nodeJs.jpg'), 'base-64');
});
// В данном хуке создается временная папка
beforeEach(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

describe('Page loader performance', () => {
  test('Check file download and name', async () => {
    // Имитация запроса через nock
    nock(/ru\.hexlet\.io/)
      .get(/\/courses/)
      // Ответ со статусом 200 и содержимым - страница HTML
      .reply(200, response;
    // Проверяем правильно ли строится имя файла
    const filePath = await pageLoader('https://ru.hexlet.io/courses', tempDir);
    const expectedPath = path.join(tempDir, 'ru-hexlet-io-courses.html');
    expect(filePath).toBe(expectedPath);
    // Сравниваем содержимое загруженной страницы с тем что должно получится
    const loadedHtml = await fs.readFile(expectedPath, 'utf-8');
    expect(loadedHtml).toEqual(expectedHtml);
  });
});
