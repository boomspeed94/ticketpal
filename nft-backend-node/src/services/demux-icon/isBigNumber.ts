import BigNumber from 'bignumber.js';

export default function isBigNumber(value: any) {
  return BigNumber.isBigNumber(value);
}
