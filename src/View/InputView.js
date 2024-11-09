import { Console } from '@woowacourse/mission-utils';
import fs from 'fs';
import path from 'path';

export const InputView = {
  readFile(fileName) {
    const absoluteDirectoryPath = path.resolve();
    const targetFilePath = `${absoluteDirectoryPath}/public/${fileName}`;

    return fs
      .readFileSync(targetFilePath, 'utf8')
      .split('\n')
      .filter(Boolean)
      .map((row) => row.split(','));
  },

  async readItem() {
    const input = await Console.readLineAsync(
      '구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])',
    );
  },

  async userInput(validate, message) {
    const input = await Console.readLineAsync(message);
    if (validate(input)) {
      return input;
    }
    return this.userInput(validate, message);
  },
};
