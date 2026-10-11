-- ==========================================
-- E-Commerce Database Management System
-- PostgreSQL Relational Schema & Logic
-- ==========================================

-- Note: Run this script inside your desired database (e.g. ShopEasy).
-- Do not use CREATE DATABASE or USE here in PostgreSQL.

-- Drop existing tables to allow re-running the script cleanly
DROP TABLE IF EXISTS PRODUCT_REVIEW CASCADE;
DROP TABLE IF EXISTS PAYMENT CASCADE;
DROP TABLE IF EXISTS ORDER_ITEM CASCADE;
DROP TABLE IF EXISTS ORDERS CASCADE;
DROP TABLE IF EXISTS CART_ITEM CASCADE;
DROP TABLE IF EXISTS CART CASCADE;
DROP TABLE IF EXISTS PRODUCT CASCADE;
DROP TABLE IF EXISTS SUPPLIER CASCADE;
DROP TABLE IF EXISTS CATEGORY CASCADE;
DROP TABLE IF EXISTS CUSTOMER CASCADE;

-- ==========================================
-- 1. DDL: Create Tables with Constraints
-- ==========================================

CREATE TABLE CATEGORY (
    Category_ID SERIAL PRIMARY KEY,
    Category_Name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE SUPPLIER (
    Supplier_ID SERIAL PRIMARY KEY,
    Supplier_Name VARCHAR(150) NOT NULL,
    Contact_Number VARCHAR(20),
    Email VARCHAR(150) UNIQUE,
    Address TEXT
);

CREATE TABLE PRODUCT (
    Product_ID SERIAL PRIMARY KEY,
    Product_Name VARCHAR(200) NOT NULL,
    Price DECIMAL(10,2) NOT NULL CHECK (Price >= 0),
    Description TEXT,
    Stock_Quantity INT NOT NULL CHECK (Stock_Quantity >= 0),
    Category_ID INT,
    Supplier_ID INT,
    FOREIGN KEY (Category_ID) REFERENCES CATEGORY(Category_ID) ON DELETE SET NULL,
    FOREIGN KEY (Supplier_ID) REFERENCES SUPPLIER(Supplier_ID) ON DELETE SET NULL
);

CREATE TABLE CUSTOMER (
    Customer_ID SERIAL PRIMARY KEY,
    Name VARCHAR(150) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE,
    Phone VARCHAR(20),
    Address TEXT,
    Password VARCHAR(255) NOT NULL
);

CREATE TABLE CART (
    Cart_ID SERIAL PRIMARY KEY,
    Customer_ID INT NOT NULL,
    Created_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Customer_ID) REFERENCES CUSTOMER(Customer_ID) ON DELETE CASCADE
);

CREATE TABLE CART_ITEM (
    Cart_ID INT,
    Product_ID INT,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    PRIMARY KEY (Cart_ID, Product_ID),
    FOREIGN KEY (Cart_ID) REFERENCES CART(Cart_ID) ON DELETE CASCADE,
    FOREIGN KEY (Product_ID) REFERENCES PRODUCT(Product_ID) ON DELETE CASCADE
);

