export const addMonths = (date: Date, months: number): Date => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

export const addQuarters = (date: Date, quarters: number): Date => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + (quarters * 3));
  return d;
};
