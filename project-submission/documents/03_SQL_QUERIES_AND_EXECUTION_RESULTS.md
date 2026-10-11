# ShopEase E-Commerce System: SQL Queries & Execution Results

**Database Engine:** PostgreSQL 16 / 17  
**Database Name:** `ShopEasy`  
**Host:** Localhost (`5432`)  
**Execution Timestamp:** 2026-10-11T17:00:11.458Z  

---

## 1. Database Schema & Table Structures

The system implements a normalized 3NF relational database schema with referential integrity constraints, primary keys, foreign keys, cascade rules, and check constraints.

### 1.1 Table Inventory & Record Counts

| Table Name | Entity Description | Live Record Count |
|---|---|---|
| `admin` | Relational Entity | **1** |
| `cart` | Relational Entity | **1** |
| `cart_item` | Relational Entity | **0** |
| `category` | Relational Entity | **5** |
| `customer` | Relational Entity | **6** |
| `order_item` | Relational Entity | **15** |
| `orders` | Relational Entity | **4** |
| `payment` | Relational Entity | **4** |
| `product` | Relational Entity | **7** |
| `product_review` | Relational Entity | **0** |
| `supplier` | Relational Entity | **3** |

---

## 2. DDL & Constraints Verification

### Table Constraints (PK, FK, CHECK, UNIQUE)

