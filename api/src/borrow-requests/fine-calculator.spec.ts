import { calculateFine } from './fine-calculator';

describe('calculateFine', () => {
  it('returns 0 when returned on or before the due date', () => {
    const dueDate = new Date('2026-12-10T00:00:00.000Z');
    const onTimeReturn = new Date('2026-12-10T00:00:00.000Z');
    const earlyReturn = new Date('2026-12-08T00:00:00.000Z');

    expect(calculateFine(dueDate, onTimeReturn, 2)).toBe(0);
    expect(calculateFine(dueDate, earlyReturn, 2)).toBe(0);
  });

  it('calculates the fine accurately when returned late', () => {
    const dueDate = new Date('2026-12-01T00:00:00.000Z');
    const lateReturn = new Date('2026-12-04T00:00:00.000Z');

    expect(calculateFine(dueDate, lateReturn, 1.5)).toBe(4.5);
  });
});