import { createFileRoute } from '@tanstack/react-router';
import { pageHead } from '@/lib/shop/api';
import { LoadingPage, ShopError, ShopNotFound } from '@/components/shop/shared';
import { CategoriesPage } from '@/components/shop/catalog';
import { productsQuery } from '@/lib/shop/api';
export const Route = createFileRoute('/categories.html')({
  ssr: false,
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  head: () => pageHead('Categories', 'Browse ShopEase products by category.'),
  component: CategoriesPage, pendingComponent: LoadingPage, errorComponent: ShopError, notFoundComponent: ShopNotFound,
});