| Table | Constraint Name | Type | Definition |
|---|---|---|---|
| `admin` | `admin_name_not_null` | **n** | `NOT NULL name` |
| `admin` | `admin_admin_id_not_null` | **n** | `NOT NULL admin_id` |
| `admin` | `admin_email_not_null` | **n** | `NOT NULL email` |
| `admin` | `admin_password_not_null` | **n** | `NOT NULL password` |
| `admin` | `admin_pkey` | **PRIMARY KEY** | `PRIMARY KEY (admin_id)` |
| `admin` | `admin_email_key` | **UNIQUE** | `UNIQUE (email)` |
| `cart` | `cart_customer_id_fkey` | **FOREIGN KEY** | `FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE` |
| `cart` | `cart_customer_id_not_null` | **n** | `NOT NULL customer_id` |
| `cart` | `cart_cart_id_not_null` | **n** | `NOT NULL cart_id` |
| `cart` | `cart_pkey` | **PRIMARY KEY** | `PRIMARY KEY (cart_id)` |
| `cart_item` | `cart_item_quantity_check` | **CHECK** | `CHECK ((quantity > 0))` |
| `cart_item` | `cart_item_product_id_fkey` | **FOREIGN KEY** | `FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE` |
| `cart_item` | `cart_item_cart_id_fkey` | **FOREIGN KEY** | `FOREIGN KEY (cart_id) REFERENCES cart(cart_id) ON DELETE CASCADE` |
| `cart_item` | `cart_item_cart_id_not_null` | **n** | `NOT NULL cart_id` |
| `cart_item` | `cart_item_quantity_not_null` | **n** | `NOT NULL quantity` |
| `cart_item` | `cart_item_product_id_not_null` | **n** | `NOT NULL product_id` |
| `cart_item` | `cart_item_pkey` | **PRIMARY KEY** | `PRIMARY KEY (cart_id, product_id)` |
| `category` | `category_category_id_not_null` | **n** | `NOT NULL category_id` |
| `category` | `category_category_name_not_null` | **n** | `NOT NULL category_name` |
| `category` | `category_pkey` | **PRIMARY KEY** | `PRIMARY KEY (category_id)` |
| `category` | `category_category_name_key` | **UNIQUE** | `UNIQUE (category_name)` |
| `customer` | `customer_password_not_null` | **n** | `NOT NULL password` |
| `customer` | `customer_name_not_null` | **n** | `NOT NULL name` |
| `customer` | `customer_email_not_null` | **n** | `NOT NULL email` |
| `customer` | `customer_customer_id_not_null` | **n** | `NOT NULL customer_id` |
| `customer` | `customer_pkey` | **PRIMARY KEY** | `PRIMARY KEY (customer_id)` |
| `customer` | `customer_email_key` | **UNIQUE** | `UNIQUE (email)` |
| `order_item` | `order_item_price_check` | **CHECK** | `CHECK ((price >= (0)::numeric))` |
| `order_item` | `order_item_quantity_check` | **CHECK** | `CHECK ((quantity > 0))` |
| `order_item` | `order_item_product_id_fkey` | **FOREIGN KEY** | `FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE RESTRICT` |
| `order_item` | `order_item_order_id_fkey` | **FOREIGN KEY** | `FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE` |
| `order_item` | `order_item_price_not_null` | **n** | `NOT NULL price` |
| `order_item` | `order_item_product_id_not_null` | **n** | `NOT NULL product_id` |
| `order_item` | `order_item_quantity_not_null` | **n** | `NOT NULL quantity` |
| `order_item` | `order_item_order_id_not_null` | **n** | `NOT NULL order_id` |
| `order_item` | `order_item_pkey` | **PRIMARY KEY** | `PRIMARY KEY (order_id, product_id)` |
| `orders` | `orders_status_check` | **CHECK** | `CHECK (((status)::text = ANY ((ARRAY['Pending'::character varying, 'Processing'::character varying, 'Shipped'::character varying, 'Delivered'::character varying, 'Cancelled'::character varying])::text[])))` |
| `orders` | `orders_customer_id_fkey` | **FOREIGN KEY** | `FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE` |
| `orders` | `orders_customer_id_not_null` | **n** | `NOT NULL customer_id` |
| `orders` | `orders_total_amount_not_null` | **n** | `NOT NULL total_amount` |
| `orders` | `orders_order_id_not_null` | **n** | `NOT NULL order_id` |
| `orders` | `orders_pkey` | **PRIMARY KEY** | `PRIMARY KEY (order_id)` |
| `payment` | `payment_payment_method_check` | **CHECK** | `CHECK (((payment_method)::text = ANY ((ARRAY['Credit Card'::character varying, 'Debit Card'::character varying, 'PayPal'::character varying, 'Net Banking'::character varying, 'Cash on Delivery'::character varying])::text[])))` |
| `payment` | `payment_amount_check` | **CHECK** | `CHECK ((amount >= (0)::numeric))` |
| `payment` | `payment_payment_status_check` | **CHECK** | `CHECK (((payment_status)::text = ANY ((ARRAY['Pending'::character varying, 'Completed'::character varying, 'Failed'::character varying, 'Refunded'::character varying])::text[])))` |
| `payment` | `payment_order_id_fkey` | **FOREIGN KEY** | `FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE` |
| `payment` | `payment_order_id_not_null` | **n** | `NOT NULL order_id` |
| `payment` | `payment_amount_not_null` | **n** | `NOT NULL amount` |
| `payment` | `payment_payment_id_not_null` | **n** | `NOT NULL payment_id` |
| `payment` | `payment_payment_method_not_null` | **n** | `NOT NULL payment_method` |
| `payment` | `payment_pkey` | **PRIMARY KEY** | `PRIMARY KEY (payment_id)` |
| `product` | `product_price_check` | **CHECK** | `CHECK ((price >= (0)::numeric))` |
| `product` | `product_stock_quantity_check` | **CHECK** | `CHECK ((stock_quantity >= 0))` |
| `product` | `product_supplier_id_fkey` | **FOREIGN KEY** | `FOREIGN KEY (supplier_id) REFERENCES supplier(supplier_id) ON DELETE SET NULL` |
| `product` | `product_category_id_fkey` | **FOREIGN KEY** | `FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE SET NULL` |
| `product` | `product_product_name_not_null` | **n** | `NOT NULL product_name` |
| `product` | `product_stock_quantity_not_null` | **n** | `NOT NULL stock_quantity` |
| `product` | `product_price_not_null` | **n** | `NOT NULL price` |
| `product` | `product_product_id_not_null` | **n** | `NOT NULL product_id` |
| `product` | `product_pkey` | **PRIMARY KEY** | `PRIMARY KEY (product_id)` |
| `product_review` | `product_review_rating_check` | **CHECK** | `CHECK (((rating >= 1) AND (rating <= 5)))` |
| `product_review` | `product_review_customer_id_fkey` | **FOREIGN KEY** | `FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE` |
| `product_review` | `product_review_product_id_fkey` | **FOREIGN KEY** | `FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE` |
| `product_review` | `product_review_review_id_not_null` | **n** | `NOT NULL review_id` |
| `product_review` | `product_review_customer_id_not_null` | **n** | `NOT NULL customer_id` |
| `product_review` | `product_review_product_id_not_null` | **n** | `NOT NULL product_id` |
| `product_review` | `product_review_rating_not_null` | **n** | `NOT NULL rating` |
| `product_review` | `product_review_pkey` | **PRIMARY KEY** | `PRIMARY KEY (review_id)` |
| `supplier` | `supplier_supplier_id_not_null` | **n** | `NOT NULL supplier_id` |
| `supplier` | `supplier_supplier_name_not_null` | **n** | `NOT NULL supplier_name` |
| `supplier` | `supplier_pkey` | **PRIMARY KEY** | `PRIMARY KEY (supplier_id)` |
| `supplier` | `supplier_email_key` | **UNIQUE** | `UNIQUE (email)` |

