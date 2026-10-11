import { queryOptions } from '@tanstack/react-query';
import type { Product, CartItem, Order, User, AddToCartPayload, CheckoutPayload } from './models';
import samples from './mock-data.json';

export const API_BASE = (import.meta.env['VITE_API_BASE_URL'] || 'http://localhost:3000').replace(/\/$/, '');
export type ReadResult<T> = { data: T; sample: boolean };

export async function request<T>(path: string, payload?: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method: payload === undefined ? 'GET' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      ...(payload === undefined ? {} : { body: JSON.stringify(payload) }),
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    throw new Error('Your shop API is unavailable. Please check that your existing server is running and allows this website.');
  }
  const text = await response.text();
  let result: unknown;
  try { result = text ? JSON.parse(text) : {}; } catch { throw new Error('Your shop API returned an invalid response.'); }
  if (!response.ok) {
    const body = result as { message?: string; error?: string };
    throw new Error(body.message || body.error || `Request failed (${response.status}).`);
  }
  return result as T;
}

async function read<T>(path: string, fallback: T): Promise<ReadResult<T>> {
  try { return { data: await request<T>(path), sample: false }; }
  catch { return { data: fallback, sample: true }; }
}
export const productsQuery = queryOptions({ queryKey: ['products'], queryFn: () => read<Product[]>('/api/products', samples.products), staleTime: 30_000 });
export const featuredQuery = queryOptions({ queryKey: ['featured'], queryFn: () => read<Product[]>('/api/products/top-selling', samples.products), staleTime: 30_000 });
export const cartQuery = queryOptions({ queryKey: ['cart'], queryFn: () => read<CartItem[]>('/api/cart', samples.cart), staleTime: 0 });
export const ordersQuery = queryOptions({ queryKey: ['orders'], queryFn: () => read<Order[]>('/api/orders', samples.orders as Order[]), staleTime: 0 });
export const addToCart = (payload: AddToCartPayload) => request('/api/cart', payload);
export const checkout = (payload: CheckoutPayload) => request<{ message?: string; order_id?: number }>('/api/checkout', payload);

export function normalizeUser(value: unknown, role: 'customer' | 'admin'): User {
  if (!value || typeof value !== 'object') throw new Error('The login response did not include a user.');
  const row = value as Record<string, unknown>;
  const id = row['id'] ?? row['customer_id'] ?? row['admin_id'];
  if (typeof id !== 'number' || typeof row['name'] !== 'string') throw new Error('The login response must include a user ID and name.');
  return { id, name: row['name'], role: row['role'] === 'admin' ? 'admin' : role };
}
export function storedUser(): User | null {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const user = JSON.parse(raw) as User;
    return typeof user.id === 'number' && typeof user.name === 'string' ? user : null;
  } catch { return null; }
}
export const isAdmin = (user: User | null) => user?.role === 'admin';
export const amount = (value: string | number) => Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const cartTotal = (items: CartItem[]) => items.reduce((total, item) => total + Number(item.price) * item.quantity, 0);
export function pageHead(title: string, description: string) {
  return { meta: [{ title: `${title} — ShopEase` }, { name: 'description', content: description }, { property: 'og:title', content: `${title} — ShopEase` }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] };
}