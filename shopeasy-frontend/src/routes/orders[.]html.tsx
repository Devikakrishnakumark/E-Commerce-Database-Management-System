import { createFileRoute } from '@tanstack/react-router';
import { pageHead } from '@/lib/shop/api';
import { LoadingPage, ShopError, ShopNotFound } from '@/components/shop/shared';
import { OrdersPage } from '@/components/shop/purchase';
import { ordersQuery } from '@/lib/shop/api';
export const Route = createFileRoute('/orders.html')({
  ssr: false,
  loader: ({ context }) => context.queryClient.ensureQueryData(ordersQuery),
  head: () => pageHead('My Orders', 'Track and review your ShopEase orders.'),
  component: OrdersPage, pendingComponent: LoadingPage, errorComponent: ShopError, notFoundComponent: ShopNotFound,
});
