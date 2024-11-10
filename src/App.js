import ProductList from './Model/ProductList.js';
import PromotionList from './Model/PromotionList.js';
import { InputView } from './View/InputView.js';
import { OutputView } from './View/OutputView.js';
import { PRODUCT_FILENAME, PROMOTION_FILENAME } from './constants.js';
import { validateBuyInput } from './validation/utils.js';

const BUY_MESSAGE =
  '구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])\n';
const CAN_PROMOTE_MESSAGE =
  '현재 {상품명}은(는) 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)\n';
const NOT_ENOUGH_PROMOTION_INVENTORY_MESSAGE =
  '현재 {상품명} {수량}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)\n';
const MEMBERSHIP_DISCOUNT_MESSAGE = '멤버십 할인을 받으시겠습니까? (Y/N)\n';

class App {
  constructor() {
    this.productList = null;
    this.promotionList = null;
  }

  async run() {
    const productsInput = InputView.readFile(PRODUCT_FILENAME);
    const promotionsInput = InputView.readFile(PROMOTION_FILENAME);
    this.productList = new ProductList(productsInput);
    this.promotionList = new PromotionList(promotionsInput);

    OutputView.printInstructions();
    OutputView.printInventory(this.productList);
    this.getInput();
  }

  async getInput() {
    const BuyInput = await InputView.userInput(
      validateBuyInput,
      BUY_MESSAGE,
      this.productList,
    );
    const kindOfBuyList = BuyInput.split(',').map((value) =>
      value.slice(1, -1).split('-'),
    );
  }
  // kindOfBuyList -> [[오렌지주스,1],...]
  // 프로모션 적용이 가능한 상품 -> 수량 안 가져왔을 때
  // 프로모션 재고 부족하여 일부 수량 프로모션 혜택 없이 결제
  // 멤버십 할인 적용 여부
  //
}

export default App;
