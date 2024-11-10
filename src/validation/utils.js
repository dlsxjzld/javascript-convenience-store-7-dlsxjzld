import { Console } from '@woowacourse/mission-utils';

const toThrowNewError = (condition, errorMessage) => {
  if (condition) {
    throw new Error(`[ERROR] ${errorMessage}\n`);
  }
};

const getCharCount = (char, input) => {
  let count = 0;
  for (let index = 0; index < input.length; index += 1) {
    if (input[index] === char) {
      count += 1;
    }
  }
  return count;
};

const doesSquareBracketCountsMatch = (input) => {
  const firstSquareBracketCount = getCharCount('[', input);
  const secondSquareBracketCount = getCharCount(']', input);
  toThrowNewError(
    firstSquareBracketCount !== secondSquareBracketCount,
    '잘못된 입력입니다. 다시 입력해 주세요.',
  );
};

const doesDashCountsMatch = (input) => {
  const firstSquareBracketCount = getCharCount('[', input);
  const dashCount = getCharCount('-', input);
  toThrowNewError(
    firstSquareBracketCount !== dashCount,
    '잘못된 입력입니다. 다시 입력해 주세요.',
  );
};

const doesCommaCountsMatch = (input) => {
  const commaCount = getCharCount(',', input);
  const dashCount = getCharCount('-', input);
  toThrowNewError(
    commaCount !== dashCount - 1,
    '잘못된 입력입니다. 다시 입력해 주세요.',
  );
};

const isAllNumber = (input) => {
  toThrowNewError(
    !input.every((value) => Number.isInteger(value)),
    '올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.',
  );
};

const isAllPositive = (input) => {
  toThrowNewError(
    !input.every((value) => value > 0),
    '올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.',
  );
};

const splitInput = (input) => input.slice(1, -1).split('-');
const isAllStartWithSquareBrackets = (input) => {
  toThrowNewError(
    !input.every((value) => value.startsWith('[')),
    '올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.',
  );
};
const isAllEndWithSquareBrackets = (input) => {
  toThrowNewError(
    !input.every((value) => value.endsWith(']')),
    '올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.',
  );
};

const isCorrectFormAfterSplit = (input) => {
  const counts = input.split(',').map((row) => Number(splitInput(row)[1]));

  isAllNumber(counts);
  isAllPositive(counts);

  const productForm = input.split(',');
  isAllStartWithSquareBrackets(productForm);
  isAllEndWithSquareBrackets(productForm);
};

const hasProduct = (input, kindsOfProductList) => {
  const productNames = input.split(',').map((row) => splitInput(row)[0]);

  toThrowNewError(
    !productNames.every((productName) =>
      kindsOfProductList.includes(productName),
    ),
    '존재하지 않는 상품입니다. 다시 입력해 주세요.',
  );
};

const getCount = (productName, productList) => {
  const { hasPromotion, withNoPromotion, withPromotion } =
    productList.getInventoryOfProduct(productName);
  let count = 0;
  if (hasPromotion) {
    count += withPromotion.quantity;
  }
  count += withNoPromotion.quantity;
  return count;
};

const doesProductCanSell = (input, productList) => {
  const productsWithCount = input.split(',').map((row) => splitInput(row));
  toThrowNewError(
    !productsWithCount.every(
      ([productName, productCount]) =>
        Number(productCount) <= getCount(productName, productList),
    ),
    '재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.',
  );
};

const checkBuyInput = (buyInput, productList) => {
  doesSquareBracketCountsMatch(buyInput);
  doesDashCountsMatch(buyInput);
  doesCommaCountsMatch(buyInput);
  isCorrectFormAfterSplit(buyInput);
  hasProduct(buyInput, productList.getKindsOfProductList());
  doesProductCanSell(buyInput, productList);
};

export const validateBuyInput = (buyInput, productList) => {
  try {
    checkBuyInput(buyInput, productList);
    return true;
  } catch (error) {
    Console.print(error.message);
    return false;
  }
};
