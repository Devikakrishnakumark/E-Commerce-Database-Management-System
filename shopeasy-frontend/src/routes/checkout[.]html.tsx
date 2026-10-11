import { createFileRoute } from '@tanstack/react-router';
import { pageHead } from '@/lib/shop/api';
import { LoadingPage, ShopError, ShopNotFound } from '@/components/shop/shared';
import { CheckoutPage } from '@/components/shop/purchase';
import { cartQuery } from '@/lib/shop/api';
export const Route = createFileRoute('/checkout.html')({
  ssr: false,
  loader: ({ context }) => context.queryClient.ensureQueryData(cartQuery),
  head: () => pageHead('Checkout', 'Complete your ShopEase order.'),
  component: CheckoutPage, pendingComponent: LoadingPage, errorComponent: ShopError, notFoundComponent: ShopNotFound,
});
