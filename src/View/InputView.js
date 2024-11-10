import { Console } from '@woowacourse/mission-utils';
import fs from 'fs';
import path from 'path';

import { MORE_BUY, MEMBERSHIP_DISCOUNT_MESSAGE } from '../constants.js';

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

  async getMembership() {
    const input = await Console.readLineAsync(MEMBERSHIP_DISCOUNT_MESSAGE);
    Console.print('');
    if (input === 'Y' || input === 'N') {
      return input;
    }
    return this.getMembership();
  },

  async moreBuy() {
    const input = await Console.readLineAsync(MORE_BUY);
    Console.print('');
    if (input === 'Y' || input === 'N') {
      return input;
    }
    return this.moreBuy();
  },

  async readAddRegular(productName, get) {
    const input = await Console.readLineAsync(
      `현재 ${productName} ${get}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)`,
    );
    Console.print('');
    if (input === 'Y' || input === 'N') {
      return input;
    }
    return this.readAddRegular(productName, get);
  },

  async readAddPromotion(productName, get) {
    const input = await Console.readLineAsync(
      `현재 ${productName}은(는) ${get}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)\n`,
    );
    Console.print('');
    if (input === 'Y' || input === 'N') {
      return input;
    }
    return this.readAddPromotion(productName, get);
  },

  async userInput(validate, message, rest) {
    const input = await Console.readLineAsync(message);
    Console.print('');
    if (validate(input, rest)) {
      return input;
    }
    return this.userInput(validate, message, rest);
  },
};
