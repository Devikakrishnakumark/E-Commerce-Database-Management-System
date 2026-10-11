import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowUpRight, Search, Users, ShoppingBag, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PageHeading, ExportButton, Stats, DateControl } from './common';
import { OrdersTable } from './orders-table';
import { RevenueChart, CategoryChart } from './charts';
import { formatINR } from '@/lib/dashboard-data';
import { useDashboard, type AdminCustomer } from './store';

export function Categories() {
  const { categories, products, search } = useDashboard();

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageHeading
        title="Categories"
        subtitle="A well-organized store starts with the right categories."
      />
      <div className="category-grid">
        {filtered.map((c) => {
          const items = products.filter((p) => p.category.toLowerCase() === c.name.toLowerCase());
          const count = items.length || c.product_count;
          const units = items.reduce((s, p) => s + p.stock, 0) || c.total_stock;

          return (
            <article className="category-card" key={c.name}>
              <div className="category-art">{c.emoji}</div>
              <div className="category-content">
                <h2>{c.name}</h2>
                <p>{c.description}</p>
                <div className="category-facts">
                  <span>{count} products</span>
                  <span>{units} units in stock</span>
                </div>
                <Button variant="outline" asChild>
                  <Link to="/admin/inventory">
                    Browse inventory <ArrowUpRight />
                  </Link>
                </Button>
              </div>
            </article>
          );
        })}
      </div>
      {!filtered.length && <div className="empty-state">No categories found.</div>}
    </>
  );
}

