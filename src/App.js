import ProductList from './Model/ProductList.js';
import PromotionList from './Model/PromotionList.js';
import Receipt from './Model/Receipt.js';
import { InputView } from './View/InputView.js';
import { OutputView } from './View/OutputView.js';
import {
  BUY_MESSAGE,
  PRODUCT_FILENAME,
  PROMOTION_FILENAME,
} from './constants.js';
import { validateBuyInput } from './validation/utils.js';

class App {
  constructor() {
    const productsInput = InputView.readFile(PRODUCT_FILENAME);
    const promotionsInput = InputView.readFile(PROMOTION_FILENAME);
    this.productList = new ProductList(productsInput);
    this.promotionList = new PromotionList(promotionsInput);
    this.receipt = null;
  }

  async run() {
    OutputView.printInstructions();
    OutputView.printInventory(this.productList);
    const buyInput = await this.getInput();

    this.receipt = new Receipt(buyInput, this.productList, this.promotionList);
    await this.receipt.run();

    await this.moreRun();
  }

  async getInput() {
    const buyInput = await InputView.userInput(
      validateBuyInput,
      BUY_MESSAGE,
      this.productList,
    );

    return buyInput.split(',').map((value) => value.slice(1, -1).split('-'));
  }

  async moreRun() {
    const moreBuy = await InputView.moreBuy();
    if (moreBuy === 'Y') {
      await this.run();
    }
  }
}

export default App;
