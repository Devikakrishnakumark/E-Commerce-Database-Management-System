import { createFileRoute } from '@tanstack/react-router';
import { pageHead } from '@/lib/shop/api';
import { LoadingPage, ShopError, ShopNotFound } from '@/components/shop/shared';
import { AuthPage } from '@/components/shop/auth';
export const Route = createFileRoute('/login.html')({ ssr: false, head: () => pageHead('Login', 'Login at ShopEase.'), component: () => <AuthPage mode="login" /> });
