import { Console } from '@woowacourse/mission-utils';

export const OutputView = {
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

  printReceiptMetaData() {
    OutputView.printResult('\n==============W 편의점================');
    OutputView.printResult('상품명		수량	금액');
  },

  printReceiptAllQuantityAndPrice(receipt) {
    this.printReceiptMetaData();
    for (let i = 0; i < receipt.length; i += 1) {
      this.printQuantityAndPrice(receipt[i]);
    }
  },

  printQuantityAndPrice(product) {
    const { name, promotionBuy, freeGift, normalBuy, price } = product;
    const totalQuantity = promotionBuy + freeGift + normalBuy;
    OutputView.printResult(
      `${name}  ${totalQuantity}  ${totalQuantity * price}`,
    );
  },

  printReceiptPriceInfo(data) {
    OutputView.printResult('====================================');
    this.printTotalPurchaseMoney(data);
    this.printTotalDiscount(data);
    this.printPaidMoney(data);
  },
  printTotalPurchaseMoney({ totalBuyPrice, totalCount }) {
    this.printPrice('총구매액', totalBuyPrice, totalCount);
  },
  printTotalDiscount({
    totalPromotionDisCountMoney,
    totalNormalDisCountMoney,
  }) {
    this.printPrice('행사할인', -totalPromotionDisCountMoney);
    this.printPrice('멤버십할인', -totalNormalDisCountMoney);
  },

  printPaidMoney({
    totalBuyPrice,
    totalPromotionDisCountMoney,
    totalNormalDisCountMoney,
  }) {
    this.printPrice(
      '내실돈',
      totalBuyPrice - totalPromotionDisCountMoney - totalNormalDisCountMoney,
    );
  },

  printPrice(message, price, totalCount = null) {
    if (totalCount !== null) {
      OutputView.printResult(
        `${message}		${totalCount}	${price.toLocaleString()}`,
      );
      return;
    }
    OutputView.printResult(`${message}		${price.toLocaleString()}`);
  },
};
