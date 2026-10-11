# ShopEase: Full-Stack E-Commerce & Inventory Management Platform

ShopEase is a responsive, modern full-stack e-commerce web platform and automated inventory management system powered by **React (TanStack Router & Vite)**, **Node.js & Express**, and **PostgreSQL**.

---

## 🏗️ System Architecture

- **Presentation Tier (`shopeasy-frontend/`):** React 19, TanStack Router, Tailwind CSS, Radix UI, Recharts. Features distinct, isolated interfaces for Retail Customers and Store Administrators.
- **Application Tier (`server.js`):** Node.js and Express REST API supporting complete CRUD operations, parameter binding, and PostgreSQL connection pooling (`pg`).
- **Persistence Tier (`Database_Project.sql`):** 11 relational tables in 3NF, automated inventory decrement/prevent triggers, reporting views, and atomic checkout stored procedure (`CheckoutCart`).
- **Academic Submission Suite (`project-submission/`):** Complete test execution report (33 test cases, 100% pass), SQL queries & live outputs, 16 high-resolution 1080p figures, and full narrated video demonstration.

---

## 📁 Repository Structure

```
├── Database_Project.sql       # PostgreSQL DDL, DML, Views, Triggers & Procedures
├── server.js                  # Express backend REST API
├── package.json               # Backend dependencies
├── frontend-export/           # API contract documentation and models
├── shopeasy-frontend/         # Modern React/Vite/TanStack frontend application
│   ├── src/routes/            # Type-safe file routes (Customer Store + Admin Workspace)
│   ├── src/components/        # Store and Dashboard UI components
│   └── vite.config.ts         # Vite bundler configuration
└── project-submission/        # Academic presentation and evaluation deliverables
    ├── video/                 # 1080p narrated MP4 demonstration video
    ├── screenshots/           # 16 High-res 1920x1080 screenshots of every page
    └── documents/             # Explanation script, testing report, SQL results, figures catalog
```

---

## 🚀 How to Run the Project Locally

### 1. Database Setup (PostgreSQL)
1. Ensure PostgreSQL is running locally on port `5432`.
2. Create a database named `ShopEasy`:
   ```sql
   CREATE DATABASE "ShopEasy";
   ```
3. Execute `Database_Project.sql` to initialize tables, views, triggers, and seed records.

### 2. Backend Setup
1. Configure `.env` in the root directory:
   ```env
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=ShopEasy
   DB_PORT=5432
   PORT=3000
   ```
2. Install dependencies and start the backend:
   ```bash
   npm install
   node server.js
   ```
   *The backend will be live on `http://localhost:3000`.*

### 3. Frontend Setup
1. Open a new terminal in the `shopeasy-frontend` directory:
   ```bash
   cd shopeasy-frontend
   npm install
   npm run dev
   ```
2. Open your browser:
   - **Customer Storefront:** `http://localhost:8080/`
   - **Admin Workspace:** `http://localhost:8080/admin`
   - **Admin Login:** Email: `admin@shopease.com` | Password: `admin123`

---

## 🧪 Testing & Verification
- **Automated Test Results:** View [`project-submission/documents/02_TESTING_AND_VALIDATION_REPORT.md`](project-submission/documents/02_TESTING_AND_VALIDATION_REPORT.md).
- **SQL Execution Log:** View [`project-submission/documents/03_SQL_QUERIES_AND_EXECUTION_RESULTS.md`](project-submission/documents/03_SQL_QUERIES_AND_EXECUTION_RESULTS.md).
- **Demonstration Video:** Located at [`project-submission/video/ShopEase_Project_Demonstration_1080p.mp4`](project-submission/video/ShopEase_Project_Demonstration_1080p.mp4).
