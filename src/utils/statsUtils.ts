export const normalizePercentage = (value: number): string => {
  const per = Number.isNaN(value) ? 0 : (value * 100).toFixed(1);
  return per + "%";
};
