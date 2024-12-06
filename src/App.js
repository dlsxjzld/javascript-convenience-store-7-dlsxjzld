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
    // 프로모션 할인
    // 멤버십 할인
    // TODO: 재고 관리
    // 영수증에 실제 재고 추가 해야함,
    // productList에서 재고 차감해야함
    console.log('buyList', buyList);
    await this.checkBuyList(this.productList, this.promotionList, buyList);
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

  async checkBuyList(productList, promotionList, buyList) {
    const receipt = [];
    const buyListMetaData = productList.getBuyListMetaData(buyList);
    const buyListPromotionData = promotionList.getPromotionListForBuyList(
      buyList,
      buyListMetaData,
    );

    // 프로모션 있고 프로모션 재고 있으면 프로모션 재고 소진 시작
    // 프로모션 적용 기간 O, 프로모션 할인 O, 재고 소진
    // 프로모션 적용 기간 X, 프로모션 할인 X, 재고 소진
    // 프로모션 재고 없으면 일반 재고 소진

    for (let idx = 0; idx < buyList.length; idx += 1) {
      const wantToBuy = buyList[idx];
      const productData = buyListMetaData[idx];
      const promotionData = buyListPromotionData[idx];

      const { name, hasMock, hasPromotion, withNormal, withPromotion } =
        productData;
      if (
        hasPromotion &&
        this.isPromotionDate(promotionData) &&
        withPromotion.quantity > 0
      ) {
        const { calculateBuyPromotion, normalBuy } = await this.spendPromotion(
          productData,
          promotionData,
          wantToBuy,
        ); // 프로모션 할인 적용된 프로모션 재고 소진
        receipt.push({ name, calculateBuyPromotion, normalBuy });
        continue;
      }
      const { normalBuy } = this.spendNoPromotion(productData, wantToBuy); // 프로모션 할인 적용 안된 프로모션 재고, 일반 재고 소진
      receipt.push({ name, calculateBuyPromotion: 0, normalBuy });
    }

    console.log('buyListMetaData', buyListMetaData);
    console.log('receipt', receipt);
  }

  // promotion 기간인지
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
    let { canGetMore } = this.calculateAvailableAdd(buy, get, canBuyStock); // 더 받을 수 있는 개수
    let calculateBuyPromotion = this.calculateBuyPromotion(
      buy,
      get,
      canBuyStock,
    ); // 프로모션 적용된 개수
    let normalBuy = canBuyStock - calculateBuyPromotion; // 프로모션 적용 안된 개수 -> 만약 더 받을 수 있는 개수 있는데 Y 누르면 이거 프로모션 적용된 개수에 더해야함
    console.log('canGetMore', canGetMore);
    console.log('calculateBuyPromotion', calculateBuyPromotion);
    console.log('normalBuy', normalBuy);
    console.log('rest', rest);

    /// /////////////// 콜라 8개남음 구매 10개인 상황
    // rest : 2
    // canGetMore:1
    if (rest > 0) {
      // 프로모션 재고  < 구매하려는 개수
      const userAskForNoPromotion = await InputView.askUser(
        `현재 ${name} ${normalBuy + rest}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)`,
      );
      if (userAskForNoPromotion === 'N') {
        normalBuy = 0;
        rest = 0;
      }
    } else if (canGetMore > 0) {
      const userAnswer = await InputView.askUser(
        `현재 ${name}은(는) ${canGetMore}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)`,
      );
      if (userAnswer === 'Y') {
        calculateBuyPromotion += normalBuy + canGetMore;
        normalBuy = 0;
      }
      canGetMore = 0;
    }

    console.log(
      'after calculateBuyPromotion, normalBuy',
      calculateBuyPromotion,
      normalBuy,
    );
    withPromotion.quantity -= calculateBuyPromotion + normalBuy;
    withNormal.quantity -= rest;
    return { calculateBuyPromotion, normalBuy: normalBuy + rest };
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

  calculateAvailableAdd(buy, get, inventory) {
    let canGetMore = 0; // 추가로 받는다면 받을 수 있는 개수
    let noPromotion = inventory % (buy + get);
    // 3 2
    // 4 2 buy+get > inventory > buy
    // inventory === buy
    while (noPromotion >= buy) {
      if (noPromotion < buy + get) {
        canGetMore = buy + get - noPromotion;
      } else if (noPromotion === buy) {
        canGetMore += get;
      }
      noPromotion -= buy;
    }
    return { canGetMore };
    // Y선택시 promotion+canGetMore -> finalPromotion
    // N선택시 noPromotion + canGetMore -> finalNoPromotion
  }

  calculateBuyPromotion(buy, get, inventory) {
    const canBuyPromotion = Math.floor(inventory / (buy + get)) * (buy + get);
    return canBuyPromotion;
  }
}

export default App;
