/* eslint-disable func-names */
import BigNumber from 'bignumber.js';
import numeral from 'numeral';

// Output string of form xxx b or yyy k
// with only {digits} decimals
export function nFormatter(num: number, digits: number) {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0';
}

export const nDecimalFormat = (value: string, scale?: number) => {
  if (!value) {
    return value;
  }
  let result = value;
  if (scale) {
    result = fixed(value, scale);
  }
  const arr = result.toString().split('.');
  result = numeral(arr[0]).format('0,0');
  if (value.toString().includes('.')) {
    result += '.';
  }
  result += arr[1] ? `${arr[1]}` : '';
  return result;
};

export const fixed = (value: string, scale: number) => {
  const result = new BigNumber(value).toFixed(scale, BigNumber.ROUND_DOWN);
  return result;
};
