import { useState } from 'react';
import { formatINR } from '@/lib/dashboard-data';
import { StatusBadge } from './common';
import { useDashboard, type AdminOrder } from './store';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowUpRight } from 'lucide-react';

export function OrdersTable({ recent = false, status = 'All statuses' }: { recent?: boolean; status?: string }) {
  const { search, orders } = useDashboard();
  const [selected, setSelected] = useState<AdminOrder | null>(null);

  const filtered = orders
    .filter((o) => {
      const matchesStatus = status === 'All statuses' || o.status.toLowerCase() === status.toLowerCase();
      const searchTarget = `${o.order_id} ${o.customer_name} ${o.items}`.toLowerCase();
      const matchesSearch = !search || searchTarget.includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    })
    .slice(0, recent ? 5 : 99);

  return (
    <>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              {!recent && <th>Items</th>}
              <th>Amount</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => {
              const formattedDate = o.order_date
                ? new Date(o.order_date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Recent';

              const initials = o.customer_name
                ? o.customer_name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .substring(0, 2)
                : 'CU';

              return (
                <tr key={o.order_id}>
                  <td>
                    <Button variant="link" className="order-link" onClick={() => setSelected(o)}>
                      #{o.order_id}
                    </Button>
                  </td>
                  <td>
                    <div className="customer-cell">
                      <span className={`avatar avatar-${o.order_id % 3}`}>{initials}</span>
                      <div>
                        <strong>{o.customer_name}</strong>
                      </div>
                    </div>
                  </td>
                  <td className="muted-cell">{formattedDate}</td>
                  {!recent && <td>{o.items}</td>}
                  <td className="money-cell">{formatINR(o.total_amount)}</td>
                  <td>
                    <StatusBadge status={o.status} />
                  </td>
                  <td>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`View order ${o.order_id}`}
                      onClick={() => setSelected(o)}
                    >
                      <ArrowUpRight />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!filtered.length && <div className="empty-state">No orders match your search.</div>}
      </div>

      <Dialog
        open={!!selected}
        onOpenChange={(o) => {
          if (!o) setSelected(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order #{selected?.order_id}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="detail-grid">
              <div>
                <span>Customer</span>
                <strong>{selected.customer_name}</strong>
              </div>
              <div>
                <span>Order date</span>
                <strong>
                  {selected.order_date
                    ? new Date(selected.order_date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'Recent'}
                </strong>
              </div>
              <div>
                <span>Items</span>
                <strong>{selected.items}</strong>
              </div>
              <div>
                <span>Total amount</span>
                <strong>{formatINR(selected.total_amount)}</strong>
              </div>
              <div>
                <span>Status</span>
                <StatusBadge status={selected.status} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
