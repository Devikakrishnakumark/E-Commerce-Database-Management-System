# Frontend Component Map & User Flows

## Pages & Routes

### 1. Home Page (\`/\` or \`/index.html\`)
- **Core Components:** Hero Section, Featured Products Carousel, Top Categories.
- **Data Needs:** 
  - Top Selling Products (\`GET /api/products/top-selling\`)
  - All Products (\`GET /api/products\`) (if previewing more)
- **Actions:** Add to Cart, Search.

### 2. Products Page (\`/products.html\`)
- **Core Components:** Product Grid, Filters (Category, Price), Search Bar.
- **Data Needs:**
  - All Products (\`GET /api/products\`)
- **Actions:** Add to Cart, Filter, View Details.

### 3. Shopping Cart (\`/cart.html\`)
- **Core Components:** Cart Table (Items, Qty, Price, Total), Order Summary, Checkout Button.
- **Data Needs:**
  - Cart Items (\`GET /api/cart\`)
- **Actions:** Update Quantity (Mocked), Remove Item (Mocked), Proceed to Checkout.

### 4. Checkout Page (\`/checkout.html\`)
- **Core Components:** Shipping Form, Payment Method Dropdown, Order Summary Sidebar.
- **Data Needs:**
  - Cart Summary (\`GET /api/cart\`)
- **Actions:** Submit Order (\`POST /api/checkout\`).

### 5. Order History (\`/orders.html\`)
- **Core Components:** List/Grid of past orders with status badges.
- **Data Needs:**
  - Orders (\`GET /api/orders\`)
- **Actions:** View Order Details.

### 6. Authentication (\`/login.html\`, \`/register.html\`, \`/admin_login.html\`)
- **Core Components:** Auth Forms (Email, Password, Name).
- **Actions:** 
  - Login (\`POST /api/login\` or \`POST /api/admin/login\`)
  - Register (\`POST /api/register\`)
  - On success, store user in \`localStorage\` and redirect.

### 7. Admin Dashboard (\`/admin_dashboard.html\`)
- **Core Components:** Metrics (Total Sales, Total Users), Recent Orders Table, Inventory Management.
- **Data Needs:** (Future endpoints, currently mocked).
- **Guards:** Checks \`localStorage\` for \`role === 'admin'\`.

---

## Global State / Auth Flow
- The frontend stores the logged-in user in \`localStorage\` as a JSON string: \`{"id": 1, "name": "Jane", "role": "customer"}\`.
- The Header component conditionally renders:
  - If no user: Show "Login" (goes to login.html) and "Admin" (goes to admin_login.html).
  - If customer: Show "Logout (Name)", hide Admin button.
  - If admin: Show "Logout (Name)", hide Customer login button.
