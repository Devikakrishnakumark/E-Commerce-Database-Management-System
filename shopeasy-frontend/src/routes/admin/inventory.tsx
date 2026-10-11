import { createFileRoute } from '@tanstack/react-router';
import { Inventory } from '@/components/dashboard/inventory';
export const Route = createFileRoute('/admin/inventory')({
 head: () => ({ meta: [{title:'Inventory — ShopEase Admin'}, {name:'description',content:'Manage ShopEase inventory with business insights and interactive sample records.'}, {property:'og:title',content:'Inventory — ShopEase Admin'}, {property:'og:description',content:'Your ShopEase inventory workspace.'}, {property:'og:type',content:'website'}, {name:'twitter:card',content:'summary_large_image'}] }),
 component: Inventory,
});
