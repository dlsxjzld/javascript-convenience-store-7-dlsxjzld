import { Console } from '@woowacourse/mission-utils';
import { InputView } from '../View/InputView.js';

export default class Receipt {
  #buyList;

  #productList;

  #promotionList;

  constructor(buyList, productList, promotionList) {
    this.#buyList = buyList;
    this.#productList = productList;
    this.#promotionList = promotionList;
    this.infos = [];
    this.initialize();
  }

  async run() {
    await this.spendInventory();
    const isMembership = await InputView.getMembership();

    this.printReceipt(isMembership);
    this.updateInventory();
  }

  updateInventory() {
    this.infos.forEach((info) => {
      this.#productList.updateProductInfo(info);
    });
  }

  initialize() {
    this.#buyList.forEach(([productName, productCount]) => {
      const { name, price, hasPromotion, withPromotion } = this.#productList.getAllInformationOfProduct(productName);
      const canBuyPromotion = this.canBuyPromotion(hasPromotion, withPromotion);
      this.makeInfos({ name, price, productCount, canBuyPromotion });
    });
  }

  makeInfos(info) {
    this.infos.push({
      ...info,
      productCount: Number(info.productCount),
      promotionPricePurchase: 0,
      freePurchase: 0,
      regularPricePurchase: 0,
    });
  }

  canBuyPromotion(hasPromotion, withPromotion) {
    if (!hasPromotion || !this.#promotionList.compareTimesAboutPromotion(withPromotion.promotion)) {
      return false;
    }

    return withPromotion.quantity > 0;
  }

  async spendInventory() {
    for (const [index, info] of this.infos.entries()) {
      if (info.canBuyPromotion) {
        await this.spendPromotionInventory(info, index);
      } else {
        this.spendNoPromotionInventory(info, index);
      }
    }
  }

  async wrapperNotExceedPromotion({ info, index, withPromotion, withNoPromotion }) {
    await this.notExceedPromotion({
      info,
      index,
      withPromotion,
      withNoPromotion,
    });
  }

  async spendPromotionInventory(info, index) {
    const { withPromotion, withNoPromotion } = this.getProductPromotionInfo(info.name);
    if (info.productCount <= withPromotion.quantity) {
      await this.wrapperNotExceedPromotion({ info, index, withPromotion, withNoPromotion });
    } else {
      await this.exceedPromotion(info, index, withPromotion);
    }
  }

  spendNoPromotionInventory(info, index) {
    this.infos[index].regularPricePurchase = info.productCount;
  }

  getProductPromotionInfo(productName) {
    const { withPromotion, withNoPromotion } = this.#productList.getAllInformationOfProduct(productName);
    return { withPromotion, withNoPromotion };
  }

  updateCurrentInfos(index, { promoteCount, freeCount, regularCount }) {
    this.infos[index].promotionPricePurchase = promoteCount;
    this.infos[index].freePurchase = freeCount;
    this.infos[index].regularPricePurchase = regularCount;
  }

  getCalculateBuyAndGet(productCount, promotion) {
    return this.#promotionList.calculateBuyAndGet(productCount, promotion);
  }

  async notExceedPromotion({ info, index, withPromotion, withNoPromotion }) {
    const { promoteCount, freeCount, regularCount, canAddPromote, canAddFree } = this.getCalculateBuyAndGet(
      info.productCount,
      withPromotion.promotion,
    );
    const initialCount = info.productCount;
    this.updateCurrentInfos(index, { promoteCount, freeCount, regularCount });
    this.infos[index].productCount = promoteCount + freeCount + regularCount;
    if (canAddPromote === 0 && canAddFree === 0) return;

    const tmp = await InputView.readAddPromotion(info.name, canAddFree);
    if (tmp === 'N') {
      this.infos[index].productCount += canAddPromote;
      this.infos[index].regularPricePurchase += canAddPromote;
      return;
    }
    if (withPromotion.quantity - initialCount >= canAddFree) {
      this.infos[index].freePurchase += canAddFree + regularCount;
      this.infos[index].promotionPricePurchase += canAddPromote;
      this.infos[index].regularPricePurchase = 0;
      this.infos[index].productCount += canAddFree + regularCount + canAddPromote;
      return;
    }

    const noPromotion = initialCount + canAddFree;
    if (noPromotion > withPromotion.quantity + withNoPromotion.quantity) {
      return;
    }
    const readAddRegular = await InputView.readAddRegular(info.name, noPromotion);
    if (readAddRegular === 'Y') {
      this.infos[index].regularPricePurchase = noPromotion;
      this.infos[index].productCount = noPromotion;
    } else {
      this.infos[index].regularPricePurchase = 0;
      this.infos[index].productCount = 0;
    }
  }

  async exceedPromotion(info, index, withPromotion) {
    const { promoteCount, freeCount, regularCount, canAddPromote, canAddFree } = this.#promotionList.calculateBuyAndGet(
      withPromotion.quantity,
      withPromotion.promotion,
    );
    this.updateCurrentInfos(index, { promoteCount, freeCount, regularCount });

    const noPromotion = regularCount + info.productCount - withPromotion.quantity;

    const tmp = await InputView.readAddRegular(info.name, noPromotion);
    if (tmp === 'Y') {
      this.infos[index].regularPricePurchase = noPromotion;
    } else {
      this.infos[index].regularPricePurchase = 0;
      this.infos[index].productCount -= noPromotion;
    }
  }

  printHead() {
    Console.print('==============W 편의점================');
    Console.print('상품명		          수량	      금액   ');
  }

  printReceipt(membership) {
    this.printHead();
    let totalCount = 0;
    let totalPrice = 0;
    let promotionDiscount = 0;
    let membershipDiscount = 0;
    this.infos.forEach(({ name, price, productCount }) => {
      totalCount += productCount;
      totalPrice += productCount * price;
      Console.print(`${name}  ${productCount} ${(price * productCount).toLocaleString()}`);
    });
    Console.print('=============증	    정===============');
    this.infos.forEach(({ name, price, productCount, regularPricePurchase, freePurchase }) => {
      if (freePurchase > 0) {
        promotionDiscount += freePurchase * price;
        Console.print(`${name}  ${freePurchase}`);
      }
      membershipDiscount += price * regularPricePurchase * 0.3;
    });
    Console.print('====================================');
    Console.print(`총구매액		    ${totalCount}	   ${totalPrice.toLocaleString()}`);
    Console.print(`행사할인		    -${promotionDiscount.toLocaleString()}`);
    if (membership === 'N') {
      Console.print(`멤버십할인		     -0`);
      Console.print(`내실돈		     ${(totalPrice - promotionDiscount).toLocaleString()}\n`);
      return;
    }

    if (membershipDiscount > 8000) {
      membershipDiscount = 8000;
    }
    Console.print(`멤버십할인		    -${membershipDiscount.toLocaleString()}`);
    Console.print(`내실돈		     ${(totalPrice - promotionDiscount - membershipDiscount).toLocaleString()}\n`);
  }
}
