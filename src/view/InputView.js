import { Console } from '@woowacourse/mission-utils';
import path from 'path';
import fs from 'fs';

export const InputView = {
  // TODO: 구현에 필요한 상품 목록과 행사 목록을 파일 입출력을 통해 불러온다.
  //   TODO: `public/products.md`과 `public/promotions.md` 파일을 이용한다.
  //   TODO: 두 파일 모두 내용의 형식을 유지한다면 값은 수정할 수 있다.
  async readItem() {
    const input = await Console.readLineAsync(
      '구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])',
    );
  },

  readFileSync(fileName) {
    const absolutePath = path.resolve();
    const fileAbsolutePath = `${absolutePath}/public/${fileName}.md`;
    const fileData = fs.readFileSync(fileAbsolutePath, 'utf-8');

    return fileData;
  },
};
