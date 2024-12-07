import { DateTimes } from '@woowacourse/mission-utils';
import { PRODUCTS, PROMOTIONS, READ_ITEM_MESSAGE } from './constants.js';
import ProductList from './model/ProductList.js';
import PromotionList from './model/PromotionList.js';
import { readItem } from './validation/validateFunctions.js';
import { InputView } from './view/InputView.js';
import { OutputView } from './view/OutputView.js';

const RECEIPT_FUNCTION = Object.freeze({
  NORMAL_DISCOUNT: (receipt) =>
    receipt.reduce((acc, cur) => acc + cur.normalBuy * cur.price, 0),
  PROMOTION_DISCOUNT: (receipt) =>
    receipt.reduce((acc, cur) => acc + cur.freeGift * cur.price, 0),
  COUNT: (receipt) =>
    receipt.reduce(
      (acc, cur) => acc + cur.promotionBuy + cur.freeGift + cur.normalBuy,
      0,
    ),
  BUY_PRICE: (receipt) =>
    receipt.reduce(
      (acc, cur) =>
        acc + (cur.promotionBuy + cur.freeGift + cur.normalBuy) * cur.price,
      0,
    ),
});

class App {
  constructor() {
    const [products, promotions] = this.getFileContents();
    this.productList = new ProductList(products);
    this.promotionList = new PromotionList(promotions);
  }

  async run() {
    this.printInstruction(this.productList);
    const userInput = await this.getUserInput(this.productList);
    const buyList = this.getBuyList(userInput);
    const receipt = await this.checkBuyList(buyList);
    await this.printReceipt(receipt);
    await this.moreRun();
  }

  async moreRun() {
    const userAnswer = await InputView.askUser(
      `감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)\n`,
    );
    if (userAnswer === 'Y') {
      this.run();
    }
  }

  getFileContents() {
    const products = InputView.readFileSync(PRODUCTS);
    const promotions = InputView.readFileSync(PROMOTIONS);
    return [products, promotions];
  }

  async getUserInput(productList) {
    return InputView.readUserInput(READ_ITEM_MESSAGE, readItem, productList);
  }

  getBuyList(userInput) {
    const buyList = userInput.split(',').map((input) => {
      const [product, inventory] = input.slice(1, -1).split('-');
      return [product, Number(inventory)];
    });
    return buyList;
  }

  printInstruction(productList) {
    OutputView.printWelcome();
    OutputView.printCurrentProductList(productList);
  }

  async checkBuyList(buyList) {
    const buyListMetaData = this.productList.getBuyListMetaData(buyList);
    const buyListPromotionData = this.promotionList.getPromotionListForBuyList(
      buyList,
      buyListMetaData,
    );

    const receipt = [];

    for (let idx = 0; idx < buyList.length; idx += 1) {
      const wantToBuy = buyList[idx];
      const productData = buyListMetaData[idx];
      const promotionData = buyListPromotionData[idx];
      const { name, hasPromotion, withNormal, withPromotion } = productData;

      if (
        hasPromotion &&
        this.isPromotionDate(promotionData) &&
        withPromotion.quantity > 0
      ) {
        const { promotionBuy, freeGift, normalBuy } = await this.spendPromotion(
          productData,
          promotionData,
          wantToBuy,
        ); // 프로모션 할인 적용된 프로모션 재고 소진
        receipt.push({
          name,
          promotionBuy,
          freeGift,
          normalBuy,
          price: withPromotion.price,
        });
        continue;
      }
      const { normalBuy } = this.spendNoPromotion(productData, wantToBuy); // 프로모션 할인 적용 안된 프로모션 재고, 일반 재고 소진
      receipt.push({
        name,
        promotionBuy: 0,
        freeGift: 0,
        normalBuy,
        price: withNormal.price,
      });
    }
    return receipt;
  }

