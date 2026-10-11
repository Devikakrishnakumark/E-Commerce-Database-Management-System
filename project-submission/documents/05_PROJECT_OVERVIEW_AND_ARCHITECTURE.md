# ShopEase: Project Overview & System Architecture

**Project Title:** ShopEase Responsive Full-Stack E-Commerce & Inventory Management Platform  
**Architecture Model:** 3-Tier Client-Server Architecture (Presentation, Application, Persistence)  
**Academic Submission Level:** Computer Science / Information Technology Major Project  

---

## 1. System Architecture Overview

```mermaid
flowchart TD
    subgraph Presentation_Tier ["Presentation Tier (Frontend - Port 8080)"]
        UI_Store["Customer Storefront\n(Home, Products, Cart, Checkout, Orders)"]
        UI_Admin["Admin Management Workspace\n(Overview, Inventory, Orders, Customers, Reports)"]
        UI_Router["TanStack Router & Query\n(Client-side Routing, Cache, Role Isolation)"]
    end

    subgraph Application_Tier ["Application Tier (REST API - Port 3000)"]
        API_Server["Node.js / Express Server (server.js)"]
        API_Auth["Authentication Controllers\n(/api/login, /api/register, /api/admin/login)"]
        API_Products["Product & Inventory Controllers\n(GET, POST, PUT, DELETE /api/products)"]
        API_Cart["Cart & Checkout Engine\n(/api/cart, /api/checkout)"]
        API_Admin_Metrics["Admin Analytics Endpoints\n(/api/admin/stats, /api/admin/orders, /api/admin/customers)"]
    end

    subgraph Persistence_Tier ["Persistence Tier (Database - PostgreSQL 5432)"]
        DB_Postgres["PostgreSQL Database ('ShopEasy')"]
        DB_Tables["11 Relational Tables\n(CUSTOMER, ADMIN, PRODUCT, CATEGORY, SUPPLIER, CART, ORDERS...)"]
        DB_Views["Views\n(CustomerOrderSummary, LowStockAlerts, TopSellingProducts)"]
        DB_Triggers["Triggers\n(trg_BeforeOrderItemInsert, trg_AfterOrderItemInsert)"]
        DB_Procedure["Stored Procedure\n(CheckoutCart Transaction)"]
    end

    UI_Store -->|HTTP / JSON REST Requests| API_Server
    UI_Admin -->|HTTP / JSON REST Requests| API_Server
    API_Server -->|Connection Pool (pg)| DB_Postgres
```

---

## 2. Technology Stack Specification

| Component | Technology | Version | Purpose |
|---|---|---|---|
| **Database** | PostgreSQL | 16 / 17 | Relational persistence, constraints, triggers, procedures |
| **Backend Runtime** | Node.js | v26.x | Asynchronous JavaScript runtime environment |
| **Backend Framework** | Express.js | 4.x | REST API routing, CORS handling, middleware |
| **Database Client** | \`node-postgres\` (\`pg\`) | 8.x | PostgreSQL connection pooling and parameter binding |
| **Frontend Framework** | React | 19.x | Component-based interactive user interface |
| **Build & Dev Tool** | Vite | 8.x | Ultra-fast HMR and production bundle optimization |
| **Client Router** | TanStack Router | 1.x | Type-safe nested routing and layout management |
| **UI Component Library** | Radix UI & Tailwind CSS | 3.x / 4.x | Accessible primitives, responsive layouts, modals |
| **Chart Visualization** | Recharts & Lucide React | 2.x | Area charts, bar charts, and semantic iconography |

---

## 3. Relational Entity Relationship (ER) Summary

The persistence tier implements 11 primary tables:

1. **\`CATEGORY\`**: Holds merchandise classifications (*Electronics, Clothing, Home & Kitchen, Books, Sports*).
2. **\`SUPPLIER\`**: Vendors supplying merchandise with contact records.
3. **\`PRODUCT\`**: Catalog items with foreign keys to \`CATEGORY\` and \`SUPPLIER\`, and \`CHECK\` constraints enforcing non-negative price and stock.
4. **\`CUSTOMER\`**: Registered shoppers with unique email addresses and passwords.
5. **\`ADMIN\`**: Store management personnel with elevated system privileges.
6. **\`CART\`**: Customer shopping carts linked 1-to-1 with customers.
7. **\`CART_ITEM\`**: Line items currently staged in shopping carts, with composite primary key \`(Cart_ID, Product_ID)\`.
8. **\`ORDERS\`**: Master purchase records capturing order date, total amount, and status (*Pending, Processing, Shipped, Delivered, Cancelled*).
9. **\`ORDER_ITEM\`**: Immutable line items captured upon checkout, with composite primary key \`(Order_ID, Product_ID)\`.
10. **\`PAYMENT\`**: Payment records recording method, status, timestamp, and amount.
11. **\`PRODUCT_REVIEW\`**: Optional feedback and ratings (1–5) submitted by customers.

---

## 4. Key Engineering Highlights

1. **Transactional Integrity**: The checkout process is guaranteed through the PL/pgSQL stored procedure \`CheckoutCart\`. If inventory is insufficient, the transaction immediately rolls back without creating orphan orders.
2. **Automated Stock Synchronization**: Whenever an order item is inserted, database triggers update the inventory count automatically, ensuring zero race conditions between concurrent shoppers.
3. **Live Analytical Aggregation**: All metrics on the Admin Dashboard (Revenue, Order Count, Customer Lifetime Value) are computed directly through SQL aggregations rather than static dummy data.
4. **Isolated Dual Authentication**: Customers and Administrators maintain separate database tables, login routes, and session handlers to guarantee strict principle-of-least-privilege access.
