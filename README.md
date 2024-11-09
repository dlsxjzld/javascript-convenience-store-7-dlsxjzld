# javascript-convenience-store-precourse

# 구현 기능 목록

<aside>
💡

주어진 미션을 수행하기 위해 달성해야 할 기준과 목표가 담겨야 한다.
미션을 분석하면서 해결을 위해 필요하다고 생각되는 체크포인트를 작성한다.

</aside>

---

- [ ] 구현에 필요한 상품 목록과 행사 목록을 파일 입출력을 통해 불러온다.
  - `public/products.md`과 `public/promotions.md` 파일을 이용한다.
  - [ ] 상품 목록 모델로 만들기
    - [ ] 읽어왔을 때 promotion이 null이면 일반 상품
    - [ ] promotion이 있으면 증정 상품
    - [ ] 증정 상품 먼저 소진
    - [ ] 증정 상품 다음 줄에 일반 상품 순서임
    - [ ] **증정 상품만 있으면 일반 상품은 재고 없음**으로 만들어두기
      - ex) 오렌지주스,1800,9,MD추천상품 → 오렌지주스 **일반 상품**은 재고 없음으로!
  - [ ] 행사 목록 모델로 만들기
- [ ] 구매할 상품, 수량 입력 받기
  - [ ] 구매할 상품, 수량 검증 하기
    - [ ] 구매할 상품과 수량 형식이 올바르지 않은 경우: `[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.`
    - [ ] 존재하지 않는 상품을 입력한 경우: `[ERROR] 존재하지 않는 상품입니다. 다시 입력해 주세요.`
    - [ ] 구매 수량이 재고 수량을 초과한 경우: `[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.`
    - [ ] 기타 잘못된 입력의 경우: `[ERROR] 잘못된 입력입니다. 다시 입력해 주세요.`
    - [ ] 다시 입력 받기
  - [ ] 프로모션 적용이 가능한 상품에 대해 고객이 해당 수량만큼 가져오지 않았을 경우, 혜택에 대한 안내 메시지를 출력한다. (프로모션 재고가 있고, 고객이 프로모션 적용되는 수량보다 가져오지 않았을 때)
    - [ ] 프로모션 적용할지 여부(상태)
  - [ ] 프로모션 재고가 부족하여 일부 수량을 프로모션 혜택 없이 결제해야 하는 경우, 일부 수량에 대해 정가로 결제할지 여부에 대한 안내 메시지를 출력한다.(프로모션 재고 적용되는 만큼 적용시키고 나머지 남은 개수 ≤ 일반 상품 재고일 때, 나머지 남은 개수 정가 결제할지 여부)
    - [ ] 정가로 결제할지 여부 (상태)
  - [ ] 멤버십 할인 적용 여부를 확인하기 위해 안내 문구를 묻고 출력한다.
    - [ ] 멤버십 할인 적용 여부 (상태)
- [ ] 사용자가 입력한 상품의 가격과 수량을 기반으로 최종 결제 금액을 계산한다.
  - [ ] 총구매액은 상품별 가격과 수량을 곱하여 계산하며, 프로모션 및 멤버십 할인 정책을 반영하여 최종 결제 금액을 산출한다.
- [ ] 구매 내역과 산출한 금액 정보를 영수증으로 출력하기.
- [ ] 구매한 수량만큼 재고 감소하기.
- [ ] 영수증 출력 후 추가 구매를 진행할지 또는 종료할지를 선택 입력 받기.

# 문제 해결 과정

<aside>
💡

문제를 분석하고 설계하고 구현한 과정을 담아야한다.
**개발 과정과 생각의 흐름**을 이해할 수 있도록 작성해야 한다.
**실행 결과에 대한 기록**을 포함해야 한다.

</aside>

---

### 시나리오

