import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight, ArrowUpRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeading, Stats, ExportButton, DateControl } from './common';
import { RevenueChart } from './charts';
import { OrdersTable } from './orders-table';
import { formatINR } from '@/lib/dashboard-data';
import { useDashboard } from './store';

export function Overview() {
  const [period, setPeriod] = useState('month');
  const { products, stats, orders, categories } = useDashboard();

  let adminName = 'Admin';
  try {
    const raw = localStorage.getItem('user');
    if (raw) {
      const u = JSON.parse(raw);
      if (u?.name) adminName = u.name;
    }
  } catch {}

  const factor = period === 'week' ? 0.24 : period === 'year' ? 9.2 : 1;
  const currentRev = (stats?.total_revenue || 0) * factor;
  const currentOrders = Math.round((stats?.total_orders || orders.length || 0) * factor);

  // Dynamic category distribution
  const totalProductsCount = products.length || 1;
  const categoryDistribution = categories.map((c, i) => {
    const pCount = products.filter((p) => p.category.toLowerCase() === c.name.toLowerCase()).length;
    const percentage = Math.round((pCount / totalProductsCount) * 100);
    return { name: c.name, percentage: `${percentage}%`, count: pCount };
  });

  return (
    <>
      <PageHeading
        title="Overview"
        subtitle={`Welcome back, ${adminName}. Here’s how your store is doing today.`}
      >
        <DateControl period={period} setPeriod={setPeriod} />
        <ExportButton
          name="report"
          rows={[
            {
              period,
              totalRevenue: currentRev,
              totalOrders: currentOrders,
              totalProducts: products.length,
              totalCustomers: stats?.total_customers || 0,
            },
          ]}
        />
      </PageHeading>

      <Stats period={period} />

      <div className="overview-charts">
        <section className="data-panel revenue-panel">
          <div className="panel-heading">
            <div>
              <h2>Revenue overview</h2>
              <p>A closer look at your store’s performance</p>
            </div>
            <span className="panel-pill">
              {period === 'month' ? 'Current Month' : period === 'week' ? 'This week' : 'This Year'}
            </span>
          </div>
          <div className="revenue-summary">
            <strong>{formatINR(currentRev)}</strong>
            <span className="positive">
              <ArrowUpRight size={14} />
              12.8%
            </span>
            <span className="chart-legend">
              <i />
              This period <i className="previous" />
              Previous period
            </span>
          </div>
          <RevenueChart period={period} />
        </section>

        <section className="data-panel sales-panel">
          <div className="panel-heading">
            <div>
              <h2>Sales by category</h2>
              <p>Product distribution across active categories</p>
            </div>
            <MoreHorizontal size={20} />
          </div>
          <div className="donut">
            <div className="donut-center">
              <span>Total orders</span>
              <strong>{currentOrders}</strong>
            </div>
          </div>
          <div className="category-legend">
            {categoryDistribution.slice(0, 5).map((item, i) => (
              <div key={item.name}>
                <span>
                  <i className={`legend-dot dot-${i % 5}`} />
                  {item.name}
                </span>
                <strong>{item.percentage}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="data-panel recent-orders">
        <div className="panel-heading">
          <div>
            <h2>
              Recent orders <span className="heading-count">{orders.length}</span>
            </h2>
            <p>Your latest customer orders, pulled live from the database</p>
          </div>
          <Button variant="ghost" asChild className="view-all">
            <Link to="/admin/orders">
              View all orders <ArrowRight />
            </Link>
          </Button>
        </div>
        <OrdersTable recent />
      </section>

      <div className="overview-bottom">
        <section className="data-panel">
          <div className="panel-heading">
            <div>
              <h2>Active products</h2>
              <p>Products currently in stock</p>
            </div>
            <Button variant="ghost" asChild className="view-all">
              <Link to="/admin/inventory">
                View inventory <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="top-products">
            {products.slice(0, 3).map((p, i) => (
              <div className="top-product" key={p.id}>
                <span className="rank">0{i + 1}</span>
                <span className="product-thumb">{p.emoji}</span>
                <div>
                  <strong>{p.name}</strong>
                  <span>{p.stock} units in stock</span>
                </div>
                <strong>{formatINR(p.price)}</strong>
              </div>
            ))}
            {!products.length && <div className="empty-state">No products found.</div>}
          </div>
        </section>

        <section className="store-note">
          <span className="note-eyebrow">STORE HEALTH & STATUS</span>
          <h2>Live Database<br />Connected.</h2>
          <p>
            Your store is fully integrated with PostgreSQL.<br />
            Manage inventory and track orders seamlessly.
          </p>
          <Button variant="outline" asChild>
            <Link to="/admin/reports">
              Explore reports <ArrowUpRight />
            </Link>
          </Button>
          <span className="note-decoration">↗</span>
        </section>
      </div>
    </>
  );
}
