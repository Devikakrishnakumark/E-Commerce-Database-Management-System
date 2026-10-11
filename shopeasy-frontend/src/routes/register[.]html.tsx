import { createFileRoute } from '@tanstack/react-router';
import { pageHead } from '@/lib/shop/api';
import { LoadingPage, ShopError, ShopNotFound } from '@/components/shop/shared';
import { AuthPage } from '@/components/shop/auth';
export const Route = createFileRoute('/register.html')({ ssr: false, head: () => pageHead('Create Account', 'Create Account at ShopEase.'), component: () => <AuthPage mode="register" /> });
