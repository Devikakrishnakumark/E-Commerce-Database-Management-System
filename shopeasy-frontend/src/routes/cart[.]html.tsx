import { createFileRoute } from '@tanstack/react-router';
import { pageHead } from '@/lib/shop/api';
import { LoadingPage, ShopError, ShopNotFound } from '@/components/shop/shared';
import { CartPage } from '@/components/shop/purchase';
import { cartQuery } from '@/lib/shop/api';
export const Route = createFileRoute('/cart.html')({
  ssr: false,
  loader: ({ context }) => context.queryClient.ensureQueryData(cartQuery),
  head: () => pageHead('Shopping Cart', 'Review your ShopEase cart before checkout.'),
  component: CartPage, pendingComponent: LoadingPage, errorComponent: ShopError, notFoundComponent: ShopNotFound,
});
