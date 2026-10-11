import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { formatINR, type Product } from '@/lib/dashboard-data';
import { API_BASE } from '@/lib/shop/api';

export type Category = {
  id: number;
  name: string;
  emoji: string;
  description: string;
  product_count: number;
  total_stock: number;
};

export type AdminOrder = {
  order_id: number;
  customer_name: string;
  order_date: string;
  total_amount: number;
  status: string;
  items: string;
};

export type AdminCustomer = {
  id: number;
  name: string;
  email: string;
  city: string;
  orders: number;
  spent: number;
  initials: string;
};

export type AdminStats = {
  total_products: number;
  total_orders: number;
  total_revenue: number;
  total_customers: number;
};

const categoryEmojis: Record<string, string> = {
  'Electronics': '🎧',
  'Clothing': '👕',
  'Home & Kitchen': '☕',
  'Home & Living': '☕',
  'Books': '📚',
  'Sports': '⚽',
  'Accessories': '🎒',
  'Footwear': '👟',
};

const categoryDescriptions: Record<string, string> = {
  'Electronics': 'Everyday tech, extraordinary possibilities',
  'Clothing': 'Comfort and style for every day',
  'Home & Kitchen': 'Thoughtful essentials for your kitchen and space',
  'Home & Living': 'Thoughtful essentials for your space',
  'Books': 'Stories and knowledge for curious minds',
  'Sports': 'Gear and activewear for everyday athletes',
  'Accessories': 'The details that make a difference',
  'Footwear': 'A better step, wherever you go',
};

interface DashboardContextType {
  products: Product[];
  categories: Category[];
  orders: AdminOrder[];
  customers: AdminCustomer[];
  stats: AdminStats | null;
  search: string;
  setSearch: (value: string) => void;
  isLoading: boolean;
  refresh: () => Promise<void>;
  addProduct: (data: { name: string; price: number; stock: number; category_id?: number; description?: string }) => Promise<boolean>;
  updateProduct: (id: number, data: { name: string; price: number; stock: number; category_id?: number; description?: string }) => Promise<boolean>;
  deleteProduct: (id: number) => Promise<boolean>;
}

const Store = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    try {
      setIsLoading(true);

      const [prodRes, catRes, ordRes, custRes, statRes] = await Promise.allSettled([
        fetch(`${API_BASE}/api/products`).then((r) => (r.ok ? r.json() : [])),
        fetch(`${API_BASE}/api/categories`).then((r) => (r.ok ? r.json() : [])),
        fetch(`${API_BASE}/api/admin/orders`).then((r) => (r.ok ? r.json() : [])),
        fetch(`${API_BASE}/api/admin/customers`).then((r) => (r.ok ? r.json() : [])),
        fetch(`${API_BASE}/api/admin/stats`).then((r) => (r.ok ? r.json() : null)),
      ]);

      if (prodRes.status === 'fulfilled' && Array.isArray(prodRes.value)) {
        const mappedProducts: Product[] = prodRes.value.map((p: any) => ({
          id: p.product_id,
          name: p.product_name,
          sku: `PRD-00${p.product_id}`,
          category: p.category_name || 'General',
          price: parseFloat(p.price) || 0,
          stock: parseInt(p.stock_quantity, 10) || 0,
          emoji: categoryEmojis[p.category_name] || '📦',
        }));
        setProducts(mappedProducts);
      }

      if (catRes.status === 'fulfilled' && Array.isArray(catRes.value)) {
        const mappedCats: Category[] = catRes.value.map((c: any) => ({
          id: c.id,
          name: c.name,
          emoji: categoryEmojis[c.name] || '📁',
          description: categoryDescriptions[c.name] || 'Products in this collection',
          product_count: c.product_count || 0,
          total_stock: c.total_stock || 0,
        }));
        setCategories(mappedCats);
      }

      if (ordRes.status === 'fulfilled' && Array.isArray(ordRes.value)) {
        const mappedOrders: AdminOrder[] = ordRes.value.map((o: any) => ({
          order_id: o.order_id,
          customer_name: o.customer_name || 'Customer',
          order_date: o.order_date,
          total_amount: parseFloat(o.total_amount) || 0,
          status: o.status || 'Pending',
          items: o.items || 'Products',
        }));
        setOrders(mappedOrders);
      }

      if (custRes.status === 'fulfilled' && Array.isArray(custRes.value)) {
        const mappedCusts: AdminCustomer[] = custRes.value.map((c: any) => {
          const initials = c.name
            ? c.name
                .split(' ')
                .map((n: string) => n[0])
                .join('')
                .toUpperCase()
                .substring(0, 2)
            : 'CU';
          return {
            id: c.id,
            name: c.name,
            email: c.email,
            city: c.city || 'Not specified',
            orders: c.orders || 0,
            spent: parseFloat(c.spent) || 0,
            initials,
          };
        });
        setCustomers(mappedCusts);
      }

      if (statRes.status === 'fulfilled' && statRes.value) {
        setStats(statRes.value);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const addProduct = async (data: { name: string; price: number; stock: number; category_id?: number; description?: string }) => {
    try {
      const res = await fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create product');
      await fetchAllData();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const updateProduct = async (id: number, data: { name: string; price: number; stock: number; category_id?: number; description?: string }) => {
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update product');
      await fetchAllData();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete product');
      await fetchAllData();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  return (
    <Store.Provider
      value={{
        products,
        categories,
        orders,
        customers,
        stats,
        search,
        setSearch,
        isLoading,
        refresh: fetchAllData,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </Store.Provider>
  );
}

export function useDashboard() {
  const value = useContext(Store);
  if (!value) throw new Error('Dashboard provider missing');
  return value;
}
