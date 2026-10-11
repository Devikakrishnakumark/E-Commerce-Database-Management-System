import { createFileRoute } from '@tanstack/react-router';
import { Overview } from '@/components/dashboard/overview';
export const Route = createFileRoute('/')({
 head: () => ({ meta: [{title:'Overview — ShopEase Admin'}, {name:'description',content:'ShopEase store overview, sales performance and recent orders.'}, {property:'og:title',content:'Overview — ShopEase Admin'}, {property:'og:description',content:'Your ShopEase business at a glance.'}, {property:'og:type',content:'website'}, {name:'twitter:card',content:'summary_large_image'}] }),
 component: Overview,
});
