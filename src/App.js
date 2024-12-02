import { PRODUCTS, PROMOTIONS, READ_ITEM_MESSAGE } from './constants.js';
import { readItem } from './validation/validateFunctions.js';
import { InputView } from './view/InputView.js';

class App {
  async run() {
    const products = InputView.readFileSync(PRODUCTS);
    const promotions = InputView.readFileSync(PROMOTIONS);

    const userInput = await InputView.readUserInput(
      READ_ITEM_MESSAGE,
      readItem,
    );
  }
}

export default App;
