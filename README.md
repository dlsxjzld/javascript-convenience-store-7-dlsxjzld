# javascript-convenience-store-precourse

## 구현할 기능 목록

구매자의 할인 혜택과 재고 상황을 고려하여 최종 결제 금액을 계산하고 안내하는 결제 시스템을 구현한다.

- 사용자가 입력한 상품의 가격과 수량을 기반으로 최종 결제 금액을 계산한다.
  - 총구매액은 상품별 가격과 수량을 곱하여 계산하며, 프로모션 및 멤버십 할인 정책을 반영하여 최종 결제 금액을 산출한다.
- 구매 내역과 산출한 금액 정보를 영수증으로 출력한다.
- 영수증 출력 후 추가 구매를 진행할지 또는 종료할지를 선택할 수 있다.

### **재고 관리**

- [ ] 각 상품의 재고 수량을 고려하여 결제 가능 여부를 확인한다.
- [ ] 고객이 상품을 구매할 때마다, 결제된 수량만큼 해당 상품의 재고에서 차감하여 수량을 관리한다.
- [ ] 재고를 차감함으로써 시스템은 최신 재고 상태를 유지하며, 다음 고객이 구매할 때 정확한 재고 정보를 제공한다.

### **프로모션 할인**

- [ ] 오늘 날짜가 프로모션 기간 내에 포함된 경우에만 할인을 적용한다.
- [ ] 프로모션은 N개 구매 시 1개 무료 증정(Buy N Get 1 Free)의 형태로 진행된다.
- [ ] 1+1 또는 2+1 프로모션이 각각 지정된 상품에 적용되며, 동일 상품에 여러 프로모션이 적용되지 않는다.
- [ ] 프로모션 혜택은 프로모션 재고 내에서만 적용할 수 있다.
- [ ] 프로모션 기간 중이라면 프로모션 재고를 우선적으로 차감하며, 프로모션 재고가 부족할 경우에는 일반 재고를 사용한다.
- [ ] 프로모션 적용이 가능한 상품에 대해 고객이 해당 수량보다 적게 가져온 경우, 필요한 수량을 추가로 가져오면 혜택을 받을 수 있음을 안내한다.
- [ ] 프로모션 재고가 부족하여 일부 수량을 프로모션 혜택 없이 결제해야 하는 경우, 일부 수량에 대해 정가로 결제하게 됨을 안내한다.

### **멤버십 할인**

- [ ] 멤버십 회원은 프로모션 미적용 금액의 30%를 할인받는다.
- [ ] 프로모션 적용 후 남은 금액에 대해 멤버십 할인을 적용한다.
- [ ] 멤버십 할인의 최대 한도는 8,000원이다.

### **영수증 출력**

- [ ] 영수증은 고객의 구매 내역과 할인을 요약하여 출력한다.
- [ ] 영수증 항목은 아래와 같다.
  - [ ] 구매 상품 내역: 구매한 상품명, 수량, 가격
  - [ ] 증정 상품 내역: 프로모션에 따라 무료로 제공된 증정 상품의 목록
  - [ ] 금액 정보
    - [ ] 총구매액: 구매한 상품의 총 수량과 총 금액
    - [ ] 행사할인: 프로모션에 의해 할인된 금액
    - [ ] 멤버십할인: 멤버십에 의해 추가로 할인된 금액
    - [ ] 내실돈: 최종 결제 금액
- [ ] 영수증의 구성 요소를 보기 좋게 정렬하여 고객이 쉽게 금액과 수량을 확인할 수 있게 한다.

### 입력

- [x] 상품 목록과 행사 목록을 파일 입출력을 통해 불러온다.

  - [x] `public/products.md`과 `public/promotions.md` 파일을 이용한다.
  - [ ] 두 파일 모두 내용의 형식을 유지한다면 값은 수정할 수 있다.
  - [x] 상품 목록 모델로 만들기
  - [x] 읽어왔을 때 promotion이 'null'이면 일반 상품
  - [x] promotion이 있으면 증정 상품
  - [x] 증정 상품 다음 줄에 일반 상품 순서임
  - [x] **증정 상품만 있으면 일반 상품은 재고 없음**으로 만들어두기
    - hasMock으로 구분
    - ex) 오렌지주스,1800,9,MD추천상품 → 오렌지주스 **일반 상품**은 재고 없음으로!

