import { createFileRoute } from '@tanstack/react-router';
import { Categories } from '@/components/dashboard/other-pages';
export const Route = createFileRoute('/admin/categories')({
 head: () => ({ meta: [{title:'Categories — ShopEase Admin'}, {name:'description',content:'Manage ShopEase categories with business insights and interactive sample records.'}, {property:'og:title',content:'Categories — ShopEase Admin'}, {property:'og:description',content:'Your ShopEase categories workspace.'}, {property:'og:type',content:'website'}, {name:'twitter:card',content:'summary_large_image'}] }),
 component: Categories,
});
