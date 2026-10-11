import { createContext, useContext, useState, type ReactNode } from 'react';
import { initialProducts, type Product } from '@/lib/dashboard-data';
const Store = createContext<{products: Product[]; setProducts: React.Dispatch<React.SetStateAction<Product[]>>; search: string; setSearch: (value:string)=>void} | null>(null);
export function DashboardProvider({children}:{children:ReactNode}) {
 const [products,setProducts]=useState(initialProducts); const [search,setSearch]=useState('');
 return <Store.Provider value={{products,setProducts,search,setSearch}}>{children}</Store.Provider>;
}
export function useDashboard(){ const value=useContext(Store); if(!value) throw new Error('Dashboard provider missing'); return value; }
