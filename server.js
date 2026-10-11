const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static HTML/CSS/JS files from the current directory
app.use(express.static(__dirname));

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION:', err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('UNHANDLED REJECTION:', reason);
});

// Database connection pool for PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
});

// Helper to check DB connection
pool.connect()
    .then(client => {
        console.log('✅ Connected to PostgreSQL database successfully.');
        client.release();
    })
    .catch(err => {
        console.error('❌ Failed to connect to the PostgreSQL database.');
        console.error(err.message);
    });

// ==========================================
// API Endpoints
// ==========================================

// 1. Get all products
app.get('/api/products', async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT p.Product_ID, p.Product_Name, p.Price, p.Description, p.Stock_Quantity, c.Category_Name 
            FROM PRODUCT p
            LEFT JOIN CATEGORY c ON p.Category_ID = c.Category_ID
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Get top-selling products (Using the View)
app.get('/api/products/top-selling', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM TopSellingProducts LIMIT 5');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Add to Cart (Mocking customer 1)
app.post('/api/cart', async (req, res) => {
    const { productId, quantity } = req.body;
    const customerId = 1; // Hardcoded for demo

    try {
        // Find or create cart
        let { rows: cartRows } = await pool.query('SELECT Cart_ID FROM CART WHERE Customer_ID = $1', [customerId]);
        let cartId;

        if (cartRows.length === 0) {
            const { rows: insertResult } = await pool.query('INSERT INTO CART (Customer_ID) VALUES ($1) RETURNING Cart_ID', [customerId]);
            cartId = insertResult[0].cart_id;
        } else {
            cartId = cartRows[0].cart_id;
        }

        // Insert into cart items, or update if exists
        await pool.query(`
            INSERT INTO CART_ITEM (Cart_ID, Product_ID, Quantity) 
            VALUES ($1, $2, $3) 
            ON CONFLICT (Cart_ID, Product_ID) 
            DO UPDATE SET Quantity = CART_ITEM.Quantity + EXCLUDED.Quantity
        `, [cartId, productId, quantity]);

        res.json({ message: 'Product added to cart successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Get Cart Items
app.get('/api/cart', async (req, res) => {
    const customerId = 1;
    try {
        const { rows } = await pool.query(`
            SELECT ci.Product_ID, p.Product_Name, p.Price, ci.Quantity, (p.Price * ci.Quantity) as Total
            FROM CART_ITEM ci
            JOIN CART c ON ci.Cart_ID = c.Cart_ID
            JOIN PRODUCT p ON ci.Product_ID = p.Product_ID
            WHERE c.Customer_ID = $1
        `, [customerId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. Checkout (Using Stored Procedure)
app.post('/api/checkout', async (req, res) => {
    const customerId = 1;
    const paymentMethod = req.body.paymentMethod || 'Credit Card';

    try {
        // Call the stored procedure
        // In PostgreSQL, calling a procedure with an INOUT parameter returns the OUT value as a row.
        const { rows } = await pool.query('CALL CheckoutCart($1, $2, NULL)', [customerId, paymentMethod]);
        
        res.json({ 
            message: 'Checkout successful!', 
            orderId: rows[0] ? rows[0].p_order_id : null
        });
    } catch (error) {
        console.error("Checkout Error:", error);
        res.status(500).json({ 
            error: error.message || 'Checkout failed due to an internal error or insufficient stock.' 
        });
    }
});

// 6. Get Orders
app.get('/api/orders', async (req, res) => {
    const customerId = 1;
    try {
        const { rows } = await pool.query(`
            SELECT o.Order_ID, o.Order_Date, o.Total_Amount, o.Status,
                   STRING_AGG(p.Product_Name, ', ') as Items
            FROM ORDERS o
            JOIN ORDER_ITEM oi ON o.Order_ID = oi.Order_ID
            JOIN PRODUCT p ON oi.Product_ID = p.Product_ID
            WHERE o.Customer_ID = $1
            GROUP BY o.Order_ID, o.Order_Date, o.Total_Amount, o.Status
            ORDER BY o.Order_Date DESC
        `, [customerId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 7. Register
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const { rows } = await pool.query(
            'INSERT INTO CUSTOMER (Name, Email, Password) VALUES ($1, $2, $3) RETURNING Customer_ID',
            [name, email, password]
        );
        res.json({ message: 'Registration Successful!', customerId: rows[0].customer_id });
    } catch (error) {
        res.status(500).json({ error: 'Email already exists or invalid data.' });
    }
});

// 8. Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const { rows } = await pool.query(
            'SELECT Customer_ID, Name FROM CUSTOMER WHERE Email = $1 AND Password = $2',
            [email, password]
        );
        if (rows.length > 0) {
            res.json({ message: 'Login Successful!', user: rows[0] });
        } else {
            res.status(401).json({ error: 'Invalid email or password.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 9. Admin Login
app.post('/api/admin/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const { rows } = await pool.query(
            'SELECT Admin_ID, Name FROM ADMIN WHERE Email = $1 AND Password = $2',
            [email, password]
        );
        if (rows.length > 0) {
            res.json({ message: 'Admin Login Successful!', user: { id: rows[0].admin_id, name: rows[0].name, role: 'admin' } });
        } else {
            res.status(401).json({ error: 'Invalid admin credentials.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 10. Add Product
app.post('/api/products', async (req, res) => {
    const { name, price, description, stock, category_id, supplier_id } = req.body;
    try {
        const { rows } = await pool.query(
            'INSERT INTO PRODUCT (Product_Name, Price, Description, Stock_Quantity, Category_ID, Supplier_ID) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, price, description || '', stock, category_id || null, supplier_id || null]
        );
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 11. Delete Product
app.delete('/api/products/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM PRODUCT WHERE Product_ID = $1', [req.params.id]);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// 12. Admin Stats
app.get('/api/admin/stats', async (req, res) => {
    try {
        const productsResult = await pool.query('SELECT COUNT(*) FROM PRODUCT');
        const ordersResult = await pool.query('SELECT COUNT(*), SUM(Total_Amount) FROM ORDERS');
        const usersResult = await pool.query('SELECT COUNT(*) FROM CUSTOMER');
        
        res.json({
            total_products: parseInt(productsResult.rows[0].count),
            total_orders: parseInt(ordersResult.rows[0].count),
            total_revenue: ordersResult.rows[0].sum ? parseFloat(ordersResult.rows[0].sum) : 0,
            total_customers: parseInt(usersResult.rows[0].count)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 13. Admin All Orders
app.get('/api/admin/orders', async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT o.Order_ID as order_id, o.Order_Date as order_date, o.Total_Amount as total_amount, o.Status as status, c.Name as customer_name,
                   COALESCE(STRING_AGG(p.Product_Name, ', '), 'Order items') as items
            FROM ORDERS o
            JOIN CUSTOMER c ON o.Customer_ID = c.Customer_ID
            LEFT JOIN ORDER_ITEM oi ON o.Order_ID = oi.Order_ID
            LEFT JOIN PRODUCT p ON oi.Product_ID = p.Product_ID
            GROUP BY o.Order_ID, o.Order_Date, o.Total_Amount, o.Status, c.Name
            ORDER BY o.Order_Date DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 14. Admin All Customers
app.get('/api/admin/customers', async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT c.Customer_ID as id, c.Name as name, c.Email as email, COALESCE(c.Address, 'Not specified') as city,
                   COUNT(o.Order_ID)::int as orders,
                   COALESCE(SUM(o.Total_Amount), 0)::float as spent
            FROM CUSTOMER c
            LEFT JOIN ORDERS o ON c.Customer_ID = o.Customer_ID
            GROUP BY c.Customer_ID, c.Name, c.Email, c.Address
            ORDER BY c.Customer_ID ASC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 15. Update Product
app.put('/api/products/:id', async (req, res) => {
    const { name, price, description, stock, category_id } = req.body;
    try {
        const { rows } = await pool.query(
            'UPDATE PRODUCT SET Product_Name = COALESCE($1, Product_Name), Price = COALESCE($2, Price), Description = COALESCE($3, Description), Stock_Quantity = COALESCE($4, Stock_Quantity), Category_ID = COALESCE($5, Category_ID) WHERE Product_ID = $6 RETURNING *',
            [name, price, description, stock, category_id, req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 16. Get Categories
app.get('/api/categories', async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT c.Category_ID as id, c.Category_Name as name,
                   COUNT(p.Product_ID)::int as product_count,
                   COALESCE(SUM(p.Stock_Quantity), 0)::int as total_stock
            FROM CATEGORY c
            LEFT JOIN PRODUCT p ON c.Category_ID = p.Category_ID
            GROUP BY c.Category_ID, c.Category_Name
            ORDER BY c.Category_ID ASC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Start the server
const http = require('http');
const server = http.createServer(app);
server.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});
