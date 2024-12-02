import { PRODUCTS, PROMOTIONS, READ_ITEM_MESSAGE } from './constants.js';
import ProductList from './model/ProductList.js';
import { readItem } from './validation/validateFunctions.js';
import { InputView } from './view/InputView.js';
import { OutputView } from './view/OutputView.js';

class App {
  async run() {
    const products = InputView.readFileSync(PRODUCTS);
    const promotions = InputView.readFileSync(PROMOTIONS);
    const userInput = await this.getUserInput();

    const productList = new ProductList(products);
    OutputView.printResult(productList.printProductList());
  }

  // console.log('promotions', promotions);
  async getUserInput() {
    return InputView.readUserInput(READ_ITEM_MESSAGE, readItem);
  }
}

export default App;
