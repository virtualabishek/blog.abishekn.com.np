---
slug: postgresql-transactions-locking
title: "Understanding Transactions and Locking in PostgreSQL"
authors: [virtualabishek]
date: "2025-08-14"
description: "A deep dive into PostgreSQL transactions, error handling, savepoints, transactional DDLs, and locking with MVCC."
tags: [technical, postgresql, database]
hide_table_of_contents: true
---

# Understanding Transactions and Locking in PostgreSQL

This guide provides a comprehensive overview of transactions and locking mechanisms in PostgreSQL, based on provided examples and outputs. It covers transaction basics, error handling, savepoints, transactional DDLs, and basic locking with Multi-Version Concurrency Control (MVCC). The outputs from the provided examples are included to illustrate the behavior.

## Table of Contents

1. [Working with PostgreSQL Transactions](#working-with-postgresql-transactions)
2. [Handling Errors Inside a Transaction](#handling-errors-inside-a-transaction)
3. [Using SAVEPOINT](#using-savepoint)
4. [Transactional DDLs](#transactional-ddls)
5. [Understanding Basic Locking and MVCC](#understanding-basic-locking-and-mvcc)

## Working with PostgreSQL Transactions

In PostgreSQL, every operation is part of a transaction, even single statements. Transactions ensure data consistency and integrity.

### Key Functions for Timestamps

- **`now()`**: Returns the same timestamp for all statements within a transaction, ensuring consistency.

  - Example: Useful for logging actions with a consistent timestamp.
  - ```sql
    SELECT now(), now();
    ```
    Output:
    ```
               now                |               now
    ----------------------------------+----------------------------------
     2025-08-14 13:05:37.943104+05:45 | 2025-08-14 13:05:37.943104+05:45
    (1 row)
    ```
    - Both calls to `now()` return the same timestamp within a single transaction.

- **`clock_timestamp()`**: Returns the real-time timestamp for each call, even within the same transaction.
  - Example: Useful for measuring query execution time.
  - ```sql
    SELECT clock_timestamp();
    ```
    Output:
    ```
             clock_timestamp
    ----------------------------------
     2025-08-14 13:06:42.247353+05:45
    (1 row)
    ```

### Explicit Transactions

To group multiple statements into a single transaction, use the `BEGIN`, `COMMIT`, and `ROLLBACK` commands:

- **`BEGIN`**: Starts a transaction.
- **`COMMIT` or `END`**: Commits the transaction, making changes permanent.
- **`ROLLBACK` or `ABORT`**: Discards changes made in the transaction.
- Example:

  ```sql
  BEGIN;
  SELECT now();
  SELECT now();
  COMMIT;
  ```

  Output:

  ```
  BEGIN
               now
  ----------------------------------
   2025-08-14 13:11:50.579118+05:45
  (1 row)

               now
  ----------------------------------
   2025-08-14 13:11:50.579118+05:45
  (1 row)

  COMMIT
  ```

  - Both `now()` calls return the same timestamp, as they are part of the same transaction.

### Read-Only Transactions

Set a transaction to read-only to prevent modifications:

- ```sql
  SHOW transaction_read_only;
  BEGIN TRANSACTION READ ONLY;
  SELECT 1;
  COMMIT AND CHAIN;
  SHOW transaction_read_only;
  COMMIT;
  ```

  Output:

  ```
   transaction_read_only
  -----------------------
   off
  (1 row)

  BEGIN
   ?column?
  ----------
          1
  (1 row)

  COMMIT
   transaction_read_only
  -----------------------
   on
  (1 row)

  COMMIT
  ```

  - Initially, `transaction_read_only` is `off` (read/write mode).
  - `BEGIN TRANSACTION READ ONLY` sets it to `on`.
  - `COMMIT AND CHAIN` commits the transaction and starts a new one with the same read-only property.

To get help for commands in `psql`:

- ```sql
  \h COMMIT;
  ```

  Output:

  ```
  Command:     COMMIT
  Description: commit the current transaction
  Syntax:
  COMMIT [ WORK | TRANSACTION ] [ AND [ NO ] CHAIN ]
  URL: https://www.postgresql.org/docs/16/sql-commit.html
  ```

- ```sql
  \h ROLLBACK;
  ```
  Output:
  ```
  Command:     ROLLBACK
  Description: abort the current transaction
  Syntax:
  ROLLBACK [ WORK | TRANSACTION ] [ AND [ NO ] CHAIN ]
  URL: https://www.postgresql.org/docs/16/sql-rollback.html
  ```

## Handling Errors Inside a Transaction

If an error occurs within a transaction, PostgreSQL aborts the transaction, and subsequent commands are ignored until the transaction is rolled back or committed.

- Example:

  ```sql
  BEGIN;
  SELECT 1;
  SELECT 1/0;
  SELECT 2;
  COMMIT;
  ```

  Output:

  ```
  BEGIN
   ?column?
  ----------
          1
  (1 row)

  ERROR:  division by zero
  ERROR:  current transaction is aborted, commands ignored until end of transaction block
  ROLLBACK
  ```

  - The `division by zero` error aborts the transaction.
  - The subsequent `SELECT 2` is ignored until `ROLLBACK` resets the transaction state.
  - Use `ROLLBACK` to discard changes and recover from the error.

## Using SAVEPOINT

Savepoints allow partial rollbacks within a transaction, enabling recovery from errors without discarding all changes.

- Example:

  ```sql
  BEGIN;
  SELECT 1;
  SAVEPOINT a;
  SELECT 2/0;
  ROLLBACK TO SAVEPOINT a;
  SELECT 2;
  SELECT 3;
  COMMIT;
  ```

  Output:

  ```
  BEGIN
   ?column?
  ----------
          1
  (1 row)

  SAVEPOINT
  ERROR:  division by zero
  ERROR:  current transaction is aborted, commands ignored until end of transaction block
  ROLLBACK
   ?column?
  ----------
          2
  (1 row)

   ?column?
  ----------
          3
  (1 row)

  COMMIT
  ```

  - `SAVEPOINT a` marks a point in the transaction.
  - After the `division by zero` error, `ROLLBACK TO SAVEPOINT a` reverts to the state at `a`.
  - Subsequent commands (`SELECT 2`, `SELECT 3`) execute successfully.
  - Use `RELEASE SAVEPOINT <name>` to remove a savepoint if no longer needed.

## Transactional DDLs

PostgreSQL supports transactional Data Definition Language (DDL) operations, meaning DDL commands (e.g., `CREATE TABLE`, `ALTER TABLE`) can be rolled back if the transaction fails.

- Example:

  ```sql
  BEGIN;
  CREATE TABLE testme (id int);
  ALTER TABLE testme ALTER COLUMN id TYPE int8;
  CREATE TABLE testme2 (name VARCHAR(20));
  ALTER TABLE testme2 ALTER COLUMN name TYPE VARCHAR(50);
  \d testme;
  \d testme2;
  ROLLBACK;
  \d testme;
  ```

  Output:

  ```
  BEGIN
  CREATE TABLE
  ALTER TABLE
  CREATE TABLE
  ALTER TABLE
                Table "public.testme"
   Column |  Type  | Collation | Nullable | Default
  --------+--------+-----------+----------+---------
   id     | bigint |           |          |

                     Table "public.testme2"
   Column |         Type          | Collation | Nullable | Default
  --------+-----------------------+-----------+----------+---------
   name   | character varying(50) |           |          |

  ROLLBACK
  Did not find any relation named "testme".
  ```

  - The tables `testme` and `testme2` are created and modified within the transaction.
  - After `ROLLBACK`, both tables are removed, as the transaction was not committed.
  - The final `\d testme;` confirms the table no longer exists.

## Understanding Basic Locking and MVCC

PostgreSQL uses **Multi-Version Concurrency Control (MVCC)** to handle concurrent transactions, ensuring that read operations do not block write operations and vice versa.

### Example: Concurrent Read and Write

- **Transaction 1**:

  ```sql
  BEGIN;
  SELECT * FROM testme;
  UPDATE testme SET id = id + 1 RETURNING *;
  COMMIT;
  ```

  Output:

  ```
  BEGIN
   id
  ----
    0
  (1 row)

   id
  ----
    1
  (1 row)

  UPDATE 1
  COMMIT
  ```

- **Transaction 2** (concurrent):

  ```sql
  BEGIN;
  SELECT * FROM testme;
  COMMIT;
  ```

  Output:

  ```
  BEGIN
   id
  ----
    0
  (1 row)

  COMMIT
  ```

  - Transaction 2 sees the data as it was before Transaction 1’s update (`id = 0`) due to MVCC.
  - Write transactions (e.g., `UPDATE`) do not block read transactions (e.g., `SELECT`).

### Concurrent Updates

When multiple transactions update the same table:

- **Transaction 1**:

  ```sql
  BEGIN;
  UPDATE testme SET id = id + 1 RETURNING *;
  UPDATE testme SET id = id + 1 RETURNING *;
  COMMIT;
  ```

  Output:

  ```
  BEGIN
   id
  ----
    2
  (1 row)

  UPDATE 1
   id
  ----
    3
  (1 row)

  UPDATE 1
  COMMIT
  ```

- **Transaction 2** (after Transaction 1 commits):

  ```sql
  BEGIN;
  UPDATE testme SET id = id + 1 RETURNING *;
  COMMIT;
  ```

  Output:

  ```
  BEGIN
   id
  ----
    4
  (1 row)

  UPDATE 1
  COMMIT
  ```

  - Transaction 2 updates the row after Transaction 1 commits, incrementing `id` to 4.
  - PostgreSQL locks only the rows affected by an `UPDATE`, allowing concurrent updates on different rows in the same table.
  - For example, with 1,000 rows, 1,000 concurrent updates can occur on different rows without conflict.

### Additional Example

- **Transaction**:
  ```sql
  BEGIN;
  SELECT * FROM testme;
  ```
  Output:
  ```
  BEGIN
   id
  ----
    1
  (1 row)
  ```

## Additional Notes

- Use `\h <command>` in `psql` to get help for commands like `SELECT`, `COMMIT`, or `ROLLBACK`.
- PostgreSQL’s MVCC ensures high concurrency by maintaining multiple versions of data, allowing readers to see a consistent snapshot without waiting for writers.
- Always commit or roll back transactions explicitly to avoid leaving connections in an aborted state.
- The note "aba jaba, transaction 1 commit vayo, ani transaction 2 update huncha" translates to "now then, transaction 1 is committed, and transaction 2 updates" in Nepali, indicating the sequence of commits and updates.

For more details, refer to the [PostgreSQL documentation](https://www.postgresql.org/docs/16/index.html).
