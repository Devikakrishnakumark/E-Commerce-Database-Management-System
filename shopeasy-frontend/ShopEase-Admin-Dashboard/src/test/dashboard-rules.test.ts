import { describe, expect, it } from 'vitest';
import { formatINR } from '@/lib/dashboard-data';
describe('Indian currency formatting', () => {
 it('formats ₹2,50,000 with Indian digit grouping', () => { expect(formatINR(250000)).toBe('₹2,50,000'); });
 it('uses rupees for a product price', () => { expect(formatINR(2499)).toBe('₹2,499'); });
});
