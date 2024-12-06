import { Console } from '@woowacourse/mission-utils';

export const OutputView = {
  printProducts() {
    Console.print('- 콜라 1,000원 10개 탄산2+1');
  },

  printResult(result) {
    Console.print(result);
  },

  printWelcome() {
    Console.print('안녕하세요. W편의점입니다.');
    Console.print('현재 보유하고 있는 상품입니다.');
    Console.print('');
  },

  printCurrentProductList(productList) {
    const productMetaDataList = Array.from(
      productList.getProductList().values(),
    );
    productMetaDataList.forEach((productMetadata) => {
      this.printPromotion(productMetadata);
      this.printNormal(productMetadata);
    });
    Console.print('');
  },

  printPromotion({ name, withPromotion, hasPromotion }) {
    const { price, quantity, promotion } = withPromotion;
    if (!hasPromotion) {
      return;
    }

    Console.print(
      `- ${name} ${price.toLocaleString()}원 ${this.getStockResult(quantity)} ${promotion}`,
    );
  },

  printNormal({ name, withNormal }) {
    const { price, quantity } = withNormal;

    Console.print(
      `- ${name} ${price.toLocaleString()}원 ${this.getStockResult(quantity)}`,
    );
  },

  getStockResult(quantity) {
    if (quantity === 0 || quantity === null) {
      return '재고 없음';
    }
    return `${quantity.toLocaleString()}개`;
  },
};
