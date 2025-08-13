---
slug: database-comparision
title: "Database Comparision between PostgreSQL, MySQL, Oracle, MS SQL Server"
authors: [virtualabishek]
date: "2025-08-13"
description: "I explored different database and compared with each other. I also tested PostgreSQL for its size and time for the 100000 tuples"

tags: [technical, linux, development]
---

# Database Comparison and Accounting System for Nepali Context

This project explores database options for small to medium-sized enterprises (SMEs), startups, and academic projects in Nepal, with a focus on building a scalable accounting system. I’ve compared popular databases and implemented an accounting system using PostgreSQL, including a Python script to generate and load 10,000 transaction records. This is tailored for contexts like ABC Warehouse, where I study, to estimate storage and performance needs.

---

## Why This Project?

In Nepal, startups, colleges, and SMEs need cost-effective, scalable databases for applications like accounting systems. I’ve compared PostgreSQL, MySQL, MS SQL Server, and Oracle, and built a practical accounting system with storage estimates and performance tests. PostgreSQL is my top choice due to its power, flexibility, and zero licensing cost, perfect for Nepali use cases.

---

## Database Comparison

Here’s a friendly breakdown of the databases I considered, with pros, cons, and use cases for Nepali users:

### PostgreSQL

**“The modern, feature-rich open-source option — great for new, technically-savvy teams.”**

- **Pros**:
  - No licensing cost, ideal for startups and colleges.
  - Advanced SQL features (window functions, CTEs, partitioning).
  - JSONB for flexible schemas (SQL + NoSQL).
  - PostGIS for geospatial apps (e.g., nearest hospital or delivery routing).
  - Strong concurrency with MVCC (Multi-Version Concurrency Control) for heavy read/write apps.
  - Easy to deploy on VPS or managed services (AWS RDS, DigitalOcean, Aiven).
- **Cons**: Slightly steeper learning curve than MySQL for admin tasks; less common in some regulated industries (e.g., finance/healthcare).
- **Use When**: You want power without cost, especially for modern web apps, analytics, or geospatial projects.

### MySQL (Community)

**“Simple, common, and cheap — great for small or legacy web apps.”**

- **Pros**: Easy to find cheap hosting; widely used in PHP-based apps (LAMP stack).
- **Cons**: Fewer advanced features compared to PostgreSQL or Oracle; often limited to simpler or legacy systems.
- **Use When**: You’re on shared hosting or building simple PHP-based apps with minimal cost.

### MS SQL Server

**“The comfortable, enterprise choice for Windows/.NET shops.”**

- **Pros**: Easy to learn, great GUI tools (SSMS), automation-friendly, common in business settings.
- **Cons**: Expensive licensing for large deployments (Express edition is free for small projects); often tied to Windows Server costs.
- **Use When**: Your organization uses the Microsoft stack or needs fast onboarding for DBAs.

### Oracle

**“The power tool — huge feature set and top pay, but steep learning and cost.”**

- **Pros**: Extremely powerful for large, mission-critical systems; top-tier enterprise features.
- **Cons**: Expensive and complex licensing; steep learning curve; often requires dedicated DBAs.
- **Use When**: Large enterprises (banks, telecoms, ERP systems) with big budgets and existing Oracle setups.

**Recommendation for Nepali Context**: I recommend **PostgreSQL** for most startups, colleges, and SMEs due to its power, flexibility, and no licensing cost. Use MySQL for cheap hosting or legacy PHP apps, MS SQL Server for Microsoft-heavy environments, and Oracle only for large enterprise needs.

---

## Accounting System Database Design

I designed a simple accounting system for a college like ABC Warehouse, focusing on scalability and performance. The system tracks **transactions**, **students**, **invoices**, and **invoice line items**. Below is the schema and storage estimation.

### Schema Overview

#### Transactions Table

Stores journal entries for accounting (e.g., date, particulars, credit, debit).

