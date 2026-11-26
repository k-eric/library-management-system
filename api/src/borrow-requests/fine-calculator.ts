const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function calculateFine(
  dueDate: Date | string,
  returnDate: Date | string,
  ratePerDay: number,
): number {
  if (ratePerDay <= 0) {
    return 0;
  }

  const due = new Date(dueDate).getTime();
  const returned = new Date(returnDate).getTime();

  if (Number.isNaN(due) || Number.isNaN(returned)) {
    throw new Error('Invalid dueDate or returnDate provided to calculateFine');
  }

  if (returned <= due) {
    return 0;
  }

  const daysLate = Math.ceil((returned - due) / MS_PER_DAY);
  return Number((daysLate * ratePerDay).toFixed(2));
}