1. [products.md](http://products.md) 와 [promotion.md](http://promotion.md) 읽어오기
   1. 상품 클래스
2. 안내 문구 및 재고 출력
3. 편의점 기능
   1. 구매할 상품과 수량을 입력 받는다. 상품명, 수량은 하이픈(-)으로, 개별 상품은 대괄호([])로 묶어 쉼표(,)로 구분한다.
   2. 프로모션 적용이 가능한 상품에 대해 고객이 해당 수량보다 적게 가져온 경우, 그 수량만큼 추가 여부를 입력받는다.
      - 프로모션 적용이 가능한 상품에 대해 고객이 해당 수량만큼 가져오지 않았을 경우, 혜택에 대한 안내 메시지를 출력한다.
      - Y: 증정 받을 수 있는 상품을 추가한다.
      - N: 증정 받을 수 있는 상품을 추가하지 않는다.
   3. 프로모션 재고가 부족하여 일부 수량을 프로모션 혜택 없이 결제해야 하는 경우, 일부 수량에 대해 정가로 결제할지 여부를 입력받는다.
      - 프로모션 재고가 부족하여 일부 수량을 프로모션 혜택 없이 결제해야 하는 경우, 일부 수량에 대해 정가로 결제할지 여부에 대한 안내 메시지를 출력한다.
      - Y: 일부 수량에 대해 정가로 결제한다.
      - N: 정가로 결제해야하는 수량만큼 제외한 후 결제를 진행한다.
   4. 멤버십 할인 적용 여부를 입력 받는다.
      1. 멤버십 할인 적용 여부를 확인하기 위해 안내 문구를 출력한다.
4. 출력
   1. 구매 상품 내역, 증정 상품 내역, 금액 정보를 출력한다.
5. [products.md](http://products.md) 에 재고 다시 반영
6. 추가 구매 여부를 입력 받는다.
   1. 추가 구매 여부를 확인하기 위해 안내 문구를 출력한다.
   2. Y → 1번부터 다시 시작
   3. N → 종료

# 신경 쓴 포인트

- 함수(또는 메서드)의 길이가 10라인을 넘어가지 않도록 구현한다.
  - 함수(또는 메서드)가 한 가지 일만 잘 하도록 구현한다.
- 입출력을 담당하는 클래스를 별도로 구현한다.
  - 아래 `InputView`, `OutputView` 클래스를 참고하여 입출력 클래스를 구현한다.
  - 클래스 이름, 메소드 반환 유형, 시그니처 등은 자유롭게 수정할 수 있다.
  ```jsx
  const InputView = {
    async readItem() {
      const input = await MissionUtils.Console.readLineAsync(
        '구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])',
      );
      // ...
    },
    // ...
  };
  ```
  ```jsx
  const OutputView = {
    printProducts() {
      MissionUtils.Console.print('- 콜라 1,000원 10개 탄산2+1');
      // ...
    },
    // ...
  };
  ```
- **비즈니스 로직과 UI 로직의 분리한다**
  - 비즈니스 로직과 UI 로직을 한 클래스에서 처리하는 것은 단일 책임 원칙(SRP)에 위배된다. 비즈니스 로직은 데이터 처리 및 도메인 규칙을 담당하고, UI 로직은 화면에 데이터를 표시하거나 입력을 받는 역할로 분리한다. 아래는 비즈니스 로직과 UI 로직이 혼재되어 있다.
    ```jsx
    class Lotto {
       #numbers

       // 로또 숫자가 포함되어 있는지 확인하는 비즈니스 로직
       contains(numbers) {
           ...
       }

       // UI 로직
       print() {
           ...
       }
    }

    ```
  - 비즈니스 로직은 그대로 유지하고, UI 관련 코드는 별도 View 클래스로 분리하는 것이 좋다. 현재 객체의 상태를 보기 위한 로그 메시지 성격이 강하다면, **toString()** 메서드를 통해 상태를 표현한다. 만약 UI에서 사용할 데이터가 필요하다면 getter 메서드를 통해 View 계층으로 데이터를 전달한다.
- **객체의 상태 접근을 제한한다**
  - 필드는 private class 필드로 구현한다. 객체의 상태를 외부에서 직접 접근하는 방식을 최소화 하는 이유에 대해서는 스스로 찾아본다.
- **객체는 객체답게 사용한다**
  - **Lotto**에서 데이터를 꺼내지(get) 말고 메시지를 던지도록 구조를 바꿔 데이터를 가지는 객체가 일하도록 한다. 이처럼 **Lotto** 객체에서 데이터를 꺼내(get) 사용하기보다는, 데이터가 가지고 있는 객체가 스스로 처리할 수 있도록 구조를 변경해야 한다. 아래와 같이 데이터를 외부에서 가져와(get) 처리하지 말고, 객체가 자신의 데이터를 스스로 처리하도록 메시지를 던지게 한다.
- 요구사항 철저히 확인
  - 예시까지 잘 확인하고 테스트 케이스 작성
- View: InputView, OutputView
- Model: 데이터를 다루는 클래스들
- Controller: 편의점 기능을 수행할 컨트롤러

# 참고 자료

<aside>
💡

미션을 해결하는 중에 **참고하거나 찾아본 자료**를 잊지 않도록 메모한다. (링크 등)

</aside>
