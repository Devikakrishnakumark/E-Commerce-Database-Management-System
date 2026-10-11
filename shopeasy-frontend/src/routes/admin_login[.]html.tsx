import { createFileRoute } from '@tanstack/react-router';
import { pageHead } from '@/lib/shop/api';
import { LoadingPage, ShopError, ShopNotFound } from '@/components/shop/shared';
import { AuthPage } from '@/components/shop/auth';
export const Route = createFileRoute('/admin_login.html')({ ssr: false, head: () => pageHead('Admin Login', 'Admin Login at ShopEase.'), component: () => <AuthPage mode="admin" /> });
