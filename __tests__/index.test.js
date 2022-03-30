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
    css: await fs.readFile(getFixturePath('ru-hexlet-io-courses_files/ru-hexlet-io-assets-application.css'), 'utf-8'),
    png: await fs.readFile(getFixturePath('ru-hexlet-io-courses_files/ru-hexlet-io-assets-professions-nodejs.png')),
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

afterEach(async () => {
  await fs.rm(tempDir, { recursive: true });
  nock.cleanAll();
});

describe('Successful scenario', () => {
  it('Should download files', async () => {
    nock(/ru\.hexlet\.io/)
      .persist()
      .get(/\/courses/)
      .replyWithFile(200, response)
      .get(/assets\/professions\/nodejs\.png/)
      .reply(200, fixturesContent.png)
      .get(/assets\/application\.css/)
      .reply(200, fixturesContent.css)
      .get(/packs\/js\/runtime\.js/)
      .reply(200, fixturesContent.js);

    const filePath = await pageLoader('https://ru.hexlet.io/courses', tempDir);
    const expectedPath = path.join(tempDir, 'ru-hexlet-io-courses.html');
    expect(filePath).toEqual(expectedPath);

    const downloadedHtml = await fs.readFile(filePath, 'utf-8');
    expect(downloadedHtml).toEqual(fixturesContent.initial);

    const downloadedPng = await fs.readFile(assetPaths.png);
    expect(downloadedPng).toEqual(fixturesContent.png);

    const downloadedCss = await fs.readFile(assetPaths.css, 'utf-8');
    expect(downloadedCss).toEqual(fixturesContent.css);

    const downloadedJs = await fs.readFile(assetPaths.js, 'utf-8');
    expect(downloadedJs).toEqual(fixturesContent.js);
  });
});

describe('Negative scenario', () => {
  it('Should throw HTTP error', async () => {
    nock(/example\.com/)
      .get(/\/not-found/)
      .reply(404, null);

    expect.assertions(1);

    await expect(pageLoader('https://example.com/not-found', tempDir)).rejects.toThrowError();
  });

  it('Should throw filesystem errors', async () => {
    nock(/ru\.example\.com/)
      .get(/restricted/)
      .reply(200, null)
      .get(/absent/)
      .reply(200, null);

    expect.assertions(2);
    await expect(pageLoader('http://example.com', '/restrictedDir')).rejects.toThrowError();
    await expect(pageLoader('http://example.com', '/absentDir')).rejects.toThrowError();
  });
});
