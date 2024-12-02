import { PRODUCTS, PROMOTIONS } from './constants.js';
import { InputView } from './view/InputView.js';

class App {
  async run() {
    const products = InputView.readFileSync(PRODUCTS);
    const promotions = InputView.readFileSync(PROMOTIONS);
  }
}

export default App;
