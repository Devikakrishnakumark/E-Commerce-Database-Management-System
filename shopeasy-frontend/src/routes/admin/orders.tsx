import { createFileRoute } from '@tanstack/react-router';
import { Orders } from '@/components/dashboard/other-pages';
export const Route = createFileRoute('/admin/orders')({
 head: () => ({ meta: [{title:'Orders — ShopEase Admin'}, {name:'description',content:'Manage ShopEase orders with business insights and interactive sample records.'}, {property:'og:title',content:'Orders — ShopEase Admin'}, {property:'og:description',content:'Your ShopEase orders workspace.'}, {property:'og:type',content:'website'}, {name:'twitter:card',content:'summary_large_image'}] }),
 component: Orders,
});
