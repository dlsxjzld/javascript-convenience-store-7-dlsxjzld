import { DateTimes } from '@woowacourse/mission-utils';
import { PRODUCTS, PROMOTIONS, READ_ITEM_MESSAGE } from './constants.js';
import ProductList from './model/ProductList.js';
import PromotionList from './model/PromotionList.js';
import { readItem } from './validation/validateFunctions.js';
import { InputView } from './view/InputView.js';
import { OutputView } from './view/OutputView.js';

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
    const receipt = [];
    const buyListMetaData = this.productList.getBuyListMetaData(buyList);
    const buyListPromotionData = this.promotionList.getPromotionListForBuyList(
      buyList,
      buyListMetaData,
    );

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
        const { promotionBuy, calculateBuyPromotion, normalBuy } =
          await this.spendPromotion(productData, promotionData, wantToBuy); // 프로모션 할인 적용된 프로모션 재고 소진
        receipt.push({
          name,
          promotionBuy,
          calculateBuyPromotion,
          normalBuy,
          price: withPromotion.price,
        });
        continue;
      }
      const { normalBuy } = this.spendNoPromotion(productData, wantToBuy); // 프로모션 할인 적용 안된 프로모션 재고, 일반 재고 소진
      receipt.push({
        name,
        promotionBuy: 0,
        calculateBuyPromotion: 0,
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
    { name, hasMock, hasPromotion, withNormal, withPromotion },
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
    const canBuyPromotionCount = this.calculateBuyPromotion(
      buy,
      get,
      canBuyStock,
    ); // 프로모션 적용된 개수
    let calculateBuyPromotion = canBuyPromotionCount * get; // 증정
    let promotionBuy = canBuyPromotionCount * buy; // 프로모션 적용 O(증정 제외)
    let normalBuy = canBuyStock - (calculateBuyPromotion + promotionBuy); // 프로모션 적용 안된 개수 -> 만약 더 받을 수 있는 개수 있는데 Y 누르면 이거 프로모션 적용된 개수에 더해야함

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
        calculateBuyPromotion += canGetMore;
        normalBuy = 0;
      }
      canGetMore = 0;
    }

    withPromotion.quantity -= calculateBuyPromotion + normalBuy + promotionBuy;
    withNormal.quantity -= rest;
    return { promotionBuy, calculateBuyPromotion, normalBuy: normalBuy + rest };
  }

  spendNoPromotion(
    { name, hasMock, hasPromotion, withNormal, withPromotion },
    wantToBuy,
  ) {
    let normalBuy = 0;
    if (withPromotion.quantity >= wantToBuy[1]) {
      withPromotion.quantity -= wantToBuy[1];
      normalBuy += wantToBuy[1];
    } else {
      normalBuy += wantToBuy[1];
      withNormal.quantity -= wantToBuy[1] - withPromotion.quantity;
      withPromotion.quantity = 0;
    }
    return { normalBuy };
  }

  getRestNoPromotionCount(buy, get, inventory) {
    return inventory % (buy + get);
  }

  getAvailableAdd(buy, get, inventory) {
    let noPromotion = inventory % (buy + get);
    let canGetMore = 0; // 추가로 받는다면 받을 수 있는 개수
    while (noPromotion >= buy) {
      if (noPromotion < buy + get) {
        canGetMore = buy + get - noPromotion;
      } else if (noPromotion === buy) {
        canGetMore += get;
      }
      noPromotion -= buy;
    }
    return { canGetMore };
  }

  calculateBuyPromotion(buy, get, inventory) {
    const canBuyPromotionCount = Math.floor(inventory / (buy + get));
    return canBuyPromotionCount;
  }

  async printReceipt(receipt) {
    OutputView.printResult('');
    const totalNormalDisCountMoney =
      await this.getTotalNormalDiscountMoney(receipt);

    OutputView.printResult('');

    OutputView.printReceiptHeader();
    for (let i = 0; i < receipt.length; i += 1) {
      this.printQuantityAndPrice(receipt[i]);
    }

    const totalPromotionDisCountMoney = receipt.reduce(
      (acc, cur) => acc + cur.calculateBuyPromotion * cur.price,
      0,
    );
    const totalCount = receipt.reduce(
      (acc, cur) =>
        acc + cur.promotionBuy + cur.calculateBuyPromotion + cur.normalBuy,
      0,
    );

    const totalBuyPrice = receipt.reduce(
      (acc, cur) =>
        acc +
        (cur.promotionBuy + cur.calculateBuyPromotion + cur.normalBuy) *
          cur.price,
      0,
    );

    if (totalPromotionDisCountMoney > 0) {
      OutputView.printResult('=============증	정===============');
      for (let i = 0; i < receipt.length; i += 1) {
        this.printPromotion(receipt[i]);
      }
    }

    OutputView.printReceiptFooter({
      totalCount,
      totalBuyPrice,
      totalPromotionDisCountMoney,
      totalNormalDisCountMoney,
    });
  }

  async getMemberShip() {
    const userAnswer = await InputView.askUser(
      '멤버십 할인을 받으시겠습니까? (Y/N)\n',
    );
    if (userAnswer === 'Y') {
      return 0.3;
    }
    return 0;
  }

  calculateTotalNormalMoney(receipt) {
    let result = 0;
    for (let i = 0; i < receipt.length; i += 1) {
      const { normalBuy, price } = receipt[i];
      result += normalBuy * price;
    }
    return result;
  }

  async getTotalNormalDiscountMoney(receipt) {
    let money = this.calculateTotalNormalMoney(receipt);
    const membershipRate = await this.getMemberShip();
    money *= membershipRate;

    if (money >= 8000) {
      money = 8000;
    }
    return money;
  }

  printQuantityAndPrice(product) {
    const { name, promotionBuy, calculateBuyPromotion, normalBuy, price } =
      product;
    const totalQuantity = promotionBuy + calculateBuyPromotion + normalBuy;
    OutputView.printResult(
      `${name}  ${totalQuantity}  ${totalQuantity * price}`,
    );
  }

  printPromotion(product) {
    const { name, calculateBuyPromotion } = product;
    if (calculateBuyPromotion === 0) {
      return;
    }
    OutputView.printResult(`${name}  ${calculateBuyPromotion}`);
  }
}

export default App;
