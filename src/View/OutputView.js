import { Console } from '@woowacourse/mission-utils';

export const OutputView = {
  printProducts() {
    Console.print('- 콜라 1,000원 10개 탄산2+1');
  },

  printInstructions() {
    Console.print('안녕하세요. W편의점입니다.');
    Console.print('현재 보유하고 있는 상품입니다.\n');
  },

  printInventory(productList) {
    const inventoryList = productList.getProductInventory();
    inventoryList.forEach(({ name, price, quantity, promotion }) => {
      this.printProduct({ name, price, quantity, promotion });
    });
    Console.print('');
  },

  printProduct({ name, price, quantity, promotion }) {
    if (quantity === null || promotion === null) return;
    Console.print(
      `- ${name} ${price.toLocaleString()}원 ${this.getQuantity(quantity)}${this.getPromotion(promotion)}`,
    );
  },

  getQuantity(quantity) {
    if (quantity === 0) {
      return '재고 없음';
    }
    return `${quantity}개`;
  },
  getPromotion(promotion) {
    if (promotion !== 'null') {
      return ` ${promotion}`;
    }
    return '';
  },
};
