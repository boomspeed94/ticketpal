const exchangeRate = 1.8;

const serviceFee = Number(process.env.SERVICE_FEE);

export const amountReceived = (amount: number): number => {
  return ((100 - serviceFee) * amount) / 100;
};
export const amountWithServiceFee = (amount: number): string => {
  return Number((serviceFee * amount) / 100 + amount).toFixed(2);
};

export const amountDollarWithServiceFee = (amount: number): string => {
  return Number(((serviceFee * amount) / 100 + amount) * exchangeRate).toFixed(2);
};
export const amountReceivedDollar = (amount: number): number => {
  return ((100 - serviceFee) * amount * exchangeRate) / 100;
};

export const amountDollar = (amount: number): number => {
  return amount * exchangeRate;
};
