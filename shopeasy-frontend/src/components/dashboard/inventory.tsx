import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useDashboard } from './store';
import { PageHeading, ExportButton, StatusBadge } from './common';
import { formatINR, type Product } from '@/lib/dashboard-data';

const blank = { name: '', sku: '', category: 'Electronics', price: '', stock: '', description: '' };

export function Inventory() {
  const { products, categories, search, addProduct, updateProduct, deleteProduct } = useDashboard();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All categories');
  const [stock, setStock] = useState('All stock');
  const [editing, setEditing] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [form, setForm] = useState(blank);
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = products.filter(
    (p) =>
      `${p.name} ${p.sku}`.toLowerCase().includes(`${query || search}`.toLowerCase()) &&
      (category === 'All categories' || p.category === category) &&
      (stock === 'All stock' ||
        (stock === 'Low stock'
          ? p.stock > 0 && p.stock < 10
          : stock === 'Out of stock'
            ? p.stock === 0
            : p.stock >= 10))
  );

  const pages = Math.max(1, Math.ceil(filtered.length / 8));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * 8, currentPage * 8);

  function start(p?: Product) {
    setEditing(p || null);
    setForm(
      p
        ? {
            name: p.name,
            sku: p.sku,
            category: p.category,
            price: String(p.price),
            stock: String(p.stock),
            description: p.description || '',
          }
        : {
            ...blank,
            category: categories[0]?.name || 'Electronics',
          }
    );
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || Number(form.price) < 0 || Number(form.stock) < 0) return;

    setIsSubmitting(true);
    const categoryObj = categories.find((c) => c.name === form.category);

    try {
      if (editing) {
        const ok = await updateProduct(editing.id, {
          name: form.name.trim(),
          price: Number(form.price),
          stock: Number(form.stock),
          category_id: categoryObj?.id,
          description: form.description,
        });
        if (ok) {
          setNotice(`${form.name.trim()} updated successfully in database.`);
          setOpen(false);
        } else {
          setNotice('Failed to update product in database.');
        }
      } else {
        const ok = await addProduct({
          name: form.name.trim(),
          price: Number(form.price),
          stock: Number(form.stock),
          category_id: categoryObj?.id,
          description: form.description,
        });
        if (ok) {
          setNotice(`${form.name.trim()} added successfully to database.`);
          setOpen(false);
        } else {
          setNotice('Failed to add product to database.');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setIsSubmitting(true);
    try {
      const ok = await deleteProduct(deleting.id);
      if (ok) {
        setNotice(`${deleting.name} removed from database.`);
        setDeleting(null);
      } else {
        setNotice('Failed to delete product from database.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <PageHeading
        title="Inventory"
        subtitle="Manage your products, keep track of stock, and stay ready for every order."
      >
        <ExportButton name="inventory" rows={products} />
        <Button onClick={() => start()}>
          <Plus />
          Add Product
        </Button>
      </PageHeading>

      <div className="inventory-stats">
        <div>
          <span className="stat-icon blue">
            <Package />
          </span>
          <div>
            <span>Total products</span>
            <strong>{products.length}</strong>
          </div>
        </div>
        <div>
          <span className="stat-icon green">
            <Package />
          </span>
          <div>
            <span>In stock</span>
            <strong>{products.filter((p) => p.stock >= 10).length}</strong>
          </div>
        </div>
        <div>
          <span className="stat-icon amber">
            <Package />
          </span>
          <div>
            <span>Low stock</span>
            <strong>{products.filter((p) => p.stock > 0 && p.stock < 10).length}</strong>
          </div>
        </div>
        <div>
          <span className="stat-icon red">
            <Package />
          </span>
          <div>
            <span>Out of stock</span>
            <strong>{products.filter((p) => p.stock === 0).length}</strong>
          </div>
        </div>
      </div>

      {notice && (
        <p className="success-notice" role="status">
          {notice}
        </p>
      )}

      <section className="data-panel">
        <div className="table-toolbar">
          <div className="table-search">
            <Search size={17} />
            <Input
              aria-label="Search products"
              placeholder="Search products or SKU..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="table-filters">
            <select
              aria-label="Filter category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>All categories</option>
              {categories.map((c) => (
                <option key={c.name}>{c.name}</option>
              ))}
            </select>
            <select
              aria-label="Filter stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            >
              {['All stock', 'In stock', 'Low stock', 'Out of stock'].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-scroll">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Stock level</th>
                <th>Price</th>
                <th className="actions-heading">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="product-cell">
                      <span className="product-thumb">{p.emoji}</span>
                      <strong>{p.name}</strong>
                    </div>
                  </td>
                  <td className="muted-cell">{p.sku}</td>
                  <td>
                    <span className="category-tag">{p.category}</span>
                  </td>
                  <td>
                    <div className="stock-cell">
                      <strong>
                        {p.stock} <span>units</span>
                      </strong>
                      <StatusBadge
                        status={p.stock === 0 ? 'Out of stock' : p.stock < 10 ? 'Low stock' : 'In stock'}
                      />
                    </div>
                  </td>
                  <td className="money-cell">{formatINR(p.price)}</td>
                  <td>
                    <div className="row-actions">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Edit product"
                        aria-label={`Edit ${p.name}`}
                        onClick={() => start(p)}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="delete-action"
                        title="Delete product"
                        aria-label={`Delete ${p.name}`}
                        onClick={() => setDeleting(p)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visible.length && <div className="empty-state">No products found in the database.</div>}
        </div>

        <div className="table-footer">
          <span>
            Showing {filtered.length ? (currentPage - 1) * 8 + 1 : 0}–
            {Math.min(currentPage * 8, filtered.length)} of {filtered.length} products
          </span>
          <div>
            <Button
              variant="outline"
              size="icon"
              aria-label="Previous page"
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
            >
              <ChevronLeft />
            </Button>
            <span>{currentPage}</span>
            <Button
              variant="outline"
              size="icon"
              aria-label="Next page"
              disabled={currentPage === pages}
              onClick={() => setPage(currentPage + 1)}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit product' : 'Add a new product'}</DialogTitle>
            <DialogDescription>
              {editing
                ? 'Update the product details in your PostgreSQL database.'
                : 'Add a new product directly to your store inventory.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={save} className="product-form">
            <label>
              Product name
              <Input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Wireless Keyboard"
              />
            </label>
            <label>
              Category
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="form-columns">
              <label>
                Price (₹)
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </label>
              <label>
                Stock quantity
                <Input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </label>
            </div>
            <div className="form-actions">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editing ? 'Save changes' : 'Add product'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleting} onOpenChange={(o) => { if (!o) setDeleting(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete product?</DialogTitle>
            <DialogDescription>
              "{deleting?.name}" will be permanently removed from your PostgreSQL database.
            </DialogDescription>
          </DialogHeader>
          <div className="form-actions">
            <Button variant="outline" onClick={() => setDeleting(null)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting ? 'Deleting...' : 'Delete product'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
