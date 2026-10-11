import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { storedUser } from '@/lib/shop/api';
import type { User } from '@/lib/shop/models';

const SessionContext = createContext<{ user: User | null; setUser: (user: User | null) => void }>({ user: null, setUser: () => {} });
export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, updateUser] = useState<User | null>(null);
  const client = useQueryClient();
  const router = useRouter();
  useEffect(() => {
    updateUser(storedUser());
    const sync = () => { updateUser(storedUser()); void router.invalidate(); };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, [router]);
  const setUser = (next: User | null) => {
    if (next) localStorage.setItem('user', JSON.stringify(next));
    else { localStorage.removeItem('user'); void client.cancelQueries(); client.clear(); }
    updateUser(next);
    void router.invalidate();
  };
  return <SessionContext.Provider value={{ user, setUser }}>{children}</SessionContext.Provider>;
}
export const useSession = () => useContext(SessionContext);