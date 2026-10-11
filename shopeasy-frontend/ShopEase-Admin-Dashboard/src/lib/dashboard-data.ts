export const formatINR = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
export type Product = { id: number; name: string; sku: string; category: string; price: number; stock: number; emoji: string };
export const initialProducts: Product[] = [
 { id: 1, name: 'Wireless Headphones', sku: 'ELC-001', category: 'Electronics', price: 2499, stock: 48, emoji: '🎧' },
 { id: 2, name: 'Classic Cotton T-Shirt', sku: 'CLT-002', category: 'Clothing', price: 799, stock: 124, emoji: '👕' },
 { id: 3, name: 'Smart Watch Pro', sku: 'ELC-003', category: 'Electronics', price: 5999, stock: 8, emoji: '⌚' },
 { id: 4, name: 'Everyday Backpack', sku: 'ACC-004', category: 'Accessories', price: 1899, stock: 36, emoji: '🎒' },
 { id: 5, name: 'Ceramic Coffee Mug', sku: 'HOM-005', category: 'Home & Living', price: 449, stock: 0, emoji: '☕' },
 { id: 6, name: 'Running Sneakers', sku: 'FTW-006', category: 'Footwear', price: 3299, stock: 62, emoji: '👟' },
 { id: 7, name: 'Smartphone X', sku: 'ELC-007', category: 'Electronics', price: 24999, stock: 22, emoji: '📱' },
 { id: 8, name: 'Linen Cushion Cover', sku: 'HOM-008', category: 'Home & Living', price: 599, stock: 7, emoji: '🛋️' },
];
export const customers = [
 { id: 1, name: 'Aarav Sharma', email: 'aarav.sharma@example.com', city: 'Mumbai', orders: 12, spent: 32450, initials: 'AS' },
 { id: 2, name: 'Priya Patel', email: 'priya.patel@example.com', city: 'Ahmedabad', orders: 8, spent: 18790, initials: 'PP' },
 { id: 3, name: 'Rohan Mehta', email: 'rohan.mehta@example.com', city: 'Bengaluru', orders: 6, spent: 24999, initials: 'RM' },
 { id: 4, name: 'Ananya Singh', email: 'ananya.singh@example.com', city: 'Delhi', orders: 14, spent: 42890, initials: 'AN' },
 { id: 5, name: 'Vikram Rao', email: 'vikram.rao@example.com', city: 'Hyderabad', orders: 4, spent: 7498, initials: 'VR' },
 { id: 6, name: 'Neha Kapoor', email: 'neha.kapoor@example.com', city: 'Pune', orders: 9, spent: 21380, initials: 'NK' },
] as const;
export const orders = [
 { id: 'SE-1048', customer: customers[0], date: '09 Oct, 2026', items: 'Wireless Headphones', amount: 2499, status: 'Delivered' },
 { id: 'SE-1047', customer: customers[1], date: '09 Oct, 2026', items: 'Classic Cotton T-Shirt × 2', amount: 1598, status: 'Processing' },
 { id: 'SE-1046', customer: customers[2], date: '08 Oct, 2026', items: 'Smartphone X', amount: 24999, status: 'Shipped' },
 { id: 'SE-1045', customer: customers[3], date: '08 Oct, 2026', items: 'Running Sneakers', amount: 3299, status: 'Delivered' },
 { id: 'SE-1044', customer: customers[4], date: '08 Oct, 2026', items: 'Smart Watch Pro', amount: 5999, status: 'Pending' },
 { id: 'SE-1043', customer: customers[5], date: '07 Oct, 2026', items: 'Everyday Backpack', amount: 1899, status: 'Cancelled' },
];
export const categories = [ { name: 'Electronics', emoji: '🎧', description: 'Everyday tech, extraordinary possibilities' }, { name: 'Clothing', emoji: '👕', description: 'Comfort and style for every day' }, { name: 'Accessories', emoji: '🎒', description: 'The details that make a difference' }, { name: 'Home & Living', emoji: '☕', description: 'Thoughtful essentials for your space' }, { name: 'Footwear', emoji: '👟', description: 'A better step, wherever you go' } ];
export const revenue = [ { day:'01', current:14000, previous:10000 }, {day:'05',current:22000,previous:15000}, {day:'10',current:18000,previous:14000}, {day:'15',current:31000,previous:22000}, {day:'20',current:27000,previous:20000}, {day:'25',current:41000,previous:28000}, {day:'30',current:37000,previous:26000} ];
export function exportCSV(name: string, rows: readonly Record<string, unknown>[]) {
 const first = rows[0];
 if (!first) return;
 const headers = Object.keys(first);
 const csv = [headers.join(','), ...rows.map(row => headers.map(key => '"' + String(row[key]).replaceAll('"', '""') + '"').join(','))].join('\n');
 const url = URL.createObjectURL(new Blob([csv], {type:'text/csv;charset=utf-8;'}));
 const a = document.createElement('a'); a.href=url; a.download=`shopease-${name}.csv`; a.click(); URL.revokeObjectURL(url);
}