```sql
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    particulars VARCHAR(200) NOT NULL,
    credit NUMERIC(12,2) DEFAULT 0,
    debit NUMERIC(12,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Students Table

Stores student information for invoicing.

```sql
CREATE TABLE students (
    student_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Invoices Table

Tracks invoices issued to students.

```sql
CREATE TABLE invoices (
    invoice_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(student_id),
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    total_amount NUMERIC(12,2) NOT NULL,
    paid_amount NUMERIC(12,2) DEFAULT 0,
    balance_due NUMERIC(12,2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Invoice Line Items Table

Details items in each invoice (e.g., tuition fees, lab fees).

```sql
CREATE TABLE invoice_line_items (
    line_id SERIAL PRIMARY KEY,
    invoice_id INT REFERENCES invoices(invoice_id),
    item_name VARCHAR(50) NOT NULL,
    description TEXT,
    quantity INT NOT NULL,
    unit_price NUMERIC(12,2) NOT NULL,
    amount NUMERIC(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Storage Estimation

I estimated storage needs for the accounting system based on **10 transactions/day**, **10 students/day**, and **10 invoices/day** with **3 line items per invoice**. Here’s the breakdown:

#### Transactions Table

- **Fields**: id (4 bytes), date (4 bytes), particulars (200 bytes), credit (8 bytes), debit (8 bytes), created_at (8 bytes), updated_at (8 bytes).
- **Total per row**: 236 bytes + 27 bytes (PostgreSQL overhead) ≈ **263 bytes**.
- **Daily**: 10 transactions × 263 bytes = **2.57 KB**.
- **Monthly**: 30 days × 2.57 KB ≈ **77.1 KB**.
- **Yearly**: 360 days × 2.57 KB ≈ **925 KB**.

#### Students Table

- **Fields**: student_id (4 bytes), name (100 bytes), email (50 bytes), phone (15 bytes), created_at (8 bytes), updated_at (8 bytes).
- **Total per row**: 185 bytes + 27 bytes (overhead) ≈ **212 bytes**.
- **Daily**: 10 students × 212 bytes ≈ **2.07 KB**.
- **Monthly**: 30 days × 2.07 KB ≈ **62.1 KB**.
- **Yearly**: 360 days × 2.07 KB ≈ **746 KB**.

#### Invoices Table

- **Fields**: invoice_id (4 bytes), student_id (4 bytes), issue_date (4 bytes), due_date (4 bytes), total_amount (8 bytes), paid_amount (8 bytes), balance_due (8 bytes), status (20 bytes), created_at (8 bytes), updated_at (8 bytes).
- **Total per row**: 76 bytes + 23 bytes (overhead) ≈ **99 bytes**.
- **Daily**: 10 invoices × 99 bytes ≈ **0.97 KB**.
- **Monthly**: 30 days × 0.97 KB ≈ **29.1 KB**.
- **Yearly**: 360 days × 0.97 KB ≈ **349 KB**.

#### Invoice Line Items Table

- **Fields**: line_id (4 bytes), invoice_id (4 bytes), item_name (50 bytes), description (200 bytes), quantity (4 bytes), unit_price (8 bytes), amount (8 bytes), created_at (8 bytes), updated_at (8 bytes).
- **Total per row**: 294 bytes + 27 bytes (overhead) ≈ **321 bytes**.
- **Daily**: 10 invoices × 3 line items × 321 bytes ≈ **9.4 KB**.
- **Monthly**: 30 days × 9.4 KB ≈ **282 KB**.
- **Yearly**: 360 days × 9.4 KB ≈ **3.38 MB**.

#### Total Storage

- **Daily**: 2.57 KB (transactions) + 2.07 KB (students) + 0.97 KB (invoices) + 9.4 KB (line items) ≈ **12.44 KB/day**.
- **Monthly**: 12.44 KB × 30 ≈ **373 KB/month**.
- **Yearly**: 12.44 KB × 360 ≈ **4.48 MB/year**.

### Scalability Notes

- **PostgreSQL’s MVCC**: Handles high concurrency without locking, ideal for heavy read/write workloads (e.g., frequent transactions at a college).
- **Storage Growth**: Even with 360 transactions/year, the database size remains small (~4.48 MB/year), easily manageable on a VPS or managed service.
- **Performance**: Importing 100,000 transactions took ~204 ms, showing PostgreSQL’s efficiency for moderate workloads.
- **Balance Sheet Queries**: Use SQL aggregates (e.g., `SUM(credit)`, `SUM(debit)`) to generate balance sheets or trial balances.

---

## Generating and Loading Data with Python

To test the system’s performance, I wrote a Python script to generate 10,000 transaction records and load them into the `transactions` table. The script creates a tab-delimited CSV file (`transactions.txt`) and uses PostgreSQL’s `\copy` command to import the data efficiently.

### Python Script for Data Generation

```python
import csv
import random
from datetime import datetime, timedelta

# Generate 10,000 transaction records
num_records = 10000
start_date = datetime(2025, 1, 1)
particulars_list = ["Tuition Fee", "Lab Fee", "Library Fee", "Exam Fee", "Miscellaneous"]

with open('/tmp/transactions.txt', 'w', newline='') as f:
    writer = csv.writer(f, delimiter='\t')
    writer.writerow(['date', 'particulars', 'credit', 'debit'])  # CSV header
    for i in range(num_records):
        date = (start_date + timedelta(days=random.randint(0, 365))).strftime('%Y-%m-%d')
        particulars = random.choice(particulars_list)
        credit = round(random.uniform(0, 5000), 2) if random.random() > 0.5 else 0
        debit = round(random.uniform(0, 5000), 2) if credit == 0 else 0
        writer.writerow([date, particulars, credit, debit])

print(f"Generated {num_records} transaction records in /tmp/transactions.txt")
```

### Loading Data into PostgreSQL

I ran into some permission issues when trying to load the data initially (e.g., `Permission denied` for `/home/virtualabishek/Desktop/code/learning/postgres-notes/transactions.txt`). To fix this, I moved the file to `/tmp/` and used the `\copy` command, which is client-side and avoids server permission issues:

```sql
\copy transactions(date, particulars, credit, debit) FROM '/tmp/transactions.txt' DELIMITER E'\t' CSV HEADER;
```

This successfully loaded 100,000 records (I tested with a larger dataset to stress-test), taking ~204 ms, as shown in my terminal output:

```
COPY 100000
Time: 204.345 ms
```

### Lessons Learned

- **COPY vs. \copy**: I initially tried `COPY`, but got a `Permission denied` error because it runs server-side. Switching to `\copy` resolved this.
- **File Permissions**: Moving the file to `/tmp/` avoided permission issues, as `/tmp/` is accessible to the PostgreSQL client.
- **Performance**: Loading 100,000 records in ~204 ms shows PostgreSQL’s efficiency for bulk imports.

---

## Why PostgreSQL for This Project?

I chose PostgreSQL because:

- **No License Cost**: Perfect for budget-conscious Nepali startups and colleges.
- **Rich Data Types**: Supports JSONB for flexible schemas, GEOMETRY for geospatial queries (e.g., campus mapping), and NUMERIC for precise accounting.
- **Concurrency**: MVCC ensures readers and writers don’t block each other, ideal for busy systems.
- **Extensibility**: PostGIS for geospatial apps, full-text search, and more.
- **Deployment**: Easy to run on a VPS or use managed providers (AWS RDS, Aiven).

---

## Setup Instructions

1. **Install PostgreSQL**:

   - On Ubuntu: `sudo apt update && sudo apt install postgresql postgresql-contrib`
   - Verify: `psql --version`

2. **Create Database**:

   ```bash
   sudo -u postgres createdb accountdb
   ```

3. **Set Up Tables**:

   - Connect: `psql -d accountdb`
   - Run the `CREATE TABLE` statements above for `transactions`, `students`, `invoices`, and `invoice_line_items`.

4. **Generate Data**:

   - Run the Python script above to create `/tmp/transactions.txt` with 10,000 records.

5. **Import Data**:

   - Import:
     ```bash
     psql -d accountdb -c "\copy transactions(date, particulars, credit, debit) FROM '/tmp/transactions.txt' DELIMITER E'\t' CSV HEADER"
     ```

6. **Check Database Size**:

   ```sql
   SELECT pg_size_pretty(pg_database_size(current_database()));
   ```

   My test showed ~18 MB for the database with 100,000 transaction records.

7. **Monitor Performance**:
   - Enable timing: `\timing on`
   - Run imports or queries to measure execution time (e.g., ~204 ms for 100,000 records).

---

## Example Queries

- **List Transactions**:

  ```sql
  SELECT * FROM transactions LIMIT 10;
  ```

- **Calculate Balance Sheet**:

  ```sql
  SELECT SUM(credit) AS total_credit, SUM(debit) AS total_debit
  FROM transactions
  WHERE date BETWEEN '2025-01-01' AND '2025-12-31';
  ```

- **Find Unpaid Invoices**:
  ```sql
  SELECT i.invoice_id, s.name, i.total_amount, i.balance_due
  FROM invoices i
  JOIN students s ON i.student_id = s.student_id
  WHERE i.status = 'UNPAID';
  ```

---

## Future Improvements

- Add indexes on frequently queried columns (e.g., `date`, `student_id`) for faster searches.
- Implement triggers to auto-update `updated_at` timestamps.
- Use JSONB for flexible transaction metadata (e.g., store tax info).
- Explore PostGIS for campus-related geospatial queries (e.g., mapping student locations).
- Optimize the Python script to generate larger datasets or simulate realistic transaction patterns.

---

## Final Note

I built this accounting system to be lightweight (4.48 MB/year for 10 transactions/day), scalable, and cost-effective using PostgreSQL. The Python script made it easy to generate and load 10,000 records, and PostgreSQL’s performance (~204 ms for 100,000 records) proves it’s ready for real-world use. Let’s keep building awesome tech for Nepal!
