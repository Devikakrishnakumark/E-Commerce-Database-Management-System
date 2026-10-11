# ShopEasy API Contract

## Base URL
http://localhost:3000

## Authentication & Headers
- Currently, authentication is handled via simple DB queries.
- Frontend persists auth state in localStorage (user object containing { id, name, role }).
- Some endpoints hardcode customerId = 1 in the backend for demo purposes.
- All requests expecting JSON must include: Content-Type: application/json

---

## 1. Products

### GET /api/products
- **Description:** Fetch all available products joined with their category names.
- **Method:** GET
- **Response (200 OK):**
```json
[
  {
    "product_id": 1,
    "product_name": "Smartphone X",
    "price": "799.99",
    "description": "Latest 5G smartphone",
    "stock_quantity": 50,
    "category_name": "Electronics"
  }
]
```

### GET /api/products/top-selling
- **Description:** Fetch top 5 selling products based on order history view.
- **Method:** GET

---

## 2. Cart & Checkout

### POST /api/cart
- **Description:** Add a product to the cart.
- **Method:** POST
- **Request Payload:**
```json
{ "productId": 3, "quantity": 1 }
```

### GET /api/cart
- **Description:** Get all items in the user's cart.
- **Method:** GET
- **Response (200 OK):**
```json
[
  {
    "product_id": 1,
    "product_name": "Smartphone X",
    "price": "799.99",
    "quantity": 1,
    "total": "799.99"
  }
]
```

### POST /api/checkout
- **Description:** Process checkout via Postgres Stored Procedure.
- **Method:** POST
- **Request Payload:**
```json
{ "paymentMethod": "Credit Card" }
```

---

## 3. Orders
### GET /api/orders
- **Description:** Fetch order history for the current user.
- **Method:** GET
- **Response (200 OK):**
```json
[
  {
    "order_id": 1,
    "order_date": "2026-10-09T12:00:00.000Z",
    "total_amount": "799.99",
    "status": "Pending",
    "items": "Smartphone X, Laptop Pro"
  }
]
```

---

## 4. Authentication

### POST /api/register
- **Method:** POST
- **Request Payload:**
```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "securepass" }
```

### POST /api/login
- **Method:** POST
- **Request Payload:**
```json
{ "email": "jane@example.com", "password": "securepass" }
```

### POST /api/admin/login
- **Method:** POST
- **Request Payload:**
```json
{ "email": "admin@shopease.com", "password": "admin123" }
```
