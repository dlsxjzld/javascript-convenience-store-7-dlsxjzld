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
    // 2+1
    // { 이름: 콜라, 가격: 1000, 수량: 9,프로모션:6개, 증정: 3개, 정가구매:0개  }
    // { 이름: 콜라, 가격: 1000, 수량: 10,프로모션:6개, 증정: 3개, 정가구매:1개  }
  }
  /**
   * buyList에 각각의 원소마다 [상품, 개수]가 있다.
   * 0. initialize로 infos에 각각의 원소마다 이름, 가격, 수량, 프로모션, 증정, 정가구매 정보 초기화 O
   * // [{ 이름: 콜라, 가격: 1000, 수량: 9,프로모션:0, 증정: 0, 정가구매:0, canBuyPromotion: true },...]
   *
   * 프로모션 갖고 있는지 확인 해야함 O
   * 프로모션 날짜와 현재 날짜 비교 해야함 O
   * 프로모션 재고 있는지 확인해야함 O
   *
   * 이걸 가지고 forEach 돌면서 각 productList의 withPromotion과 withNoPromotion의 재고 비교
   * // 다 하고 나서의 결과는 다음과 같다.
   * // 2+1
   * // { 이름: 콜라, 가격: 1000, 수량: 9,프로모션:6개, 증정: 3개, 정가구매:0개  }
   * // { 이름: 콜라, 가격: 1000, 수량: 10,프로모션:6개, 증정: 3개, 정가구매:1개  }
   * 0. 프로모션 재고 살 수 있을 때 (canBuyPromotion: true)
   *    1. 수량이랑 프로덕트리스트의 프로모션 재고 비교
   *    1-1 수량 < 프로덕트리스트의 프로모션 재고
   *        - 프로모션 추가 구매할지 묻기
   *          - 추가 구매시 infos의 프로모션 개수 업데이트
   *          - 추가 구매시 infos의 수량 개수 업데이트
   *          - 추가 구매 X시 넘어가기
   *    1-2 수량 === 프로덕트리스트의 프로모션 재고
   *        - 넘어가기
   *    1-3 수량 > 프로덕트리스트의 프로모션 재고
   *        - 수량 - (buy+get)*N 만큼 적용 안되는 수량 있다고 말하기
   *          - Y 누르면
   *            - infos의 정가구매 개수 업데이트: (수량 - (buy+get)*N)
   *            - infos의 프로모션 개수 업데이트: (buy+get)*N
   *          - N 누르면
   *            - infos의 수량 개수 업데이트: (buy+get)*N
   *            - infos의 프로모션 개수 업데이트: (buy+get)*N
   *    2. 각 상품들의 최종 구매 결정 나오면 멤버십 할인 받을지 묻기
   *       - Y 누르면
   *         - 각 물품의 정가구매 만 다 더해서 여기에 * 0.7
   *         - 8000원 넘어가면 8000원으로 고정
   *       - X 누르면
   *         - 멤버십할인은 0 원
   * 1. 프로모션 재고 살 수 없을 때 (canBuyPromotion: false)
   *    1-1 일반 재고 소진
   */

  initialize() {
    this.#buyList.forEach(([productName, productCount]) => {
      const { name, price, hasPromotion, withPromotion } =
        this.#productList.getAllInforMationOfProduct(productName);
      const canBuyPromotion = this.canBuyPromotion(hasPromotion, withPromotion);
      this.makeInfos({ name, price, productCount, canBuyPromotion });
    });
  }

  makeInfos(info) {
    this.infos.push({
      ...info,
      promotionPricePurchase: 0, // 프로모션 개수
      freePurchase: 0, // 증정 개수
      regularPricePurchase: 0, // 정가구매 개수
    });
  }

  canBuyPromotion(hasPromotion, withPromotion) {
    if (
      !hasPromotion ||
      !this.#promotionList.compareTimesAboutPromotion(withPromotion.promotion)
    ) {
      return false;
    }

    return withPromotion.quantity > 0;
  }

  /**
   * info : 
   * {
        name,
        price,
        productCount,
        canBuyPromotion, // 프로모션 존재 && 프로모션 날짜 됨 && 프로모션 재고 남았음
        promotionPricePurchase, // 프로모션 개수
        freePurchase, // 증정 개수
        regularPricePurchase, // 정가구매 개수
      }
   */

  재고비교하기() {
    this.infos.forEach((info) => {
      if (info.canBuyPromotion) {
        this.프로모션재고소진();
        return;
      }
      this.일반재고소진();
    });
  }

  프로모션추가구매할지() {}

  프로모션재고소진() {}

  일반재고소진() {}

  증정구하기() {}

  // 구매 영수증 출력
  // 상품명, 수량, 금액
  // 증정
  // 총구매액
  // 행사할인 ( 프로모션 )
  // 멤버십 할인 ( 프로모션 적용 안된 상품에만 30%)
  // 내실돈
}
