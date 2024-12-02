import { Console } from '@woowacourse/mission-utils';

export const toThrowNewError = (condition, errorMessage) => {
  if (condition) {
    throw new Error(`[ERROR] ${errorMessage}\n`);
  }
};

const hasEmptySpace = (input) => {
  toThrowNewError(
    input.includes(' '),
    '올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.',
  );
};

const canDivide = (input) => {
  const money = Number(input);
  toThrowNewError(
    money % 1000 !== 0,
    '1000원 단위로 입력해야 합니다. ex) 8000',
  );
};
const isExceedThousand = (input) => {
  const convertedInput = Number(input);
  toThrowNewError(
    convertedInput >= 1000 === false,
    '1000원 이상만 입력 가능합니다. ex) 1000',
  );
};

const isNumberType = (input) => {
  const number = Number(input);
  toThrowNewError(Number.isInteger(number) === false, '숫자만 입력해주세요.');
};

const DELIMITER = ',';
const RIGHT_WINNING_NUMBER_COUNT = 6;
const canSplit = (input) => {
  const winningNumbers = input.split(DELIMITER);
  toThrowNewError(
    winningNumbers.length !== RIGHT_WINNING_NUMBER_COUNT,
    '당첨 번호 6개를 입력해주세요. ex) 1,2,3,4,5,6',
  );
};

const isAllPositiveNumberType = (input) => {
  const numbers = input.split(DELIMITER).map(Number);
  toThrowNewError(
    numbers.some((number) => Number.isInteger(number) === false),
    '숫자만 입력해주세요. ex) 1,2,3,4,5,6',
  );
};

export const readItem = (input) => {
  hasEmptySpace(input);
};

export const check = (input, validate, rest) => {
  try {
    validate(input, rest);
    return true;
  } catch (error) {
    Console.print(error.message);
    return false;
  }
};
