import { beforeEach, describe, expect, it, vi } from 'vitest';
import { addToCart, checkout, request, normalizeUser, isAdmin, cartTotal } from '@/lib/shop/api';

describe('ShopEasy API compatibility', () => {
  beforeEach(() => { vi.unstubAllGlobals(); });
  function mockApi() { const fetcher = vi.fn().mockResolvedValue(new Response('{}', { status: 200 })); vi.stubGlobal('fetch', fetcher); return fetcher; }
  it('sends the exact add-to-cart endpoint and payload', async () => {
    const fetcher = mockApi(); await addToCart({ productId: 3, quantity: 1 });
    expect(fetcher).toHaveBeenCalledWith('http://localhost:3000/api/cart', expect.objectContaining({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"productId":3,"quantity":1}' }));
  });
  it('sends only the contracted checkout payment method', async () => {
    const fetcher = mockApi(); await checkout({ paymentMethod: 'Credit Card' });
    expect(fetcher).toHaveBeenCalledWith('http://localhost:3000/api/checkout', expect.objectContaining({ method: 'POST', body: '{"paymentMethod":"Credit Card"}' }));
  });
  it.each(['/api/register', '/api/login', '/api/admin/login'])('preserves authentication endpoint %s', async endpoint => {
    const fetcher = mockApi(); const payload = endpoint === '/api/register' ? { name: 'Jane Doe', email: 'jane@example.com', password: 'example-password' } : { email: 'jane@example.com', password: 'example-password' };
    await request(endpoint, payload);
    expect(fetcher).toHaveBeenCalledWith(`http://localhost:3000${endpoint}`, expect.objectContaining({ method: 'POST', body: JSON.stringify(payload) }));
  });
  it('normalizes the provided customer_id response to the existing display object', () => {
    expect(normalizeUser({ customer_id: 4, name: 'Jane Doe' }, 'customer')).toEqual({ id: 4, name: 'Jane Doe', role: 'customer' });
  });
  it('allows only role admin to access the admin UI', () => {
    expect(isAdmin({ id: 1, name: 'Jane', role: 'customer' })).toBe(false);
    expect(isAdmin(null)).toBe(false);
    expect(isAdmin({ id: 1, name: 'Admin', role: 'admin' })).toBe(true);
  });
  it('computes the supplied cart total without introducing charges', () => {
    expect(cartTotal([{ product_id: 3, product_name: "Men's T-Shirt", price: '19.99', quantity: 2, total: '39.98' }])).toBe(39.98);
  });
  it('never reports failed writes as successful', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    await expect(addToCart({ productId: 3, quantity: 1 })).rejects.toThrow('unavailable');
  });
});