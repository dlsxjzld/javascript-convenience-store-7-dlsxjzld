export default class PromotionList {
  #key;

  #promotionList;

  constructor(promotionsInput) {
    const [key, ...promotionList] = promotionsInput
      .split('\n')
      .filter(Boolean)
      .map((row) => row.split(','));
    this.#key = key;
    this.#promotionList = new Map();
    this.init(promotionList);
  }

  init(promotionList) {
    for (let idx = 0; idx < promotionList.length; idx += 1) {
      const [name, buy, get, startDate, endDate] = promotionList[idx];
      this.#promotionList.set(
        name,
        this.makePromotion({ name, buy, get, startDate, endDate }),
      );
    }
  }

  makePromotion({ name, buy, get, startDate, endDate }) {
    return {
      name,
      buy: Number(buy),
      get: Number(get),
      startDate,
      endDate,
    };
  }

  getPromotionList() {
    return this.#promotionList;
  }

  getPromotionListForBuyList(buyList, buyListMetaData) {
    return buyList.map(([productName]) => {
      const { withPromotion } = buyListMetaData.find(
        ({ name }) => name === productName,
      );

      return this.getPromotionMetaData(withPromotion.promotion);
    });
  }

  getPromotionMetaData(promotionName) {
    if (promotionName === null) {
      return null;
    }
    return this.#promotionList.get(promotionName);
  }
}
