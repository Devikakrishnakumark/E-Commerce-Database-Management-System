import { createFileRoute } from '@tanstack/react-router';
import { Customers } from '@/components/dashboard/other-pages';
export const Route = createFileRoute('/customers')({
 head: () => ({ meta: [{title:'Customers — ShopEase Admin'}, {name:'description',content:'Manage ShopEase customers with business insights and interactive sample records.'}, {property:'og:title',content:'Customers — ShopEase Admin'}, {property:'og:description',content:'Your ShopEase customers workspace.'}, {property:'og:type',content:'website'}, {name:'twitter:card',content:'summary_large_image'}] }),
 component: Customers,
});