  isPromotionDate({ startDate, endDate }) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start <= DateTimes.now() && DateTimes.now() <= end;
  }

  async spendPromotion(
    { name, withNormal, withPromotion },
    { buy, get },
    wantToBuy,
  ) {
    const buyStock = wantToBuy[1]; // 구매하려는 갯수
    let rest = 0;
    let canBuyStock = 0; // 구매 가능한 갯수
    if (buyStock > withPromotion.quantity) {
      // 구매하려는 갯수가 프로모션 재고보다 클 떄
      canBuyStock = withPromotion.quantity;
      rest = buyStock - withPromotion.quantity;
    } else {
      // 구매하려는 갯수가 프로모션 재고보다 작거나 같을 떄
      canBuyStock = buyStock;
    }

    // 프로모션 할인 적용된 프로모션 재고 소진
    let { canGetMore } = this.getAvailableAdd(buy, get, canBuyStock); // 더 받을 수 있는 개수
    const canBuyFreeGift = this.calculateFreeGift(buy, get, canBuyStock); // 프로모션 적용된 개수
    let freeGift = canBuyFreeGift * get; // 증정
    let promotionBuy = canBuyFreeGift * buy; // 프로모션 적용 O(증정 제외)
    let normalBuy = canBuyStock - (freeGift + promotionBuy); // 프로모션 적용 안된 개수 -> 만약 더 받을 수 있는 개수 있는데 Y 누르면 이거 프로모션 적용된 개수에 더해야함

    if (rest > 0) {
      // 프로모션 재고  < 구매하려는 개수
      const userAskForNoPromotion = await InputView.askUser(
        `\n현재 ${name} ${normalBuy + rest}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)\n`,
      );
      if (userAskForNoPromotion === 'N') {
        normalBuy = 0;
        rest = 0;
      }
    } else if (canGetMore > 0) {
      const userAnswer = await InputView.askUser(
        `\n현재 ${name}은(는) ${canGetMore}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)\n`,
      );
      if (userAnswer === 'Y') {
        promotionBuy += normalBuy;
        freeGift += canGetMore;
        normalBuy = 0;
      }
      canGetMore = 0;
    }

    withPromotion.quantity -= freeGift + normalBuy + promotionBuy;
    withNormal.quantity -= rest;
    return { promotionBuy, freeGift, normalBuy: normalBuy + rest };
  }

  spendNoPromotion({ withNormal, withPromotion }, wantToBuy) {
    if (withPromotion.quantity >= wantToBuy[1]) {
      withPromotion.quantity -= wantToBuy[1];
      return { normalBuy: wantToBuy[1] };
    }

    withNormal.quantity -= wantToBuy[1] - withPromotion.quantity;
    withPromotion.quantity = 0;
    return { normalBuy: wantToBuy[1] };
  }

  getRestNoPromotionCount(buy, get, inventory) {
    return inventory % (buy + get);
  }

  getAvailableAdd(buy, get, inventory) {
    const noPromotion = inventory % (buy + get);
    let canGetMore = 0;
    if (noPromotion > buy && noPromotion < buy + get) {
      canGetMore = buy + get - noPromotion;
    } else if (noPromotion === buy) {
      canGetMore += get;
    }
    return { canGetMore };
  }

  calculateFreeGift(buy, get, inventory) {
    const canBuyFreeGift = Math.floor(inventory / (buy + get));
    return canBuyFreeGift;
  }

  async printReceipt(receipt) {
    const totalNormalDisCountMoney = await this.getNormalDiscount(receipt);
    OutputView.printReceiptAllQuantityAndPrice(receipt);
    const totalPromotionDisCountMoney = this.getAndPrintTotalPromotion(receipt);
    this.printFooter(
      receipt,
      totalPromotionDisCountMoney,
      totalNormalDisCountMoney,
    );
  }

  getAndPrintTotalPromotion(receipt) {
    const totalPromotionDisCountMoney =
      this.getTotalPromotionDiscountMoney(receipt);
    if (totalPromotionDisCountMoney > 0) {
      this.printTotalPromotion(receipt);
    }
    return totalPromotionDisCountMoney;
  }

  printFooter(receipt, totalPromotionDisCountMoney, totalNormalDisCountMoney) {
    const totalCount = RECEIPT_FUNCTION.COUNT(receipt);
    const totalBuyPrice = RECEIPT_FUNCTION.BUY_PRICE(receipt);
    OutputView.printReceiptPriceInfo({
      totalCount,
      totalBuyPrice,
      totalPromotionDisCountMoney,
      totalNormalDisCountMoney,
    });
  }

  getTotalPromotionDiscountMoney(receipt) {
    const totalPromotionDisCountMoney =
      RECEIPT_FUNCTION.PROMOTION_DISCOUNT(receipt);
    return totalPromotionDisCountMoney;
  }

  printTotalPromotion(receipt) {
    OutputView.printResult('=============증	정===============');
    for (let i = 0; i < receipt.length; i += 1) {
      this.printPromotion(receipt[i]);
    }
  }

  async getMemberShip() {
    const userAnswer = await InputView.askUser(
      '\n멤버십 할인을 받으시겠습니까? (Y/N)\n',
    );
    if (userAnswer === 'Y') {
      return 0.3;
    }
    return 0;
  }

  async getNormalDiscount(receipt) {
    let money = RECEIPT_FUNCTION.NORMAL_DISCOUNT(receipt);
    const membershipRate = await this.getMemberShip();
    money *= membershipRate;

    if (money >= 8000) {
      money = 8000;
    }
    return money;
  }

  printPromotion(product) {
    const { name, freeGift } = product;
    if (freeGift === 0) {
      return;
    }
    OutputView.printResult(`${name}  ${freeGift}`);
  }
}

export default App;