CREATE TABLE ORDERS (
    Order_ID SERIAL PRIMARY KEY,
    Customer_ID INT NOT NULL,
    Order_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Total_Amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    Status VARCHAR(20) DEFAULT 'Pending' CHECK (Status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
    FOREIGN KEY (Customer_ID) REFERENCES CUSTOMER(Customer_ID) ON DELETE CASCADE
);

CREATE TABLE ORDER_ITEM (
    Order_ID INT,
    Product_ID INT,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    Price DECIMAL(10,2) NOT NULL CHECK (Price >= 0),
    PRIMARY KEY (Order_ID, Product_ID),
    FOREIGN KEY (Order_ID) REFERENCES ORDERS(Order_ID) ON DELETE CASCADE,
    FOREIGN KEY (Product_ID) REFERENCES PRODUCT(Product_ID) ON DELETE RESTRICT
);

CREATE TABLE PAYMENT (
    Payment_ID SERIAL PRIMARY KEY,
    Order_ID INT NOT NULL,
    Payment_Method VARCHAR(50) NOT NULL CHECK (Payment_Method IN ('Credit Card', 'Debit Card', 'PayPal', 'Net Banking', 'Cash on Delivery')),
    Payment_Status VARCHAR(20) DEFAULT 'Pending' CHECK (Payment_Status IN ('Pending', 'Completed', 'Failed', 'Refunded')),
    Payment_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Amount DECIMAL(10,2) NOT NULL CHECK (Amount >= 0),
    FOREIGN KEY (Order_ID) REFERENCES ORDERS(Order_ID) ON DELETE CASCADE
);

CREATE TABLE PRODUCT_REVIEW (
    Review_ID SERIAL PRIMARY KEY,
    Customer_ID INT NOT NULL,
    Product_ID INT NOT NULL,
    Rating INT NOT NULL CHECK (Rating BETWEEN 1 AND 5),
    Comment TEXT,
    Review_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Customer_ID) REFERENCES CUSTOMER(Customer_ID) ON DELETE CASCADE,
    FOREIGN KEY (Product_ID) REFERENCES PRODUCT(Product_ID) ON DELETE CASCADE
);

-- ==========================================
-- 2. DML: Insert Sample Data
-- ==========================================

INSERT INTO CATEGORY (Category_Name) VALUES 
('Electronics'), ('Clothing'), ('Home & Kitchen'), ('Books'), ('Sports');

INSERT INTO SUPPLIER (Supplier_Name, Contact_Number, Email, Address) VALUES 
('TechCorp', '1234567890', 'contact@techcorp.com', '123 Silicon Valley, CA'),
('FashionHub', '0987654321', 'sales@fashionhub.com', '456 Garment Dist, NY'),
('HomeEssentials', '1122334455', 'info@homeessentials.com', '789 Decor Blvd, TX');

INSERT INTO PRODUCT (Product_Name, Price, Description, Stock_Quantity, Category_ID, Supplier_ID) VALUES 
('Smartphone X', 799.99, 'Latest 5G smartphone', 50, 1, 1),
('Laptop Pro', 1299.99, 'High performance laptop', 30, 1, 1),
('Men''s T-Shirt', 19.99, 'Cotton casual t-shirt', 200, 2, 2),
('Women''s Jeans', 49.99, 'Blue denim jeans', 150, 2, 2),
('Coffee Maker', 89.99, 'Automatic coffee machine', 40, 3, 3),
('Blender', 39.99, 'High-speed blender', 60, 3, 3);

INSERT INTO CUSTOMER (Name, Email, Phone, Address, Password) VALUES 
('John Doe', 'john.doe@example.com', '555-1234', '10 Main St, City', 'hashed_pass_1'),
('Jane Smith', 'jane.smith@example.com', '555-5678', '20 Oak St, Town', 'hashed_pass_2'),
('Alice Brown', 'alice.b@example.com', '555-8765', '30 Pine St, Village', 'hashed_pass_3');

-- ==========================================
-- 3. VIEWS: Data Abstraction & Reporting
-- ==========================================

CREATE OR REPLACE VIEW CustomerOrderSummary AS
SELECT 
    c.Customer_ID,
    c.Name,
    COUNT(o.Order_ID) AS Total_Orders,
    COALESCE(SUM(o.Total_Amount), 0) AS Total_Spent
FROM CUSTOMER c
LEFT JOIN ORDERS o ON c.Customer_ID = o.Customer_ID
GROUP BY c.Customer_ID, c.Name;

CREATE OR REPLACE VIEW LowStockAlerts AS
SELECT 
    p.Product_ID,
    p.Product_Name,
    p.Stock_Quantity,
    s.Supplier_Name,
    s.Contact_Number
FROM PRODUCT p
JOIN SUPPLIER s ON p.Supplier_ID = s.Supplier_ID
WHERE p.Stock_Quantity < 20;

