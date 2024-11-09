export default class ProductList {
  #productList;

  #keyList;

  constructor(input) {
    const [keyList, ...metaDataList] = input;
    this.#keyList = keyList;
    this.#productList = new Map();
    this.#initialize(metaDataList);
    // this.toString();
  }

  #initialize(metaDataList) {
    const kinds = Array.from(new Set(metaDataList.map(([name]) => name)));
    for (let index = 0; index < kinds.length; index += 1) {
      const emptyProduct = this.makeEmptyProduct(kinds[index]);
      this.#productList.set(kinds[index], emptyProduct);
    }
    this.#setProductsWithProperty(metaDataList);
  }

  makeEmptyProduct(name) {
    const product = {
      name,
      price: null,
      withPromotion: { quantity: null, promotion: null },
      withNoPromotion: { quantity: null, promotion: null },
    };
    return product;
  }

  #setProductsWithProperty(metaDataList) {
    metaDataList.forEach(([name, price, quantity, promotion]) => {
      if (promotion === 'null') {
        this.setProductWithNoPromotion({ name, price, quantity, promotion });
        return;
      }
      this.setProductWithPromotion({ name, price, quantity, promotion });
    });
  }

  setProductWithPromotion({ name, price, quantity, promotion }) {
    const product = this.#productList.get(name);
    product.price = Number(price);
    product.withPromotion = { quantity: Number(quantity), promotion };
    if (product.withNoPromotion.quantity === null) {
      product.withNoPromotion.quantity = 0;
      product.withNoPromotion.promotion = 'null';
    }
  }

  setProductWithNoPromotion({ name, price, quantity, promotion }) {
    const product = this.#productList.get(name);
    product.price = Number(price);
    product.withNoPromotion = { quantity: Number(quantity), promotion };
  }

  toString() {
    console.log(this.#productList);
  }

  get KeyList() {
    return this.#keyList;
  }

  getProductInventory() {
    const inventoryList = [];
    Array.from(this.#productList.values()).forEach((value) => {
      const { name, price, withPromotion, withNoPromotion } = value;
      inventoryList.push({ name, price, ...withPromotion });
      inventoryList.push({ name, price, ...withNoPromotion });
    });
    return inventoryList;
  }
}

// const tmp = {
//   콜라: {
//     name: 콜라,
//     price: 1000,
//     withPromotion: {
//       quantity: 10,
//       promotion: '탄산2+1',
//     },
//     withNoPromotion: {
//       quantity: 10,
//       promotion: 'null',
//     },
//   },
//   사이다: {
//     name: 사이다,
//     price: 1000,
//     withPromotion: {
//       quantity: 8,
//       promotion: '탄산2+1',
//     },
//     withNoPromotion: {
//       quantity: 7,
//       promotion: 'null',
//     },
//   },
//   오렌지주스: {
//     name: 오렌지주스,
//     price: 1000,
//     withPromotion: {
//       quantity: 7,
//       promotion: 'MD추천상품',
//     },
//     withNoPromotion: {
//       quantity: 0,
//       promotion: 'null',
//     },
//   },
//   비타민워터: {
//     name: 비타민워터,
//     price: 1500,
//     withPromotion: {
//       quantity: null,
//       promotion: null,
//     },
//     withNoPromotion: {
//       quantity: 6,
//       promotion: 'null',
//     },
//   },
// };
