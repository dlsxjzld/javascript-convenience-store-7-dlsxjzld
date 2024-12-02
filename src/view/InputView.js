import { Console } from '@woowacourse/mission-utils';
import path from 'path';
import fs from 'fs';
import { check } from '../validation/validateFunctions.js';

export const InputView = {
  async readUserInput(message, validation, rest) {
    const input = await Console.readLineAsync(message);
    if (check(input, validation, rest)) {
      return input;
    }
    return this.readUserInput(message, validation, rest);
  },

  readFileSync(fileName) {
    const absolutePath = path.resolve();
    const fileAbsolutePath = `${absolutePath}/public/${fileName}.md`;
    const fileData = fs.readFileSync(fileAbsolutePath, 'utf-8');

    return fileData;
  },
};