CREATE OR REPLACE VIEW TopSellingProducts AS
SELECT 
    p.Product_ID,
    p.Product_Name,
    SUM(oi.Quantity) AS Total_Sold,
    SUM(oi.Quantity * oi.Price) AS Total_Revenue
FROM PRODUCT p
JOIN ORDER_ITEM oi ON p.Product_ID = oi.Product_ID
JOIN ORDERS o ON oi.Order_ID = o.Order_ID
WHERE o.Status IN ('Shipped', 'Delivered')
GROUP BY p.Product_ID, p.Product_Name
ORDER BY Total_Sold DESC;

-- ==========================================
-- 4. TRIGGERS: Automated Business Logic
-- ==========================================

-- Trigger 1: Update Stock After Order Insertion
CREATE OR REPLACE FUNCTION trg_after_order_item_insert_func()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE PRODUCT 
    SET Stock_Quantity = Stock_Quantity - NEW.Quantity 
    WHERE Product_ID = NEW.Product_ID;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_AfterOrderItemInsert
AFTER INSERT ON ORDER_ITEM
FOR EACH ROW
EXECUTE FUNCTION trg_after_order_item_insert_func();

-- Trigger 2: Prevent Negative Stock (Check before order)
CREATE OR REPLACE FUNCTION trg_before_order_item_insert_func()
RETURNS TRIGGER AS $$
DECLARE 
    current_stock INT;
BEGIN
    SELECT Stock_Quantity INTO current_stock FROM PRODUCT WHERE Product_ID = NEW.Product_ID;
    
    IF current_stock < NEW.Quantity THEN
        RAISE EXCEPTION 'Insufficient stock for this product.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_BeforeOrderItemInsert
BEFORE INSERT ON ORDER_ITEM
FOR EACH ROW
EXECUTE FUNCTION trg_before_order_item_insert_func();

-- ==========================================
-- 5. STORED PROCEDURES: Transaction Management
-- ==========================================

CREATE OR REPLACE PROCEDURE CheckoutCart(
    p_Customer_ID INT,
    p_Payment_Method VARCHAR,
    INOUT p_Order_ID INT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_Cart_ID INT;
    v_Total_Amount DECIMAL(10,2) := 0;
BEGIN
    -- 1. Get the Customer's Cart
    SELECT Cart_ID INTO v_Cart_ID 
    FROM CART 
    WHERE Customer_ID = p_Customer_ID 
    LIMIT 1;

    IF v_Cart_ID IS NULL THEN
        RAISE EXCEPTION 'Cart not found for customer.';
    END IF;

    -- 2. Calculate Total Amount
    SELECT COALESCE(SUM(ci.Quantity * p.Price), 0) INTO v_Total_Amount
    FROM CART_ITEM ci
    JOIN PRODUCT p ON ci.Product_ID = p.Product_ID
    WHERE ci.Cart_ID = v_Cart_ID;

    IF v_Total_Amount = 0 THEN
        RAISE EXCEPTION 'Cart is empty.';
    END IF;

    -- 3. Create Order
    INSERT INTO ORDERS (Customer_ID, Total_Amount, Status)
    VALUES (p_Customer_ID, v_Total_Amount, 'Pending')
    RETURNING Order_ID INTO p_Order_ID;

    -- 4. Move Cart Items to Order Items
    INSERT INTO ORDER_ITEM (Order_ID, Product_ID, Quantity, Price)
    SELECT p_Order_ID, ci.Product_ID, ci.Quantity, p.Price
    FROM CART_ITEM ci
    JOIN PRODUCT p ON ci.Product_ID = p.Product_ID
    WHERE ci.Cart_ID = v_Cart_ID;

    -- 5. Process Payment
    INSERT INTO PAYMENT (Order_ID, Payment_Method, Payment_Status, Amount)
    VALUES (p_Order_ID, p_Payment_Method, 'Completed', v_Total_Amount);

    -- 6. Clear Cart
    DELETE FROM CART_ITEM WHERE Cart_ID = v_Cart_ID;
END;
$$;
