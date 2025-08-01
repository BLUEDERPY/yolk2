export const formatCurrency = (value: number): string => {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const nFormatter = (num: number, digits: number) => {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "B" },
    { value: 1e12, symbol: "G" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
  const item = lookup.findLast((item) => num >= item.value);
  return item
    ? (num / item.value).toFixed(digits).replace(regexp, "").concat(item.symbol)
    : num > 0.01 && digits >= 2
    ? num.toFixed(digits)
    : num > 0.001
    ? num.toFixed(4)
    : num > 0.0001
    ? num.toFixed(5)
    : num > 0.00001
    ? num.toFixed(6)
    : num > 0.000001
    ? num.toFixed(7)
    : num > 0.0000001
    ? num.toFixed(8)
    : num > 0.00000001
    ? num.toFixed(9)
    : num.toString();
};
