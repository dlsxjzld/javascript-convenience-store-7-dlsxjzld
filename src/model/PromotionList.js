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

  // name,buy,get,start_date,end_date
  // 탄산2+1,2,1,2024-01-01,2024-12-31
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
    // 콜라,2 오렌지주스,1 -> 2+1, md상품추천
    return buyList.map(([productName]) => {
      const { withPromotion } = buyListMetaData.find(
        ({ name }) => name === productName,
      );

      return this.getPromotionMetaData(withPromotion.promotion); // null, 'null', promotion
    });
  }

  getPromotionMetaData(promotionName) {
    if (promotionName === null) {
      return null;
    }
    return this.#promotionList.get(promotionName);
  }
}
