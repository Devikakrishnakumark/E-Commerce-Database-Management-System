import { createFileRoute } from '@tanstack/react-router';
import { featuredQuery, productsQuery, pageHead } from '@/lib/shop/api';
import { HomePage } from '@/components/shop/catalog';
import { LoadingPage, ShopError, ShopNotFound } from '@/components/shop/shared';
export const Route = createFileRoute('/')({
  ssr: false,
  loader: async ({ context }) => { await Promise.all([context.queryClient.ensureQueryData(featuredQuery), context.queryClient.ensureQueryData(productsQuery)]); },
  head: () => pageHead('Shop the Best Products Online', 'Discover electronics, clothing and everyday favorites at ShopEase.'),
  component: HomePage, pendingComponent: LoadingPage, errorComponent: ShopError, notFoundComponent: ShopNotFound,
});