---

## 3. Core SQL Queries & Actual Execution Outputs

### Query 1: Retrieve Live Product Catalog with Category Names (JOIN)
**Purpose:** Powers the storefront catalog and admin inventory dashboard.

```sql
SELECT p.Product_ID, p.Product_Name, p.Price, p.Stock_Quantity, c.Category_Name 
FROM PRODUCT p
LEFT JOIN CATEGORY c ON p.Category_ID = c.Category_ID
ORDER BY p.Product_ID ASC;
```

**Actual Database Output (7 rows):**

| Product_ID | Product_Name | Price (₹) | Stock_Quantity | Category_Name |
|---|---|---|---|---|
| 1 | Smartphone X | ₹799.99 | 47 | Electronics |
| 2 | Laptop Pro | ₹1299.99 | 27 | Electronics |
| 3 | Men's T-Shirt | ₹19.99 | 197 | Clothing |
| 4 | Women's Jeans | ₹49.99 | 149 | Clothing |
| 5 | Coffee Maker | ₹89.99 | 38 | Home & Kitchen |
| 6 | Blender | ₹39.99 | 58 | Home & Kitchen |
| 7 | headset123 | ₹54000.00 | 2 | Electronics |

### Query 2: High-Level Sales & Revenue Aggregation (Aggregates)
**Purpose:** Calculates executive KPIs for the Admin Overview and Reports tabs.

```sql
SELECT 
    COUNT(o.Order_ID) AS Total_Orders,
    COALESCE(SUM(o.Total_Amount), 0.00) AS Total_Revenue,
    ROUND(AVG(o.Total_Amount), 2) AS Average_Order_Value,
    COUNT(DISTINCT o.Customer_ID) AS Unique_Ordering_Customers
FROM ORDERS o;
```

**Actual Database Output:**

| Total Orders | Total Revenue | Average Order Value | Unique Customers |
|---|---|---|---|
| **4** | **₹60669.86** | **₹15167.47** | **1** |

### Query 3: Multi-Table Orders with Line Items (STRING_AGG + JOIN)
**Purpose:** Renders the detailed Admin Orders table and Customer Order History.

```sql
SELECT 
    o.Order_ID,
    c.Name AS Customer_Name,
    o.Order_Date,
    o.Total_Amount,
    o.Status,
    COALESCE(STRING_AGG(p.Product_Name || ' (' || oi.Quantity || 'x)', ', '), 'No items') AS Ordered_Items
FROM ORDERS o
JOIN CUSTOMER c ON o.Customer_ID = c.Customer_ID
LEFT JOIN ORDER_ITEM oi ON o.Order_ID = oi.Order_ID
LEFT JOIN PRODUCT p ON oi.Product_ID = p.Product_ID
GROUP BY o.Order_ID, c.Name, o.Order_Date, o.Total_Amount, o.Status
ORDER BY o.Order_ID DESC;
```

