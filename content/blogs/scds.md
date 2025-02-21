---
title: Slowly Changing Dimensions
date: Feb 21, 2025
author: Sujay Kapadnis
---
SCDs are dimensions that change over time, these changes are not very frequent. For example the price of the product, the change will usually happen because of the inflation.

# Types of SCDs

1. Multiple types of SCDs exist.
2. SCDs are dimensions that change over time, these changes are not very frequent. For example the price of the product, the change will usually happen because of the inflation.
3. SCD 0 -  **Passive Approach**
    1. If there's a change in the Source System (OLTP), we're not going to implement that change in the warehouse table (OLAP).
    2. These are considered "dead columns" that were relevant for analysis a while back but are not anymore, so such updates are declined in the Warehouse table.
    3. **Example:** Imagine a `Customer` dimension table with a `customer_segment` column. If the business decides to no longer analyze data based on `customer_segment`, any updates to this column from the source system would be ignored in the data warehouse. The `customer_segment` column becomes an SCD 0 attribute.

4. SCD 1 - **Overwriting**
    1. If we have a wrong entry in our source table and we rectify it, that change is to be reflected in the warehouse table. Such changes are immediately done in the warehouse table as well.
    2. SCD 1 maintains the **latest snapshot**, and historical data is **overwritten** and thus ignored.
    3. **Example:**

    **Before Correction in Source (and Warehouse):**

    | customer_id | customer_name | city    |
    | :---------- | :------------ | :------ |
    | 101         | John Doe      | New York |

    **After Correction in Source (and Update in Warehouse - SCD 1):**

    | customer_id | customer_name | city     |
    | :---------- | :------------ | :------- |
    | 101         | John Doe      | Los Angeles |

    *Notice that the `city` for `customer_id` 101 is updated directly in the warehouse table, and the previous city "New York" is lost.*

5. SCD 2 - **Historical Approach**
    1. For every change in the source table, we add a **new row** to the warehouse table.
    2. These multiple entries are then flagged using extra columns to find the latest entry, for example, `is_latest` flag, and `valid_from` and `valid_to` date columns to track the history.
    3. **Example:**

    **Initial State:**

    | customer_id | customer_name | city    | is_latest | valid_from | valid_to   |
    | :---------- | :------------ | :------ | :-------- | :--------- | :--------- |
    | 101         | John Doe      | New York | true      | 2023-01-01 | 9999-12-31 |

    **After City Change in Source (SCD 2 Implementation):**

    | customer_id | customer_name | city        | is_latest | valid_from | valid_to   |
    | :---------- | :------------ | :---------- | :-------- | :--------- | :--------- |
    | 101         | John Doe      | New York    | false     | 2023-01-01 | 2024-02-21 |
    | 101         | John Doe      | Los Angeles | true      | 2024-02-22 | 9999-12-31 |

    *A new row is added to reflect the change in `city`. The previous row is marked as not the latest (`is_latest = false`) and its `valid_to` date is updated to reflect when it was valid. The new row becomes the latest with `is_latest = true` and a new `valid_from` date.*

6. SCD 3 - **Additional Column**
    1. To reflect a change in the source table, an **extra column is maintained per column change** in the source table, in the warehouse table. This stores the current and previous values.
    2. **Drawback:** Loss of complete historical data as only the immediate previous value is stored. Thus, SCD 3 is **rarely used**.
    3. **Example:**

    **Initial State:**

    | customer_id | customer_name | city    |
    | :---------- | :------------ | :------ |
    | 101         | John Doe      | New York |

    **After City Change in Source (SCD 3 Implementation):**

    | customer_id | customer_name | city        | previous_city |
    | :---------- | :------------ | :---------- | :------------ |
    | 101         | John Doe      | Los Angeles | New York      |

    *A new column `previous_city` is added to store the previous city value. When the city changes to "Los Angeles", the old value "New York" is moved to `previous_city`, and the `city` column is updated to "Los Angeles". Only the immediately preceding city is retained as history.*

7. SCD 4 - **History Table (or Combination SCD1 and SCD2)**
    1. It is a **mix of SCD1 and SCD2**, utilizing two tables.
    2. **SCD1 Table (Current Table):** Maintains a table in the warehouse which **doesn't store history** and has the **latest snapshot** (like SCD 1).
    3. **SCD2 Table (History Table):** Maintains a separate table which **adds a new row per change** in the source table (like SCD 2).
    4. **Example:**

    **SCD1 Table (Customer\_Current):**

    | customer_id | customer_name | city        |
    | :---------- | :------------ | :---------- |
    | 101         | John Doe      | Los Angeles |

    **SCD2 Table (Customer\_History):**

    | customer_id | customer_name | city    | valid_from | valid_to   |
    | :---------- | :------------ | :------ | :--------- | :--------- |
    | 101         | John Doe      | New York | 2023-01-01 | 2024-02-21 |
    | 101         | John Doe      | Los Angeles | 2024-02-22 | 9999-12-31 |

    *The `Customer_Current` table always has the latest customer information (SCD 1). The `Customer_History` table tracks all historical changes (SCD 2).*

8.  SCD 6 - **Hybrid Approach (Combination of SCD1, SCD2, and SCD3)**
    1. It's a combination of **SCD1, SCD2, and SCD3**, integrating aspects of all three.
    2. A **live changes table (SCD1)** is maintained along with a **history table with new rows for history tracking (SCD2)**, and also includes **extra columns to store previous values (SCD3)** for some attributes if needed. SCD 6 is complex and **rarely used** due to its complexity.
    3. **Example:**

    **SCD1 Table (Customer\_Current):**

    | customer_id | customer_name | city        | previous_city |
    | :---------- | :------------ | :---------- | :------------ |
    | 101         | John Doe      | Los Angeles | New York      |

    **SCD2 Table (Customer\_History):**

    | customer_id | customer_name | city        | valid_from | valid_to   | previous_city |
    | :---------- | :------------ | :---------- | :--------- | :--------- | :------------ |
    | 101         | John Doe      | New York    | 2023-01-01 | 2024-02-21 | NULL          |
    | 101         | John Doe      | Los Angeles | 2024-02-22 | 9999-12-31 | New York      |

    *The `Customer_Current` table maintains the latest information and the immediately preceding city (SCD 1 & SCD 3). The `Customer_History` table tracks historical changes with new rows and also keeps the previous city for each historical record (SCD 2 & SCD 3).*
