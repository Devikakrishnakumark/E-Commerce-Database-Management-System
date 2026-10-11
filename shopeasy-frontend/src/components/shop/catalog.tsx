import { Link } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Smartphone, Shirt, Search, Grid2X2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { featuredQuery, productsQuery } from '@/lib/shop/api';
import { ProductCard, PageTitle, SampleNotice, EmptyState } from './shared';
import hero from '@/assets/red-shoe.jpg';

export function HomePage() {
  const { data: featured } = useSuspenseQuery(featuredQuery);
  const { data: products } = useSuspenseQuery(productsQuery);
  const track = useRef<HTMLDivElement>(null);
  const categories = [...new Set(products.data.map(product => product.category_name))];
  return <>
    <section className="home-hero shop-container">
      <div className="hero-copy"><span className="hero-eyebrow"><span /> A little something for everyone</span><h1>Shop the Best<br />Products Online</h1><p>Find amazing products at the best prices.<br />Fast delivery and secure payments.</p><Button asChild size="lg"><Link to="/products.html" search={{ q: '', category: '', max: '', sort: 'featured' }}>Shop Now <ArrowRight /></Link></Button></div>
      <div className="hero-photo"><img src={hero} width={1200} height={800} alt="Red athletic running shoe on a vivid red background" fetchPriority="high" /></div>
    </section>
    <section className="featured-section"><div className="shop-container">
      <div className="section-heading"><div><span className="eyebrow">HANDPICKED FOR YOU</span><h2>Featured Products</h2></div><div className="section-actions"><Link to="/products.html" search={{ q: '', category: '', max: '', sort: 'featured' }}>View all products <ArrowRight size={17} /></Link><div className="carousel-controls"><Button variant="outline" size="icon" aria-label="Previous products" onClick={() => track.current?.scrollBy({ left: -380, behavior: 'smooth' })}><ChevronLeft /></Button><Button variant="outline" size="icon" aria-label="Next products" onClick={() => track.current?.scrollBy({ left: 380, behavior: 'smooth' })}><ChevronRight /></Button></div></div></div>
      <SampleNotice sample={featured.sample} />
      {featured.data.length ? <div className="featured-track" ref={track}>{featured.data.map(product => <ProductCard key={product.product_id} product={product} featured />)}</div> : <EmptyState title="No featured products yet" />}
    </div></section>
    <section className="categories-section shop-container"><div className="section-heading"><div><span className="eyebrow">FIND YOUR FAVORITES</span><h2>Shop by Category</h2></div><Link to="/categories.html">Explore categories <ArrowRight size={17} /></Link></div><div className="category-grid">{categories.map(category => <CategoryTile category={category} count={products.data.filter(p => p.category_name === category).length} key={category} />)}</div></section>
  </>;
}

function CategoryTile({ category, count }: { category: string; count: number }) {
  const Icon = category === 'Electronics' ? Smartphone : category === 'Clothing' ? Shirt : Grid2X2;
  return <Link to="/products.html" search={{ category, q: '', max: '', sort: 'featured' }} className="category-tile"><span className="category-icon"><Icon /></span><div><h3>{category}</h3><p>{count} {count === 1 ? 'product' : 'products'}</p></div><ArrowRight size={20} /></Link>;
}

export type CatalogSearch = { q: string; category: string; max: string; sort: string };
export function ProductsPage({ search, change }: { search: CatalogSearch; change: (next: Partial<CatalogSearch>) => void }) {
  const { data: result } = useSuspenseQuery(productsQuery);
  const categories = [...new Set(result.data.map(product => product.category_name))];
  const filtered = result.data.filter(product => (!search.category || product.category_name === search.category) && (!search.max || Number(product.price) <= Number(search.max)) && `${product.product_name} ${product.description} ${product.category_name}`.toLowerCase().includes(search.q.toLowerCase()));
  if (search.sort === 'low') filtered.sort((a, b) => Number(a.price) - Number(b.price));
  if (search.sort === 'high') filtered.sort((a, b) => Number(b.price) - Number(a.price));
  if (search.sort === 'name') filtered.sort((a, b) => a.product_name.localeCompare(b.product_name));
  return <div className="shop-container page-content"><PageTitle title="Our Products" subtitle="Find your next everyday favorite." /><SampleNotice sample={result.sample} /><div className="catalog-layout"><aside className="catalog-filters"><div className="filter-title"><h2>Filters</h2><Button variant="link" onClick={() => change({ category: '', max: '', q: '' })}>Reset</Button></div><fieldset><legend>Category</legend><label className="radio-label"><input type="radio" name="category" checked={!search.category} onChange={() => change({ category: '' })} />All products</label>{categories.map(category => <label className="radio-label" key={category}><input type="radio" name="category" checked={search.category === category} onChange={() => change({ category })} />{category}</label>)}</fieldset><label className="field">Maximum price<input type="number" min="0" placeholder="No limit" value={search.max} onChange={e => change({ max: e.target.value })} /></label></aside><div><div className="catalog-toolbar"><div className="catalog-search"><Search size={18} /><input aria-label="Search products" placeholder="Search products…" value={search.q} onChange={e => change({ q: e.target.value })} /></div><select aria-label="Sort products" value={search.sort} onChange={e => change({ sort: e.target.value })}><option value="featured">Default order</option><option value="low">Price: Low to high</option><option value="high">Price: High to low</option><option value="name">Name: A to Z</option></select></div><p className="result-count">{filtered.length} {filtered.length === 1 ? 'product' : 'products'}{search.category && ` in ${search.category}`}</p>{filtered.length ? <div className="product-grid">{filtered.map(product => <ProductCard product={product} key={product.product_id} />)}</div> : <div className="empty-state"><Search /><h2>No products found</h2><Button variant="outline" onClick={() => change({ q: '', category: '', max: '' })}>Clear filters</Button></div>}</div></div></div>;
}

export function CategoriesPage() {
  const { data: result } = useSuspenseQuery(productsQuery);
  const categories = [...new Set(result.data.map(product => product.category_name))];
  return <div className="shop-container page-content"><PageTitle title="Categories" subtitle="Browse the things you love." /><SampleNotice sample={result.sample} /><div className="category-grid">{categories.map(category => <CategoryTile key={category} category={category} count={result.data.filter(product => product.category_name === category).length} />)}</div></div>;
}
export function AboutPage() { return <div className="shop-container page-content"><PageTitle title="About ShopEase" /><div className="about-content"><h2>Your everyday shopping destination.</h2><p>ShopEase brings electronics, clothing, and everyday essentials together in one place. Explore our products, find your favorites, and keep track of your orders.</p><Button asChild><Link to="/products.html" search={{ q: '', category: '', max: '', sort: 'featured' }}>Explore products <ArrowRight /></Link></Button></div></div>; }
