# Supabase Database Schema Reference

## Tables

### net_worth_log

Tracks net worth logs over time.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key, auto-generated |
| userid | UUID | Foreign key to auth.users |
| created_at | TIMESTAMP | Auto-set on creation |
| updated_at | TIMESTAMP | Auto-updated on changes |
| deleted_at | TIMESTAMP | Soft delete timestamp |
| date | DATE | User-specified date |
| title | JSONB | JSON object storing titles |
| value | JSONB | JSON object storing values |

### transactions

Tracks income and expense transactions.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key, auto-generated |
| userid | UUID | Foreign key to auth.users |
| created_at | TIMESTAMP | Auto-set on creation |
| updated_at | TIMESTAMP | Auto-updated on changes |
| deleted_at | TIMESTAMP | Soft delete timestamp |
| date | DATE | Transaction date |
| title | JSONB | JSON object storing titles |
| value | JSONB | JSON object storing values |
| transaction_type | VARCHAR | Either 'income' or 'expense' |
| category | VARCHAR | Transaction category |

### planned_budget

Stores budget planning data.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key, auto-generated |
| userid | UUID | Foreign key to auth.users |
| created_at | TIMESTAMP | Auto-set on creation |
| updated_at | TIMESTAMP | Auto-updated on changes |
| deleted_at | TIMESTAMP | Soft delete timestamp |
| date | DATE | Budget planning date |
| title | JSONB | JSON object storing titles |
| value | JSONB | JSON object storing values |
| transaction_type | VARCHAR | Either 'income' or 'expense' |
| category | VARCHAR | Budget category |

### custom_categories

Stores user-defined categories for transactions and budgets.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key, auto-generated |
| userid | UUID | Foreign key to auth.users |
| created_at | TIMESTAMP | Auto-set on creation |
| updated_at | TIMESTAMP | Auto-updated on changes |
| deleted_at | TIMESTAMP | Soft delete timestamp |
| name | VARCHAR | Category name |
| type | VARCHAR | Either 'income' or 'expense' |

## Notes

1. All tables include:
   - UUID primary keys
   - User reference (userid)
   - Timestamps for creation, updates, and soft deletes
   - JSONB columns for flexible title/value storage

2. Constraints:
   - transaction_type is restricted to 'income' or 'expense'
   - All tables have triggers to auto-update the updated_at timestamp
   - custom_categories has a unique constraint on (userid, name, type)

3. Example JSONB structure:
   ```json
   title: {
     "Salary": "Monthly Income",
     "Rent": "Housing Expense"
   }
   value: {
     "Salary": 5000,
     "Rent": 1500
   }
   ``` 