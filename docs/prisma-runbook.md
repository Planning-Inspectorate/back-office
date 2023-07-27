# P3009

## Symptoms

A database migration can fail for a number of reasons (most commonly, this is because a constraint is added to a column but the column is already populated with values that violate the constraint). The first thing you'll need to do is resolve the migration itself (for example, by writing a script to transform the pre-existing data before the constraint is applied), but you won't be able to run the modified migration until you manually resolve the failed one.

In the meantime, if you try to run a migration, you'll receive a P3009 error code from the Prisma CLI.

## Resolution

To resolve the issue, you'll need to connect to the impacted database (hopefully this is caught at development stage, but troublesome data might not appear until we get to production) and run the Prisma CLI to resolve the migration.

It is recommended that you recreate the failure locally and run the following steps on your local database before performing them against a live one.

### 1. Gain access to the impacted database

You'll need access to the Dev resource group to do this.

If this is the dev database it will be fairly straightforward. Navigate to the Azure SQL back-office database in UK-West and click the 'Set Server Firewall' and click 'Add your client IP Address', and save.

If this is the test or production database, you'll need to reach out to one of the operations team to get access.

### 2. Identify the failed migration
If you're getting a P3009, you'll need to look back to the first migration run which failed - and identify the migration. For example, it could be '20201127134938_added_bio_index'

## 3. Configure your local connection string

Modify the apps/api/.env file and set the DATABASE_URL value to the connection string for the impacted database. You can obtain these credentials currently by looking at the Back Office API Service for the impacted environment and copying the connection string (TODO: This will change when we move the connection string to Key Vault)

For environments other than dev, you'll need to reach out to operations team to get the connection strings.

## 4. Run the migration rollback

You'll then need to navigate to the apps/api directory on the CLI and run the following command, replacing the '20201127134938_added_bio_index' with the failed migration.

```
npx prisma migrate resolve --rolled-back "20201127134938_added_bio_index"
```

## 5. Re-run the deployment pipeline

Re-run the API deployment pipeline.
