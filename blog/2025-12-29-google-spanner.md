---
slug: how-google-use-spanner-for-distributed-database-management
title: "Spanner - Google solution for distributed database in easier"
authors: [virtualabishek]
date: "2025-12-27"
description: "I explored the paper - Spanner: Google’s Globally Distributed Database. This blog contains about the spanner in easier way to those who wants to learn about it"

tags: [technical, database, distrubuted-database]

---

# Summary of Spanner: Google's Globally Distributed Database

**Overview:**
Spanner is Google's scalable, globally-distributed database that combines the benefits of traditional relational databases with massive scalability across datacenters worldwide.

**Key Features:**

1. **Global Distribution & Replication**
   - Shards data across multiple datacenters globally using Paxos consensus
   - Automatic failover and resharding
   - Configurable replication (typically 3-5 replicas)

2. **TrueTime API**
   - Novel time API that explicitly exposes clock uncertainty
   - Uses GPS and atomic clocks for synchronization
   - Typical uncertainty (ε) is 1-7ms
   - Enables strong consistency guarantees

3. **Transaction Support**
   - **External consistency** (linearizability) for distributed transactions
   - Lock-free snapshot transactions
   - Non-blocking reads in the past
   - Two-phase commit across Paxos groups

4. **Data Model**
   - Semi-relational tables with SQL-like query language
   - Hierarchical schema with directories as units of data placement
   - Versioned key-value storage with automatic timestamps

**Performance Highlights:**
- Write latency: ~15ms (including commit wait)
- Snapshot read latency: ~1.4ms
- Successfully handles datacenter failures with minimal disruption
- First major customer (F1 - Google's advertising backend) migrated from sharded MySQL

**Significance:**
First system to provide external consistency and globally-consistent reads at global scale, making it suitable for applications requiring strong consistency across continents.




## 1. **The Basic Problem Spanner Solves**

Imagine you have a banking app used worldwide. You need:
- **Data everywhere**: Users in Japan and USA both need fast access
- **Consistency**: If someone transfers money, both accounts must update correctly
- **Availability**: System must work even if a datacenter fails

Traditional databases struggle with this. Spanner solves it.

## 2. **Core Concepts**

### **A. Data Distribution (Sharding)**
Think of your data like a library:
- Instead of one giant building (single server), you have multiple branches (servers) worldwide
- Each branch holds certain books (data shards)
- Users go to their nearest branch for faster service

```text
User Data Split Across Servers:
Server 1 (USA): Users A-M
Server 2 (Europe): Users N-Z
Server 3 (Asia): Backup copies
```

### **B. Replication (Copies)**
- Each piece of data exists in **multiple locations** (typically 3-5 copies)
- If one datacenter fails, others keep working
- Like having backup copies of important documents in different safe deposit boxes

### **C. Paxos Consensus**
This is how servers **agree** on what data is correct:

```text
Simple Example:
1. Server A wants to write "Balance = $100"
2. It asks other servers: "Can I write this?"
3. Majority (3 out of 5) must agree
4. Once majority agrees, write is committed
5. All servers eventually get updated
```

## 3. **The TrueTime Innovation**

This is Spanner's "secret sauce" for handling time across the globe.

### **The Time Problem:**
```text
Server in USA: "Transaction happened at 10:00:00"
Server in Japan: "Transaction happened at 10:00:01"
But which really came first? Clocks aren't perfectly synchronized!
```

### **TrueTime Solution:**
Instead of saying "it's exactly 10:00:00", TrueTime says:
```text
"It's between 10:00:00.003 and 10:00:00.007"
(uncertainty range)
```

**How it works:**
- Uses GPS satellites and atomic clocks
- Admits uncertainty explicitly
- Waits out uncertainty when needed for correctness

```text
Example:
Transaction 1 commits at time [10:00:00.000 - 10:00:00.007]
Spanner waits until 10:00:00.007 passes
Then Transaction 2 can start at [10:00:00.008 - 10:00:00.015]
Now we KNOW Transaction 1 finished before Transaction 2 started!
```

## 4. **Transaction Types**

### **Read-Write Transactions** (Strong Consistency)
```text
Example: Transfer $50 from Account A to Account B

1. Lock both accounts
2. Read current balances
3. Calculate new balances
4. Get timestamp from TrueTime
5. Write changes to multiple servers (Paxos)
6. Wait for commit-wait (ensures ordering)
7. Release locks
```

### **Snapshot Transactions** (Read-Only, No Locks)
```text
Example: Generate monthly report

1. Pick a timestamp in the past (e.g., "end of last month")
2. Read data as it existed at that exact time
3. No locks needed - just reading history
4. Can read from any replica that's up-to-date
```

## 5. **Data Organization**

### **Directories**
Think of directories as folders that keep related data together:

```text
Directory for User "Alice":
├── Profile Info
├── Purchase History
└── Preferences

This whole directory:
- Stays together on same servers
- Moves as a unit if needed
- Can be replicated to different locations
```

### **Schema Example**
```sql
-- Users table
CREATE TABLE Users {
  user_id INT64,
  email STRING,
  name STRING
} PRIMARY KEY (user_id);

-- Orders table (nested under Users)
CREATE TABLE Orders {
  user_id INT64,
  order_id INT64,
  amount FLOAT
} PRIMARY KEY (user_id, order_id),
  INTERLEAVE IN PARENT Users;
```

The `INTERLEAVE` means orders are stored physically close to their user - faster queries!

## 6. **How a Write Works (Step-by-Step)**

```text
User wants to update their email:

1. REQUEST arrives at nearest Spanner server
   
2. SERVER identifies which Paxos group owns this data
   
3. LEADER of that group receives the request
   
4. ACQUIRE LOCKS on the data
   
5. PROPOSE change to other replicas via Paxos
   "I want to write: user_123.email = 'new@email.com'"
   
6. REPLICAS vote (need majority to agree)
   
7. TIMESTAMP assigned using TrueTime
   timestamp = TT.now().latest
   
8. COMMIT WAIT - wait until TT.after(timestamp) is true
   (ensures external consistency)
   
9. APPLY the change to all replicas
   
10. RELEASE LOCKS
    
11. RETURN success to user
```

## 7. **Key Benefits**

| Feature | What It Means |
|---------|---------------|
| **External Consistency** | Transactions appear in the order they actually happened in real time |
| **Global Availability** | Works even if entire datacenters fail |
| **SQL Support** | Use familiar database queries |
| **Automatic Scaling** | Add servers without downtime |
| **Strong Consistency** | No "eventual consistency" surprises |

## 8. **Real-World Example: Google's F1**

Google's advertising system uses Spanner:
- **Before**: Manually sharded MySQL (nightmare to manage)
- **After**: Spanner handles sharding automatically
- **Scale**: Tens of terabytes, millions of operations/second
- **Replication**: 5 replicas across US (2 west coast, 3 east coast)


