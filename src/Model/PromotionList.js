import { DateTimes } from '@woowacourse/mission-utils';

export default class PromotionList {
  #keyList;

  #promotionList;

  constructor(input) {
    const [keyList, ...metaDataList] = input;
    this.#keyList = keyList;
    this.#promotionList = new Map();
    this.#initialize(metaDataList);
  }

  #initialize(metaDataList) {
    metaDataList.forEach((metaData) => {
      const [name] = metaData;
      const promotion = this.makePromotion(metaData);
      this.#promotionList.set(name, promotion);
    });
  }

  makePromotion([name, buy, get, startDate, endDate]) {
    const promotion = {
      name,
      buy: Number(buy),
      get: Number(get),
      startDate,
      endDate,
    };
    return promotion;
  }

  getAllInformationOfPromotion(promotion) {
    return this.#promotionList.get(promotion);
  }

  compareTimesAboutPromotion(promotion) {
    const { startDate, endDate } = this.getAllInformationOfPromotion(promotion);
    const now = DateTimes.now();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  }

  calculateBuyAndGet(productCount, promotion) {
    const { buy, get } = this.getAllInformationOfPromotion(promotion);
    const promotionStats = this.makeObject();
    if (productCount < buy) {
      promotionStats.regularCount = productCount;
      return promotionStats;
    }
    while (productCount >= buy) {
      if (productCount >= buy + get) {
        const tmp = Math.floor(productCount / (buy + get));
        promotionStats.promoteCount = tmp * buy;
        promotionStats.freeCount = tmp * get;
        productCount -= promoteCount + freeCount;
      } else if (productCount >= buy) {
        promotionStats.canAddPromote += buy;
        promotionStats.canAddFree = get - (productCount - buy);
        productCount -= buy;
      }
    }

    return promotionStats;
  }

  makeObject() {
    return {
      promoteCount: 0,
      freeCount: 0,
      regularCount: 0,
      canAddPromote: 0,
      canAddFree: 0,
    };
  }

  getExtraFree(productCount, promotion) {
    const { buy, get } = this.getAllInformationOfPromotion(promotion);
    const remaining = buy - (productCount % (buy + get));
    if (remaining === 0) {
      return get;
    }
    return 0;
  }

  calculatePromotion(productCount, promotion) {
    const { buy, get } = this.getAllInformationOfPromotion(promotion);
    const promotionTimes = Math.floor(productCount / (buy + get));
    return {
      promotionPricePurchase: promotionTimes * buy,
      freePurchase: promotionTimes * get,
      regularPricePurchase: productCount - promotionTimes * (buy + get),
    };
  }
}
