import { Link, useRouterState } from '@tanstack/react-router';
import { useState, type ReactNode } from 'react';
import {
  ShoppingBag,
  LayoutDashboard,
  Package,
  Shapes,
  ShoppingCart,
  Users,
  ChartNoAxesCombined,
  Search,
  Bell,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowUpRight,
  X,
  Check,
  Store,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDashboard } from './store';

const navigation = [
  { name: 'Overview', to: '/admin', icon: LayoutDashboard },
  { name: 'Inventory', to: '/admin/inventory', icon: Package },
  { name: 'Categories', to: '/admin/categories', icon: Shapes },
  { name: 'Orders', to: '/admin/orders', icon: ShoppingCart },
  { name: 'Customers', to: '/admin/customers', icon: Users },
  { name: 'Reports', to: '/admin/reports', icon: ChartNoAxesCombined },
] as const;

export function DashboardShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [panel, setPanel] = useState<'notifications' | 'profile' | 'help' | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { search, setSearch, orders, products } = useDashboard();

  let adminName = 'Super Admin';
  let adminRole = 'Store Administrator';
  let adminInitials = 'SA';

  try {
    const raw = localStorage.getItem('user');
    if (raw) {
      const u = JSON.parse(raw);
      if (u?.name) {
        adminName = u.name;
        adminInitials = u.name
          .split(' ')
          .map((w: string) => w[0])
          .join('')
          .toUpperCase()
          .substring(0, 2);
      }
      if (u?.role === 'admin') adminRole = 'Administrator';
    }
  } catch {}

  const active = navigation.find((n) => n.to === pathname)?.name || 'Overview';
  const pendingCount = orders.filter((o) => ['pending', 'processing'].includes(o.status.toLowerCase())).length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock < 10);

  function handleLogout() {
    localStorage.removeItem('user');
    window.location.href = '/';
  }

  return (
    <div className={`dashboard-shell ${collapsed ? 'is-collapsed' : ''}`}>
      <aside className="dashboard-sidebar">
        <Link to="/admin" className="brand">
          <span className="brand-symbol">
            <ShoppingBag size={22} />
          </span>
          <span className="brand-name">
            ShopEase
            <span className="brand-subtitle">ADMIN WORKSPACE</span>
          </span>
        </Link>

        <div className="workspace">
          <span className="workspace-icon">S</span>
          <div className="sidebar-label">
            <strong>ShopEase Store</strong>
            <span>PostgreSQL Database</span>
          </div>
          <ChevronDown size={15} className="sidebar-label" />
        </div>

        <p className="nav-label sidebar-label">WORKSPACE</p>
        <nav>
          {navigation.map((n) => (
            <Button
              key={n.name}
              variant="ghost"
              asChild
              className={`nav-item ${pathname === n.to ? 'nav-active' : ''}`}
              title={n.name}
            >
              <Link to={n.to}>
                <n.icon size={19} />
                <span className="sidebar-label">{n.name}</span>
                {n.name === 'Orders' && orders.length > 0 && (
                  <span className="nav-count sidebar-label">{orders.length}</span>
                )}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-box sidebar-label">
            <span className="help-spark">✧</span>
            <strong>Live Database Mode</strong>
            <p>PostgreSQL is connected and managing your store.</p>
            <Button variant="outline" asChild>
              <Link to="/">
                Go to Shop <ArrowUpRight />
              </Link>
            </Button>
          </div>
          <div className="sidebar-footer">
            <span className="brand-symbol small">
              <ShoppingBag size={16} />
            </span>
            <span className="sidebar-label">ShopEase Admin Panel</span>
          </div>
        </div>
      </aside>

      <div className="dashboard-body">
        <header className="dashboard-header">
          <div className="header-location">
            <Button
              size="icon"
              variant="ghost"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
            </Button>
            <span className="header-divider" />
            <span className="breadcrumb-root">Workspace</span>
            <span className="breadcrumb-slash">/</span>
            <strong>{active}</strong>
          </div>

          <div className="header-actions">
            <div className="global-search">
              <Search size={17} />
              <input
                aria-label="Search workspace"
                placeholder="Search anything..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <Button size="icon" variant="ghost" onClick={() => setSearch('')} aria-label="Clear search">
                  <X />
                </Button>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications"
              className="notification-button"
              onClick={() => setPanel('notifications')}
            >
              <Bell />
              {(pendingCount > 0 || lowStock.length > 0) && <span className="notification-dot" />}
            </Button>

            <Button
              variant="outline"
              size="sm"
              asChild
              className="view-store-btn"
              title="View customer storefront"
            >
              <Link to="/">
                <Store size={15} />
                <span>View Store</span>
                <ExternalLink size={12} />
              </Link>
            </Button>

            <span className="header-divider" />

            <Button
              variant="ghost"
              className="profile-button"
              onClick={() => setPanel('profile')}
            >
              <span className="avatar admin-avatar">{adminInitials}</span>
              <span className="profile-name">
                {adminName}
                <span>{adminRole}</span>
              </span>
              <ChevronDown size={14} />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="logout-button text-muted-foreground hover:text-destructive"
              title="Log out of Admin"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </div>
        </header>

        <main className="dashboard-main">{children}</main>

        <footer className="main-footer">
          <span>© 2026 ShopEase. Connected to local PostgreSQL database.</span>
          <span>
            <i className="live-dot" />
            Database active & operational
          </span>
        </footer>
      </div>

      <Dialog open={!!panel} onOpenChange={(open) => { if (!open) setPanel(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {panel === 'notifications'
                ? 'Store Notifications'
                : panel === 'profile'
                  ? 'Admin Account'
                  : 'Database Info'}
            </DialogTitle>
          </DialogHeader>
          {panel === 'notifications' ? (
            <div className="notification-list">
              {pendingCount > 0 && (
                <p>
                  <ShoppingCart />
                  {pendingCount} order(s) waiting to be fulfilled.
                </p>
              )}
              {lowStock.map((p) => (
                <p key={p.id}>
                  <Package />
                  {p.name} has low stock ({p.stock} units remaining).
                </p>
              ))}
              {orders.length > 0 && (
                <p>
                  <Check />
                  Latest order #{orders[0].order_id} recorded in database.
                </p>
              )}
              {pendingCount === 0 && lowStock.length === 0 && (
                <p className="text-muted-foreground">All orders processed and stock levels are healthy.</p>
              )}
            </div>
          ) : panel === 'profile' ? (
            <div className="account-details">
              <span className="avatar admin-avatar">{adminInitials}</span>
              <h3>{adminName}</h3>
              <p>{adminRole} · ShopEase Local Database</p>
              <span className="badge delivered">PostgreSQL Verified</span>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <Button variant="outline" asChild style={{ flex: 1 }}>
                  <Link to="/" onClick={() => setPanel(null)}>
                    <Store size={15} style={{ marginRight: '0.35rem' }} />
                    View Website
                  </Link>
                </Button>
                <Button variant="destructive" onClick={handleLogout} style={{ flex: 1 }}>
                  <LogOut size={15} style={{ marginRight: '0.35rem' }} />
                  Log Out
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <p>ShopEase Admin Portal</p>
              <p className="text-muted-foreground mt-2">
                Connected to local PostgreSQL database `ShopEasy`.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
