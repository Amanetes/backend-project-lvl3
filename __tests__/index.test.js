import path, { dirname } from 'path';
import os from 'os';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import nock from 'nock';
import pageLoader from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

nock.disableNetConnect();

let tempDir;
let response;
let assetsDirPath;
let fixturesContent;
let assetPaths;

beforeAll(async () => {
  response = getFixturePath('response.html');
  fixturesContent = {
    initial: await fs.readFile(getFixturePath('ru-hexlet-io-courses.html'), 'utf-8'),
    js: await fs.readFile(getFixturePath('ru-hexlet-io-courses_files/ru-hexlet-io-packs-js-runtime.js'), 'utf-8'),
    css: await fs.readFile(getFixturePath('ru-hexlet-io-courses_files/ru-hexlet-io-assets-application.css'), 'binary'),
    png: await fs.readFile(getFixturePath('ru-hexlet-io-courses_files/ru-hexlet-io-assets-professions-nodejs.png'), 'binary'),
    html: await fs.readFile(getFixturePath('ru-hexlet-io-courses_files/ru-hexlet-io-courses.html'), 'utf-8'),
  };
});
beforeEach(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  assetsDirPath = path.join(tempDir, 'ru-hexlet-io-courses_files');
  assetPaths = {
    js: path.join(assetsDirPath, 'ru-hexlet-io-packs-js-runtime.js'),
    css: path.join(assetsDirPath, 'ru-hexlet-io-assets-application.css'),
    png: path.join(assetsDirPath, 'ru-hexlet-io-assets-professions-nodejs.png'),
    html: path.join(assetsDirPath, 'ru-hexlet-io-courses.html'),
  };
});

// afterEach(async () => {
//   await fs.rm(tempDir, { recursive: true });
// });

describe('Successful scenario', () => {
  test('Should download files', async () => {
    nock(/ru\.hexlet\.io/)
      .persist()
      .get(/\/courses/)
      .replyWithFile(200, response);
    // .get(/assets\/professions\/nodejs\.png/)
    // .reply(200, fixturesContent.png)
    // .get(/assets\/application\.css/)
    // .reply(200, fixturesContent.css)
    // .get(/packs\/js\/runtime\.js/)
    // .reply(200, fixturesContent.js);

    const filePath = await pageLoader('https://ru.hexlet.io/courses', tempDir);
    const expectedPath = path.join(tempDir, 'ru-hexlet-io-courses.html');
    expect(filePath).toBe(expectedPath);

    const downloadedHtml = await fs.readFile(filePath, 'utf-8');
    expect(downloadedHtml).toEqual(fixturesContent.initial);

    // const downloadedPng = fs.readFile(assetPaths.png, 'binary');
    // expect(downloadedPng).toEqual(assetPaths.png);

    // const downloadedJs = fs.readFile(assetPaths.css, 'utf-8');
    // expect(downloadedJs).toEqual(fixturesContent.js);

    // const downloadedCss = fs.readFile(assetPaths.css, 'binary');
    // expect(downloadedCss).toEqual(fixturesContent.css);

    // const downloadedHtml = fs.readFile(assetPaths.html, 'utf-8');
    // expect(downloadedHtml).toEqual(fixturesContent.html);
  });
});

// describe('Negative scenario', () => {
//   test('Should throw network errors', async () => {
//     nock(/ru\.example\.com/)
//       .persist()
//       .get(/\/BAD_REQUEST/)
//       .reply(400)
//       .get(/\/BAD_GATEWAY/)
//       .reply(502);

//     expect.assertions(2);
//     await expect(pageLoader('http://www.example.com/bad-request', tempDir)).rejects.toThrow('The server cannot process the request');
//     await expect(pageLoader('http://www.example.com/bad-gateway', tempDir)).rejects.toThrow('The server gon an invalid response');
//   });

//   test('Should throw filesystem errors', async () => {
//     nock(/ru\.example\.com/)
//       .persist()
//       .get(/restricted/)
//       .reply(200)
//       .get(/absent/)
//       .reply(200);

//     expect.assertions(2);
//     await expect(pageLoader('http://www.example.com', '/restrictedDir')).rejects.toThrow('EACCES: permission denied');
//     await expect(pageLoader('http://www.example.com', '/absentDir')).rejects.toThrow('ENOENT: no such file or directory');
//   });
// });
