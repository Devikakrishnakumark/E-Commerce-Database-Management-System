import { createFileRoute } from '@tanstack/react-router';
import { productsQuery, pageHead } from '@/lib/shop/api';
import { ProductsPage } from '@/components/shop/catalog';
import { LoadingPage, ShopError, ShopNotFound } from '@/components/shop/shared';
export const Route = createFileRoute('/products.html')({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({ q: typeof search['q'] === 'string' ? search['q'] : '', category: typeof search['category'] === 'string' ? search['category'] : '', max: typeof search['max'] === 'string' ? search['max'] : '', sort: typeof search['sort'] === 'string' && ['featured', 'low', 'high', 'name'].includes(search['sort']) ? search['sort'] : 'featured' }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  head: () => pageHead('Our Products', 'Shop electronics, clothing and more. Find your favorites at ShopEase.'),
  component: CatalogRoute, pendingComponent: LoadingPage, errorComponent: ShopError, notFoundComponent: ShopNotFound,
});
function CatalogRoute() { const search = Route.useSearch(); const navigate = Route.useNavigate(); return <ProductsPage search={search} change={next => { void navigate({ search: prev => ({ ...prev, ...next }), replace: true, resetScroll: false }); }} />; }
