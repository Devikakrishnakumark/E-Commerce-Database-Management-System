import { Link, useNavigate } from '@tanstack/react-router';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ArrowRight, Minus, Plus, Trash2, LockKeyhole, Check, Package, ChevronDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { amount, cartQuery, cartTotal, checkout, ordersQuery, request } from '@/lib/shop/api';
import type { CartItem, CheckoutPayload } from '@/lib/shop/models';
import { PageTitle, SampleNotice, EmptyState, ProductImage } from './shared';

export function CartPage() {
  const { data: result } = useSuspenseQuery(cartQuery);
  const [preview, setPreview] = useState<CartItem[] | null>(null);
  useEffect(() => { setPreview(null); }, [result]);
  const items = preview ?? result.data;
  function quantity(id: number, value: number) { setPreview(items.map(item => item.product_id === id ? { ...item, quantity: Math.max(1, value), total: String(Number(item.price) * Math.max(1, value)) } : item)); }
  return <div className="shop-container page-content"><PageTitle title="Shopping Cart" subtitle={`${items.reduce((total, item) => total + item.quantity, 0)} items in your cart`} action={<Button variant="outline" asChild><Link to="/products.html" search={{ q: '', category: '', max: '', sort: 'featured' }}>Continue shopping <ArrowRight /></Link></Button>} /><SampleNotice sample={result.sample} /><p className="preview-note">Quantity changes and removal are previews only; checkout uses your saved cart.</p>{items.length ? <div className="purchase-layout"><div className="cart-list"><div className="cart-table-heading"><span>Product</span><span>Quantity</span><span>Total</span><span /></div>{items.map(item => <div className="cart-row" key={item.product_id}><div className="cart-product"><ProductImage product={{ product_name: item.product_name, category_name: '' }} /><div><h3>{item.product_name}</h3><p>{amount(item.price)} each</p></div></div><div className="quantity-stepper"><Button variant="ghost" size="icon" aria-label={`Decrease ${item.product_name} quantity`} disabled={item.quantity === 1} onClick={() => quantity(item.product_id, item.quantity - 1)}><Minus /></Button><span>{item.quantity}</span><Button variant="ghost" size="icon" aria-label={`Increase ${item.product_name} quantity`} onClick={() => quantity(item.product_id, item.quantity + 1)}><Plus /></Button></div><strong>{amount(Number(item.price) * item.quantity)}</strong><Button variant="ghost" size="icon" aria-label={`Remove ${item.product_name}`} onClick={() => setPreview(items.filter(row => row.product_id !== item.product_id))}><Trash2 /></Button></div>)}</div><OrderSummary items={items}><Button asChild className="w-full" size="lg"><Link to="/checkout.html">Proceed to Checkout <ArrowRight /></Link></Button></OrderSummary></div> : <EmptyState title="Your cart is empty"><p>Find something you love and add it to your cart.</p></EmptyState>}</div>;
}
function OrderSummary({ items, children }: { items: CartItem[]; children?: import('react').ReactNode }) {
  return <aside className="order-summary"><h2>Order Summary</h2>{items.map(item => <div className="summary-item" key={item.product_id}><span>{item.product_name} <small>× {item.quantity}</small></span><strong>{amount(Number(item.price) * item.quantity)}</strong></div>)}<div className="summary-total"><span>Total</span><strong>{amount(cartTotal(items))}</strong></div>{children}<div className="secure-note"><LockKeyhole size={14} />Secure checkout</div></aside>;
}
export function CheckoutPage() {
  const { data: result } = useSuspenseQuery(cartQuery);
  const [paymentMethod, setPaymentMethod] = useState<CheckoutPayload['paymentMethod']>('Credit Card');
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const client = useQueryClient();
  const navigate = useNavigate();
  if (success) return <div className="shop-container page-content"><div className="empty-state order-success"><span className="success-icon"><Check /></span><h1>Order placed!</h1><p>Thank you for shopping with ShopEase.</p><Button onClick={() => void navigate({ to: '/orders.html' })}>View my orders <ArrowRight /></Button></div></div>;
  return <div className="shop-container page-content"><PageTitle title="Checkout" subtitle="One last step to your next favorite." /><SampleNotice sample={result.sample} />{result.data.length ? <form onSubmit={async e => {
    e.preventDefault(); setPending(true); setError('');
    try {
      const saved = await request<CartItem[]>('/api/cart');
      if (!saved.length) throw new Error('Your saved cart is empty. Add a product before placing an order.');
      await checkout({ paymentMethod });
      await client.invalidateQueries({ queryKey: ['cart'] });
      await client.invalidateQueries({ queryKey: ['orders'] });
      setSuccess(true);
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to place your order.'); }
    finally { setPending(false); }
  }} className="purchase-layout"><div className="checkout-form"><h2><span className="step-number">1</span>Shipping Details</h2><p className="preview-note">Shipping details are not saved by the current checkout API.</p><div className="form-grid"><label className="field">Full name<input name="name" autoComplete="name" required /></label><label className="field">Email address<input name="email" type="email" autoComplete="email" required /></label><label className="field full-field">Street address<input name="address" autoComplete="street-address" required /></label><label className="field">City<input name="city" autoComplete="address-level2" required /></label><label className="field">Postal code<input name="postal" autoComplete="postal-code" required /></label><label className="field full-field">Country<input name="country" autoComplete="country-name" required /></label></div><h2 className="payment-heading"><span className="step-number">2</span>Payment Method</h2><label className="field">Choose payment method<select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as CheckoutPayload['paymentMethod'])}>{['Credit Card', 'Debit Card', 'PayPal', 'Net Banking', 'Cash on Delivery'].map(method => <option key={method}>{method}</option>)}</select></label>{error && <p role="alert" className="form-error">{error}</p>}</div><OrderSummary items={result.data}><Button type="submit" className="w-full" size="lg" disabled={pending}>{pending ? <Loader2 className="animate-spin" /> : <LockKeyhole />}{pending ? 'Placing order…' : 'Place Order'}</Button><Button variant="link" asChild className="w-full"><Link to="/cart.html">Return to cart</Link></Button></OrderSummary></form> : <EmptyState title="Your cart is empty" />}</div>;
}
export function OrdersPage() {
  const { data: result } = useSuspenseQuery(ordersQuery);
  const [expanded, setExpanded] = useState<number | null>(null);
  return <div className="shop-container page-content"><PageTitle title="My Orders" subtitle="A little history of your favorites." /><SampleNotice sample={result.sample} />{result.data.length ? <div className="orders-list">{result.data.map(order => <article className="order-item" key={order.order_id}><div className="order-top"><div className="order-id"><Package /><div><h2>Order #{order.order_id}</h2><p>{new Date(order.order_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</p></div></div><span className={`status-badge ${order.status === 'Shipped' || order.status === 'Delivered' ? 'status-success' : ''}`}>{order.status}</span></div><div className="order-bottom"><p>{order.items}</p><strong>{amount(order.total_amount)}</strong><Button variant="outline" onClick={() => setExpanded(expanded === order.order_id ? null : order.order_id)}>{expanded === order.order_id ? 'Hide details' : 'View details'}<ChevronDown /></Button></div>{expanded === order.order_id && <div className="order-details"><h3>Items ordered</h3><ul>{order.items.split(',').map((item, i) => <li key={i}>{item.trim()}</li>)}</ul><p>Order status: {order.status}</p><p>Total: {amount(order.total_amount)}</p></div>}</article>)}</div> : <EmptyState title="No orders yet" />}</div>;
}
