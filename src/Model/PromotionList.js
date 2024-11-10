import { DateTimes } from '@woowacourse/mission-utils';

export default class PromotionList {
  #keyList;

  #promotionList;

  constructor(input) {
    const [keyList, ...metaDataList] = input;
    this.#keyList = keyList;
    this.#promotionList = new Map();
    this.#initialize(metaDataList);
    // this.toString();
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

  toString() {
    console.log(this.#promotionList);
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
}
