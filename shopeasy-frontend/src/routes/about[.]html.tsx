import { createFileRoute } from '@tanstack/react-router';
import { pageHead } from '@/lib/shop/api';
import { LoadingPage, ShopError, ShopNotFound } from '@/components/shop/shared';
import { AboutPage } from '@/components/shop/catalog';
export const Route = createFileRoute('/about.html')({
  ssr: false,
  head: () => pageHead('About ShopEase', 'Meet your everyday shopping destination.'),
  component: AboutPage, pendingComponent: LoadingPage, errorComponent: ShopError, notFoundComponent: ShopNotFound,
});
