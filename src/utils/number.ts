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
  var item = lookup
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
  if (scale) {
    result += '.';
  }
  result += arr[1] ? `${arr[1]}` : '';
  return result;
};

/**
 * Inherit from nDecimalFormat;
 * Example: num = 11.22;
 * nDecimalFormat(num, 6) = 11.220000;
 * nDecimalFormatNoZero(num, 6) = 11.22;
 * @param value
 * @param scale
 * @param fixPrecision
 * @returns
 */
export const nDecimalFormatNoZero = (value: string, scale?: number, fixPrecision?: number) => {
  let result: any = nDecimalFormat('' + value, scale ?? 2);
  let temp: any = result.replaceAll(',', '');
  temp = '' + parseFloat(temp);
  temp = temp.split('.');
  temp = temp.length === 2 ? temp[1] : '';

  if (fixPrecision && temp.length < fixPrecision) {
    let len = fixPrecision - temp.length;
    for (let i = 0; i < len; i = i + 1) {
      temp = temp + '0';
    }
  }

  if (temp.length !== 0) {
    temp = '.' + temp;
  }

  let format = result.split('.')[0] + temp;
  return format;
};

export const nDecimalFormatHuman = (value: string, scale?: number, fixPrecision?: number) => {
  let num = Number(value);
  if (num > 1000) {
    return nFormatter(num, 3);
  } else {
    return nDecimalFormatNoZero(value, scale, fixPrecision);
  }
};

export const fixed = (value: string, scale: number) => {
  const result = new BigNumber(value).toFixed(scale, BigNumber.ROUND_DOWN);
  return result;
};
