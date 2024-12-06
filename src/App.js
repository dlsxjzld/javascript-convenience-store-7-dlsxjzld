import { PRODUCTS, PROMOTIONS, READ_ITEM_MESSAGE } from './constants.js';
import ProductList from './model/ProductList.js';
import PromotionList from './model/PromotionList.js';
import { readItem } from './validation/validateFunctions.js';
import { InputView } from './view/InputView.js';
import { OutputView } from './view/OutputView.js';

class App {
  async run() {
    const [products, promotions] = this.getFileContents();
    const productList = new ProductList(products);
    const promotionList = new PromotionList(promotions);
    OutputView.printWelcome();
    OutputView.printCurrentProductList(productList);

    const userInput = await this.getUserInput(productList);
    const buyList = this.getBuyList(userInput);
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
}

export default App;
