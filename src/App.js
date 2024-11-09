import ProductList from './Model/ProductList.js';
import PromotionList from './Model/PromotionList.js';
import { InputView } from './View/InputView.js';
import { OutputView } from './View/OutputView.js';
import { PRODUCT_FILENAME, PROMOTION_FILENAME } from './constants.js';

class App {
  async run() {
    const productsInput = InputView.readFile(PRODUCT_FILENAME);
    const promotionsInput = InputView.readFile(PROMOTION_FILENAME);
    const productList = new ProductList(productsInput);
    const promotionList = new PromotionList(promotionsInput);

    OutputView.printInstructions();
    OutputView.printInventory(productList);
  }
}

export default App;