- [x] 구매할 상품과 수량을 입력 받는다. 상품명, 수량은 하이픈(-)으로, 개별 상품은 대괄호([])로 묶어 쉼표(,)로 구분한다.

  - [x] ex) `[콜라-10],[사이다-3]`

    - [x] 공백 포함시 에러
    - [x] `[` `]` 사이에 `상품-개수` 형식이 1개 있는지
    - [x] `[`와 `]` 와 `-` 의 개수가 일치하는지
    - [x] `,` 개수가 `[상품-개수]` 의 수 -1 인지
    - [x] 개수가 정수이고 0이상인지
    - [x] 상품이 존재하는지
    - [x] 개수가 재고 이하인지
    - [x] `[` 로 시작하는지
    - [x] `]` 로 끝나는지

- [ ] 프로모션 적용이 가능한 상품에 대해 고객이 해당 수량보다 적게 가져온 경우, 그 수량만큼 추가 여부를 입력받는다.
  - [ ] Y: 증정 받을 수 있는 상품을 추가한다.
  - [ ] N: 증정 받을 수 있는 상품을 추가하지 않는다.
- [ ] 프로모션 재고가 부족하여 일부 수량을 프로모션 혜택 없이 결제해야 하는 경우, 일부 수량에 대해 정가로 결제할지 여부를 입력받는다.
  - [ ] Y: 일부 수량에 대해 정가로 결제한다.
  - [ ] N: 정가로 결제해야하는 수량만큼 제외한 후 결제를 진행한다.
- [ ] 멤버십 할인 적용 여부를 입력 받는다.
  - [ ] Y: 멤버십 할인을 적용한다.
  - [ ] N: 멤버십 할인을 적용하지 않는다.
- [ ] 추가 구매 여부를 입력 받는다.
  - [ ] Y: 재고가 업데이트된 상품 목록을 확인 후 추가로 구매를 진행한다.
  - [ ] N: 구매를 종료한다.
- [x] 사용자가 잘못된 값을 입력할 경우 "[ERROR]"로 시작하는 메시지와 함께 Error를 발생시키고 해당 메시지를 출력한 다음 해당 지점부터 다시 입력을 받는다.

### **출력**

- [x] 환영 인사와 함께 상품명, 가격, 프로모션 이름, 재고를 안내한다. 만약 재고가 0개라면 `재고 없음`을 출력한다.
  - [x] 문서 참고
- [ ] 프로모션 적용이 가능한 상품에 대해 고객이 해당 수량만큼 가져오지 않았을 경우, 혜택에 대한 안내 메시지를 출력한다.
  - [ ] ex) `현재 {상품명}은(는) 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)`
- [ ] 프로모션 재고가 부족하여 일부 수량을 프로모션 혜택 없이 결제해야 하는 경우, 일부 수량에 대해 정가로 결제할지 여부에 대한 안내 메시지를 출력한다.
  - [ ] ex) `현재 {상품명} {수량}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)`
- [ ] 멤버십 할인 적용 여부를 확인하기 위해 안내 문구를 출력한다.
  - [ ] ex) `멤버십 할인을 받으시겠습니까? (Y/N)`
- [ ] 구매 상품 내역, 증정 상품 내역, 금액 정보를 출력한다.
  - [ ] 문서 참고
- [ ] 추가 구매 여부를 확인하기 위해 안내 문구를 출력한다.

  - [ ] ex) `감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)`

- [x] 사용자가 잘못된 값을 입력했을 때, "[ERROR]"로 시작하는 오류 메시지와 함께 상황에 맞는 안내를 출력한다.

  - [x] 구매할 상품과 수량 형식이 올바르지 않은 경우: `[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.`
  - [x] 존재하지 않는 상품을 입력한 경우: `[ERROR] 존재하지 않는 상품입니다. 다시 입력해 주세요.`
  - [x] 구매 수량이 재고 수량을 초과한 경우: `[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.`
  - [x] 기타 잘못된 입력의 경우: `[ERROR] 잘못된 입력입니다. 다시 입력해 주세요.`

## 문제 해결 과정

1. 구현할 기능 목록 정리
2. 입력 모듈 생성
   - 에러 발생시 재입력 받을 수 있게 하기
3. 검증 로직 생성
4. 예외 찾기 (입력, 검증, 구현 하면서 생기는 모든 경우)
5. 출력하기

## 어려웠던 점

1. day1 5시간
   검증에서 시간이 엄청 오래 걸렸음
   -> 검증은 매번 새롭게 만들어야 해서 그런 거 같음
   -> 기본적인 검증만 하고 기능 구현에 신경쓰고 완성 한 후에 검증을 추가적으로 해야할지?
   -> 제일 마지막에 예외사항을 찾고 검증을 하는 방향으로 하자
   -> 처음엔 기본적인 예외만 처리하자!
2. day2 5시간
