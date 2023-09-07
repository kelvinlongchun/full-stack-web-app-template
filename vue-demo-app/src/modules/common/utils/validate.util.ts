type Input = string;

export interface InputConditions {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  containNumber?: boolean;
  containAlpha?: boolean;
  onlyNumber?: boolean;
  onlyAlpha?: boolean;
  onlyNumberOrAlpha?: boolean;
  min?: number;
  max?: number;
  isEmail?: boolean;
  isValidNumber?: boolean;
}

const KEYWORD_REGEXS: {
  [keyword in keyof InputConditions]: RegExp;
} = {
  containNumber: /\d/,
  containAlpha: /[A-Za-z]/,
  onlyNumber: /^\d+$/,
  onlyAlpha: /^[A-Za-z]+$/,
  onlyNumberOrAlpha: /^\w+$/,
  isEmail:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};

export function validate(input: Input, conditions: InputConditions) {
  const keywords = Object.keys(conditions) as Array<keyof InputConditions>;

  const isValid = keywords
    .map((keyword) => {
      const checker = keywordCheckers[keyword];
      const keywordValue = conditions[keyword];
      return checker(input, keywordValue);
    }) // Return all conditions checking result.
    .reduce((prev, current) => prev && current, true);

  const errorMessages = keywords
    .filter((keyword) => {
      const checker = keywordCheckers[keyword];
      const keywordValue = conditions[keyword];
      return !checker(input, keywordValue);
    }) // Return all invalid result.
    .map((keyword) => {
      const errorMessenger = keywordErrorMessengers[keyword];
      const keywordValue = conditions[keyword];
      return errorMessenger(keywordValue);
    }) // Return ErrorMessages.
    .filter((errorMessage) => errorMessage);

  return { isValid, errorMessages };
}

const keywordCheckers: {
  [keyword in Required<keyof InputConditions>]: (
    data: Input,
    keywordValue: InputConditions[keyof InputConditions]
  ) => boolean;
} = {
  required: (input, keywordValue) => {
    return keywordValue ? !!input : true;
  },
  minLength: (input, keywordValue) => {
    return input.toString().length >= (keywordValue as number);
  },
  maxLength: (input, keywordValue) => {
    return input.toString().length <= (keywordValue as number);
  },
  containNumber: (input, keywordValue) => {
    const regex = KEYWORD_REGEXS.containNumber as RegExp;
    return regex.test(input.toString()) === keywordValue;
  },
  containAlpha: (input, keywordValue) => {
    const regex = KEYWORD_REGEXS.containAlpha as RegExp;
    return regex.test(input.toString()) === keywordValue;
  },
  onlyNumber: (input, keywordValue) => {
    const regex = KEYWORD_REGEXS.onlyNumber as RegExp;
    return regex.test(input.toString()) === keywordValue;
  },
  onlyAlpha: (input, keywordValue) => {
    const regex = KEYWORD_REGEXS.onlyAlpha as RegExp;
    return regex.test(input.toString()) === keywordValue;
  },
  onlyNumberOrAlpha: (input, keywordValue) => {
    const regex = KEYWORD_REGEXS.onlyNumberOrAlpha as RegExp;
    return regex.test(input.toString()) === keywordValue;
  },
  min: (input, keywordValue) => {
    return Number(input) >= (keywordValue as number);
  },
  max: (input, keywordValue) => {
    return Number(input) <= (keywordValue as number);
  },
  isEmail: (input, keywordValue) => {
    const regex = KEYWORD_REGEXS.isEmail as RegExp;
    return regex.test(input.toString()) === keywordValue;
  },
  isValidNumber: (data, keywordValue) => {
    return isNaN(Number(data)) !== keywordValue;
  },
};

const keywordErrorMessengers: {
  [keyword in Required<keyof InputConditions>]: (
    keywordValue: InputConditions[keyof InputConditions]
  ) => string;
} = {
  required: () => "Input must not be empty.",
  minLength: (keywordValue) =>
    `Input length must be equal or more than ${keywordValue}.`,
  maxLength: (keywordValue) =>
    `Input length must be equal or less than ${keywordValue}.`,
  containNumber: (keywordValue) =>
    keywordValue
      ? "Input must contain at least 1 number."
      : "Input must not contain number.",
  containAlpha: (keywordValue) =>
    keywordValue
      ? "Input must contain at least 1 letter."
      : "Input must not contain letter",
  onlyNumber: (keywordValue) =>
    keywordValue
      ? "Input allows numbers only."
      : "Input must contain at least 1 non-number character.",
  onlyAlpha: (keywordValue) =>
    keywordValue
      ? "Input allows letters only."
      : "Input must contain at least 1 non-letter character.",
  onlyNumberOrAlpha: (keywordValue) =>
    keywordValue
      ? "Input allows numbers and letters only."
      : "Input must contain at least 1 non-number or non-letter character.",
  min: (keywordValue) => `Input value must be greater than ${keywordValue}.`,
  max: (keywordValue) => `Input value must be smailler than ${keywordValue}.`,
  isEmail: (keywordValue) =>
    keywordValue
      ? "Invalid email format."
      : "Input does not allow email format.",
  isValidNumber: (keywordValue) =>
    keywordValue
      ? "Invalid number format."
      : "Input does not allow number format.",
};
