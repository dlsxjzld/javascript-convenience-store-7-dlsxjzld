import { InputView } from './View/InputView.js';

const PRODUCT_FILENAME = 'products.md';
const PROMOTION_FILENAME = 'promotions.md';
class App {
  async run() {
    const productsInput = InputView.readFile(PRODUCT_FILENAME);
    const promotionsInput = InputView.readFile(PROMOTION_FILENAME);
  }
}

export default App;
