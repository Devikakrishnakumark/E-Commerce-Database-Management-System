import { createFileRoute } from '@tanstack/react-router';
import { Reports } from '@/components/dashboard/other-pages';
export const Route = createFileRoute('/reports')({
 head: () => ({ meta: [{title:'Reports — ShopEase Admin'}, {name:'description',content:'Manage ShopEase reports with business insights and interactive sample records.'}, {property:'og:title',content:'Reports — ShopEase Admin'}, {property:'og:description',content:'Your ShopEase reports workspace.'}, {property:'og:type',content:'website'}, {name:'twitter:card',content:'summary_large_image'}] }),
 component: Reports,
});