**Actual Database Output (4 rows):**

| Order_ID | Customer_Name | Order_Date | Total_Amount | Status | Ordered_Items |
|---|---|---|---|---|---|
| #4 | John Doe | 10/11/2026 | ₹56229.96 | `Pending` | Coffee Maker (1x), headset123 (1x), Blender (1x), Laptop Pro (1x), Smartphone X (1x) |
| #3 | John Doe | 10/10/2026 | ₹59.98 | `Pending` | Blender (1x), Men's T-Shirt (1x) |
| #2 | John Doe | 10/10/2026 | ₹2259.95 | `Pending` | Men's T-Shirt (1x), Women's Jeans (1x), Coffee Maker (1x), Smartphone X (1x), Laptop Pro (1x) |
| #1 | John Doe | 10/9/2026 | ₹2119.97 | `Pending` | Smartphone X (1x), Men's T-Shirt (1x), Laptop Pro (1x) |

### Query 4: View Execution — `CustomerOrderSummary`
**Purpose:** Data abstraction layer providing per-customer order counts and lifetime expenditure.

```sql
SELECT * FROM CustomerOrderSummary ORDER BY Customer_ID ASC;
```

**Actual Database Output (6 rows):**

| Customer_ID | Name | Total_Orders | Total_Spent (₹) |
|---|---|---|---|
| 1 | John Doe | 4 | ₹60669.86 |
| 2 | Jane Smith | 0 | ₹0.00 |
| 3 | Alice Brown | 0 | ₹0.00 |
| 4 | Anugrah M Shibu | 0 | ₹0.00 |
| 5 | kuttan | 0 | ₹0.00 |
| 6 | Hello | 0 | ₹0.00 |

### Query 5: View Execution — `LowStockAlerts`
**Purpose:** Identifies inventory requiring restocking (stock < 20) with supplier contacts.

```sql
SELECT * FROM LowStockAlerts;
```

**Actual Database Output (0 rows):**

| Product_ID | Product_Name | Stock_Quantity | Supplier_Name | Contact_Number |
|---|---|---|---|---|

### Query 6: View Execution — `TopSellingProducts`
**Purpose:** Identifies top-performing products ranked by volume and revenue.

```sql
SELECT * FROM TopSellingProducts;
```

**Actual Database Output (0 rows):**

*Note: View aggregates completed orders with status `'Shipped'` or `'Delivered'`. Current sample orders are currently in `'Pending'` state, verifying accurate conditional logic filtering.*

---

## 4. Stored Procedures & Automated Triggers

### 4.1 Stored Procedure: `CheckoutCart`
The `CheckoutCart` procedure encapsulates the entire ordering workflow inside a single ACID-compliant transactional boundary:
1. Validates that the customer has an existing cart with items.
2. Sums total line item amounts.
3. Inserts an `ORDERS` record.
4. Copies `CART_ITEM` rows into `ORDER_ITEM`.
5. Inserts a successful `PAYMENT` record.
6. Automatically cleanses `CART_ITEM`.

```sql
CREATE OR REPLACE PROCEDURE CheckoutCart(
    p_Customer_ID INT,
    p_Payment_Method VARCHAR,
    INOUT p_Order_ID INT DEFAULT NULL
)
LANGUAGE plpgsql AS $$ ... $$;
```

### 4.2 Automated Stock Triggers:
1. **`trg_BeforeOrderItemInsert`**: Fires `BEFORE INSERT ON ORDER_ITEM`. Verifies available stock against requested quantity and raises an exception (`'Insufficient stock for this product.'`) if stock is insufficient.
2. **`trg_AfterOrderItemInsert`**: Fires `AFTER INSERT ON ORDER_ITEM`. Automatically executes `UPDATE PRODUCT SET Stock_Quantity = Stock_Quantity - NEW.Quantity` to synchronize inventory across concurrent users.
