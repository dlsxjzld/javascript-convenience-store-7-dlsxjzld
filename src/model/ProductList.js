export default class ProductList {
  #productList;

  constructor(userInput) {
    const [key, ...productList] = userInput
      .split('\n')
      .filter(Boolean)
      .map((row) => row.split(','));
    this.#productList = new Map();

    this.init(productList);
    this.addMetaData(productList);
  }

  init(productList) {
    const kinds = Array.from(new Set(productList.map(([name]) => name)));

    for (let idx = 0; idx < kinds.length; idx += 1) {
      const name = kinds[idx];
      this.#productList.set(kinds[idx], this.makeEmptyProduct({ name }));
    }
  }

  addMetaData(productList) {
    productList.forEach(([name, price, quantity, promotion]) => {
      if (promotion !== 'null') {
        this.addPromotion({ name, price, quantity, promotion });
        return;
      }
      this.addNormal({ name, price, quantity });
    });
  }

  makeEmptyProduct({ name }) {
    return {
      name,
      hasMock: false,
      hasPromotion: false,
      withNormal: { price: null, quantity: null },
      withPromotion: { price: null, quantity: null, promotion: null },
    };
  }

  addPromotion({ name, price, quantity, promotion }) {
    const product = this.#productList.get(name);
    product.withPromotion = {
      price: Number(price),
      quantity: Number(quantity),
      promotion,
    };
    product.hasPromotion = true;
    product.hasMock = true;
  }

  addNormal({ name, price, quantity }) {
    const product = this.#productList.get(name);
    product.withNormal = { price: Number(price), quantity: Number(quantity) };
    product.hasMock = false;
  }

  printProductList() {
    return this.#productList;
  }
}