import path, { dirname } from 'path';
import os from 'os';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import nock from 'nock';
import pageLoader from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
// Отключаем соединенине
nock.disableNetConnect();

let expectedHtml;
let responceHtml;
let tempDir;
// Выключение исходящего соединения
// В данном хуке строятся пути до факстур, которые тестируются
// А также читается их содержимое
beforeAll(async () => {
  responceHtml = await fs.readFile(getFixturePath('before.html'), 'utf-8');
  expectedHtml = await fs.readFile(getFixturePath('after.html'), 'utf-8');
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
      .reply(200, responceHtml);
    // Проверяем правильно ли строится имя файла
    const filePath = await pageLoader('https://ru.hexlet.io/courses', tempDir);
    const expectedPath = path.join(tempDir, 'ru-hexlet-io-courses.html');
    expect(filePath).toBe(expectedPath);
    // Сравниваем содержимое загруженной страницы с тем что должно получится
    const loadedHtml = await fs.readFile(expectedPath, 'utf-8');
    expect(loadedHtml).toEqual(expectedHtml);
  });
});
