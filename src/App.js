import { InputView } from './View/InputView.js';
import { PRODUCT_FILENAME, PROMOTION_FILENAME } from './constants.js';
class App {
  async run() {
    const productsInput = InputView.readFile(PRODUCT_FILENAME);
    const promotionsInput = InputView.readFile(PROMOTION_FILENAME);
  }
}

export default App;
