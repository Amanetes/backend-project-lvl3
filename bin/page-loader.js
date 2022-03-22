#!/usr/bin/env node
import { Command } from 'commander/esm.mjs';
import pageLoader from '../src/index.js';

// Утилита должна выводить путь к файлу в консоль
const program = new Command();

program
  .description('Page loader utility')
  .version('0.0.1', '-V, --version', 'output the version number')
  .argument('<url>')
  .option('-o, --output [dir]', 'output dir', process.cwd())
  .action(async (url, options) => {
    await pageLoader(url, options.output);
    await console.log('Page successfully downoladed into', options.output);
  });
program.parse();
