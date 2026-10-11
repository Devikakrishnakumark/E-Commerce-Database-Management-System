# ShopEase E-Commerce System: Figures & Screenshots Catalog

**Document Purpose:** Organized catalog of all system screenshots with academic figure numbering, captions, and functional descriptions suitable for project report submission.  
**Resolution:** 1920 × 1080 (High Definition Desktop Capture)  
**Target Application:** ShopEase Full-Stack System (Vite React + Node/Express + PostgreSQL)  

---

## Part 1: Customer Storefront Interface

### Figure 1: Storefront Home Page
- **File Location:** \`../screenshots/fig01_home_page.png\`
- **Caption:** *Figure 1: ShopEase Consumer Home Page with hero banner, featured product recommendations, and shopping navigation.*
- **System Description:** The entry point for shoppers. Features a modern blue branding header with store logo, search bar, department links, shopping cart counter, and authentication buttons. The page showcases top-selling products dynamically queried from the backend, customer value guarantees (free shipping, 24/7 support), and responsive call-to-action cards.

---

### Figure 2: Products Catalog & Filtering Page
- **File Location:** \`../screenshots/fig02_products_catalog.png\`
- **Caption:** *Figure 2: Real-Time Products Catalog with dynamic search, multi-category filter pills, and price sorting.*
- **System Description:** Renders the complete live product catalog pulled from PostgreSQL via \`GET /api/products\`. Shoppers can filter products by department (Electronics, Clothing, Home & Kitchen), sort by price (Low to High, High to Low), or search by keywords. Each card displays product title, category tag, price in Indian Rupees (₹), live stock status, and an interactive "Add to Cart" button.

---

### Figure 3: Categories Exploration Page
- **File Location:** \`../screenshots/fig03_categories_page.png\`
- **Caption:** *Figure 3: Store Departments and Category Browsing Interface.*
- **System Description:** Displays all active merchandise categories registered in the \`CATEGORY\` database table (Electronics, Clothing, Home & Kitchen, Books, Sports). Each category card presents high-level department descriptions and enables quick one-click filtering into specific catalog segments.

---

### Figure 4: About Us Page
- **File Location:** \`../screenshots/fig04_about_page.png\`
- **Caption:** *Figure 4: ShopEase About Us and Corporate Information Page.*
- **System Description:** Outlines the store's mission, values, and customer commitment. Features statistics highlighting quality assurance, fast order fulfillment, customer satisfaction ratings, and customer care contact options.

---

### Figure 5: Customer Login Page
- **File Location:** \`../screenshots/fig05_customer_login.png\`
- **Caption:** *Figure 5: Customer Authentication Portal with email and password verification.*
- **System Description:** Secure portal for returning shoppers. Validates customer credentials against the \`CUSTOMER\` table via \`POST /api/login\`. Features client-side form validation, error message alerts for incorrect credentials, and quick redirection to registration.

---

### Figure 6: Customer Registration (Sign Up) Page
- **File Location:** \`../screenshots/fig06_customer_register.png\`
- **Caption:** *Figure 6: New Customer Account Registration Interface.*
- **System Description:** Registration form capturing Full Name, Email, and Password. Submits to \`POST /api/register\` with backend enforcement of email uniqueness. Upon successful account creation, the user is automatically authenticated and redirected to the storefront.

---

### Figure 7: Admin Login Portal
- **File Location:** \`../screenshots/fig07_admin_login.png\`
- **Caption:** *Figure 7: Dedicated Administrator Authentication Portal.*
- **System Description:** Separate, isolated login interface for authorized store managers. Authenticates against the \`ADMIN\` table via \`POST /api/admin/login\`. Verifies administrator privileges and redirects authorized managers to the privileged Admin Workspace.

---

### Figure 8: Shopping Cart Page
- **File Location:** \`../screenshots/fig08_shopping_cart.png\`
- **Caption:** *Figure 8: Customer Shopping Cart with itemized line subtotals and order summary.*
- **System Description:** Displays all items currently staged in the customer's cart via \`GET /api/cart\`. Shows product thumbnail, line item price, quantity controls, line subtotal, and an itemized order summary with grand total and a "Proceed to Checkout" action.

---

### Figure 9: Checkout & Transaction Page
- **File Location:** \`../screenshots/fig09_checkout_page.png\`
- **Caption:** *Figure 9: Checkout Interface executing PostgreSQL Stored Procedure \`CheckoutCart\`.*
- **System Description:** Finalizes purchases by verifying shipping address and payment method (Credit Card, Debit Card, Net Banking, Cash on Delivery). Clicking "Place Order" calls \`POST /api/checkout\`, triggering the database procedure \`CheckoutCart\` which atomically creates orders, decrements inventory via triggers, and logs payment.

---

### Figure 10: Customer Order History Page
- **File Location:** \`../screenshots/fig10_customer_orders.png\`
- **Caption:** *Figure 10: Customer Order History with purchase timeline and status badges.*
- **System Description:** Accessible to logged-in customers. Queries \`GET /api/orders\` to display past orders, order dates, total amounts paid, fulfillment status (Pending, Processing, Delivered), and aggregated item descriptions.

---

## Part 2: Admin Dashboard & Management Workspace

### Figure 11: Admin Overview & Analytics Dashboard
- **File Location:** \`../screenshots/fig11_admin_overview.png\`
- **Caption:** *Figure 11: Admin Executive Overview with live KPIs, revenue trend chart, and recent orders.*
- **System Description:** High-level executive dashboard showing:
  - Total Revenue (\`₹4,440\`)
  - Total Orders (\`3\`)
  - Total Customers (\`6\`)
  - Total Products (\`6\`)
  - Dynamic Revenue Trend area chart
  - Sales by Category breakdown
  - Recent customer orders list
  - Real-time stock status cards

---

### Figure 12: Admin Inventory Management Page
- **File Location:** \`../screenshots/fig12_admin_inventory.png\`
- **Caption:** *Figure 12: Inventory Management table with stock status pills and real-time CRUD actions.*
- **System Description:** Complete inventory control center. Displays live products from PostgreSQL with SKU, category, stock units, price, and status badges (In Stock, Low Stock, Out of Stock). Features interactive "Add Product", "Edit Product", and "Delete Product" actions communicating directly with the backend REST API.

---

### Figure 13: Admin Categories Management Page
- **File Location:** \`../screenshots/fig13_admin_categories.png\`
- **Caption:** *Figure 13: Category Departments Overview with live product counts and stock units.*
- **System Description:** Visual breakdown of all 5 database categories. Dynamically calculates and displays the number of active products and total stock units belonging to each department, providing immediate insight into inventory distribution.

---

### Figure 14: Admin Live Customer Orders Table
- **File Location:** \`../screenshots/fig14_admin_orders.png\`
- **Caption:** *Figure 14: Master Orders Management Table with status filtering and item inspect modal.*
- **System Description:** Comprehensive order management interface. Displays Order IDs, customer names, formatted order dates, itemized products, total amounts in ₹, and status badges. Managers can filter orders by status (Pending, Processing, Shipped, Delivered, Cancelled) or search by customer name.

---

### Figure 15: Admin Customer Directory & Lifetime Value
- **File Location:** \`../screenshots/fig15_admin_customers.png\`
- **Caption:** *Figure 15: Customer Directory displaying registered users and calculated lifetime spend.*
- **System Description:** Displays all registered customers in PostgreSQL. Executes real-time SQL aggregates to calculate each customer's total completed orders and cumulative lifetime spend (e.g., John Doe: 3 orders, ₹4,440 spent), alongside contact details and active account indicators.

---

### Figure 16: Admin Analytical Reports Page
- **File Location:** \`../screenshots/fig16_admin_reports.png\`
- **Caption:** *Figure 16: Business Reports & Highlights with period filters and category performance charts.*
- **System Description:** Strategic reporting dashboard. Features reporting period toggles (Week, Month, Year), sales revenue performance curves, bar charts showing inventory distribution by category, and key metrics including Average Order Value, Customer Retention, and Stock Alerts.