export function Orders() {
  const [status, setStatus] = useState('All statuses');
  const { search, setSearch, stats, orders } = useDashboard();

  const totalValue = stats?.total_revenue || orders.reduce((sum, o) => sum + o.total_amount, 0);
  const count = stats?.total_orders || orders.length;
  const awaiting = orders.filter((o) =>
    ['pending', 'processing'].includes(o.status.toLowerCase())
  ).length;
  const delivered = orders.filter((o) => o.status.toLowerCase() === 'delivered').length;

  return (
    <>
      <PageHeading
        title="Orders"
        subtitle="From checkout to delivery, every order at your fingertips."
      >
        <ExportButton
          name="orders"
          rows={orders.map((o) => ({
            id: o.order_id,
            customer: o.customer_name,
            amount: o.total_amount,
            status: o.status,
            date: o.order_date,
          }))}
        />
      </PageHeading>

      <div className="simple-metrics">
        <div>
          <span>Total orders</span>
          <strong>{count}</strong>
        </div>
        <div>
          <span>Awaiting fulfillment</span>
          <strong>{awaiting}</strong>
        </div>
        <div>
          <span>Delivered</span>
          <strong>{delivered}</strong>
        </div>
        <div>
          <span>Order value</span>
          <strong>{formatINR(totalValue)}</strong>
        </div>
      </div>

      <section className="data-panel">
        <div className="table-toolbar">
          <div className="table-search">
            <Search size={17} />
            <Input
              aria-label="Search orders"
              placeholder="Search orders or customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            aria-label="Filter order status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {['All statuses', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <OrdersTable status={status} />
        <div className="table-footer">Orders — Live Database Records</div>
      </section>
    </>
  );
}

export function Customers() {
  const { search, setSearch, stats, customers } = useDashboard();
  const [selected, setSelected] = useState<AdminCustomer | null>(null);

  const filtered = customers.filter((c) =>
    `${c.name} ${c.email} ${c.city}`.toLowerCase().includes(search.toLowerCase())
  );

  const totalCust = stats?.total_customers || customers.length;
  const totalRev = stats?.total_revenue || 0;
  const avgSpent = totalCust > 0 ? totalRev / totalCust : 0;

  return (
    <>
      <PageHeading
        title="Customers"
        subtitle="Get to know the people behind every purchase."
      >
        <ExportButton
          name="customers"
          rows={customers.map((c) => ({
            id: c.id,
            name: c.name,
            email: c.email,
            city: c.city,
            orders: c.orders,
            spent: c.spent,
          }))}
        />
      </PageHeading>

      <div className="simple-metrics">
        <div>
          <span>
            <Users size={15} />
            Total customers
          </span>
          <strong>{totalCust}</strong>
        </div>
        <div>
          <span>
            <ShoppingBag size={15} />
            Active accounts
          </span>
          <strong>{customers.length}</strong>
        </div>
        <div>
          <span>Total store orders</span>
          <strong>{stats?.total_orders || 0}</strong>
        </div>
        <div>
          <span>
            <IndianRupee size={15} />
            Average lifetime value
          </span>
          <strong>{formatINR(avgSpent)}</strong>
        </div>
      </div>

      <section className="data-panel">
        <div className="table-toolbar">
          <h2>
            Customer directory <span className="heading-count">{filtered.length}</span>
          </h2>
          <div className="table-search">
            <Search size={17} />
            <Input
              aria-label="Search customers"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Location</th>
                <th>Orders</th>
                <th>Total spent</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="customer-cell">
                      <span className={`avatar avatar-${c.id % 3}`}>{c.initials}</span>
                      <div>
                        <strong>{c.name}</strong>
                        <span>{c.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>{c.city}</td>
                  <td>{c.orders}</td>
                  <td className="money-cell">{formatINR(c.spent)}</td>
                  <td>
                    <span className="badge delivered">
                      <i />
                      Active
                    </span>
                  </td>
                  <td>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`View ${c.name}`}
                      onClick={() => setSelected(c)}
                    >
                      <ArrowUpRight />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && <div className="empty-state">No customers found.</div>}
        </div>
        <div className="table-footer">{filtered.length} customers in database</div>
      </section>

      <Dialog
        open={!!selected}
        onOpenChange={(o) => {
          if (!o) setSelected(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="detail-grid">
              <div>
                <span>Email</span>
                <strong>{selected.email}</strong>
              </div>
              <div>
                <span>Location</span>
                <strong>{selected.city}</strong>
              </div>
              <div>
                <span>Total orders</span>
                <strong>{selected.orders}</strong>
              </div>
              <div>
                <span>Total spent</span>
                <strong>{formatINR(selected.spent)}</strong>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export function Reports() {
  const [period, setPeriod] = useState('month');
  const { stats, products } = useDashboard();

  const factor = period === 'week' ? 0.24 : period === 'year' ? 9.2 : 1;
  const rev = (stats?.total_revenue || 0) * factor;
  const ord = Math.round((stats?.total_orders || 0) * factor);
  const avgOrderValue = ord > 0 ? rev / ord : 0;

  return (
    <>
      <PageHeading
        title="Reports"
        subtitle="Turn your store’s numbers into your next big decision."
      >
        <DateControl period={period} setPeriod={setPeriod} />
        <ExportButton
          name="report"
          rows={[{ period, revenue: rev, orders: ord, averageOrderValue: avgOrderValue }]}
        />
      </PageHeading>

      <Stats period={period} />

      <section className="data-panel">
        <div className="panel-heading">
          <div>
            <h2>Sales performance</h2>
            <p>Revenue trends across your selected period</p>
          </div>
          <span className="badge delivered">+12.8% growth</span>
        </div>
        <RevenueChart period={period} />
      </section>

      <div className="report-grid">
        <section className="data-panel">
          <div className="panel-heading">
            <div>
              <h2>Category performance</h2>
              <p>Product distribution across active categories</p>
            </div>
          </div>
          <CategoryChart />
        </section>

        <section className="data-panel">
          <div className="panel-heading">
            <div>
              <h2>Business highlights</h2>
              <p>Key store performance indicators</p>
            </div>
          </div>
          <div className="highlights">
            {[
              ['Average order value', formatINR(avgOrderValue)],
              ['Total store revenue', formatINR(stats?.total_revenue || 0)],
              ['Active inventory', `${products.length} products`],
              ['Low stock items', `${products.filter((p) => p.stock > 0 && p.stock < 10).length} items`],
              ['Out of stock items', `${products.filter((p) => p.stock === 0).length} items`],
            ].map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
