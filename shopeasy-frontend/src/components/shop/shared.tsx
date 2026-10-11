import { Link, useRouter } from '@tanstack/react-router';
import { useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ShoppingBag, ShoppingCart, ArrowRight, Package, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { addToCart, amount } from '@/lib/shop/api';
import type { Product } from '@/lib/shop/models';
import smartphone from '@/assets/smartphone.jpg';
import tshirt from '@/assets/tshirt.jpg';

export function ProductImage({ product, className = '' }: { product: Pick<Product, 'product_name' | 'category_name'>; className?: string }) {
  const name = product.product_name.toLowerCase();
  const source = name.includes('smartphone') ? smartphone : name.includes('t-shirt') ? tshirt : null;
  return source ? <img src={source} alt={product.product_name} width={816} height={816} loading="lazy" className={`product-image ${className}`} /> : <div className={`product-placeholder ${className}`}><Package aria-label={product.product_name} /></div>;
}
export function SampleNotice({ sample }: { sample: boolean }) {
  if (!sample) return null;
  return <div className="sample-notice" role="status"><AlertCircle size={16} /><span>API unavailable · Showing your sample data</span></div>;
}
export function PageTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return <div className="page-title"><div><div className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>{title}</span></div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{action}</div>;
}
export function AddButton({ product }: { product: Product }) {
  const [pending, setPending] = useState(false);
  const client = useQueryClient();
  return <Button className="add-button" disabled={pending || product.stock_quantity <= 0} onClick={async () => {
    setPending(true);
    try { await addToCart({ productId: product.product_id, quantity: 1 }); await client.invalidateQueries({ queryKey: ['cart'] }); toast.success(`${product.product_name} added to your cart`); }
    catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to add to cart.'); }
    finally { setPending(false); }
  }}>{pending ? <Loader2 className="animate-spin" /> : <ShoppingCart />}{product.stock_quantity <= 0 ? 'Out of stock' : 'Add to Cart'}</Button>;
}
export function ProductCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  const [open, setOpen] = useState(false);
  return <article className="product-card">
    <div className="product-media">{featured && <span className="product-badge">FEATURED</span>}<Button variant="ghost" className="product-image-button" aria-label={`View ${product.product_name}`} onClick={() => setOpen(true)}><ProductImage product={product} /></Button></div>
    <div className="product-info"><span className="eyebrow">{product.category_name}</span><Button variant="link" className="product-name" onClick={() => setOpen(true)}>{product.product_name}</Button><p>{product.description}</p><div className="price-line"><strong>{amount(product.price)}</strong><span className="stock-label"><span />{product.stock_quantity > 0 ? 'In stock' : 'Sold out'}</span></div><AddButton product={product} /></div>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="product-dialog"><ProductImage product={product} /><DialogTitle>{product.product_name}</DialogTitle><DialogDescription>{product.description}</DialogDescription><div className="price-line"><strong>{amount(product.price)}</strong><span>{product.stock_quantity} available</span></div><AddButton product={product} /></DialogContent></Dialog>
  </article>;
}
export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return <div className="empty-state"><ShoppingBag /><h2>{title}</h2>{children}<Button asChild><Link to="/products.html" search={{ q: '', category: '', max: '', sort: 'featured' }}>Browse products <ArrowRight /></Link></Button></div>;
}
export function LoadingPage() { return <div className="loading-page"><Loader2 className="animate-spin" /><span>Loading your shop…</span></div>; }
export function ShopError({ error }: { error: unknown }) { const router = useRouter(); return <div className="empty-state" role="alert"><AlertCircle /><h2>Unable to load this page</h2><p>{error instanceof Error ? error.message : "An unexpected error occurred."}</p><Button onClick={() => void router.invalidate()}>Try again</Button></div>; }
export function ShopNotFound() { return <EmptyState title="Page not found" />; }