# P3018

## Problem

There is a migration called `20230718132204_unique_document_reference` which introduces a unique constraint on the `Document.reference` field. This will error if there is duplicate data already in this field.

## Resolution

Currently there is no code depending on the reference field being in a certain format, so we can simply resolve this problem by replacing the duplicate values with random GUIDs.

## Steps to resolve

1. Change the `DATABASE_URL` variable in your .env (in apps/api) to the connection string in the Azure config for the back office API. (This will change when we move to key vault).

2. Go to the back office database in UK West and click 'Set Server Firewall'. Add your IP address to the list of allowed IP addresses.

3. Run `npx prisma migrate status` to confirm that there are indeed migrations still pending.

4. Run `npx prisma migrate resolve --rolled-back "20230718132204_unique_document_reference"`. This sets the migration to the `rolled-back` state.

5. Run `echo "echo "UPDATE [dbo].[Document] SET reference = NEWID()" | npx prisma db execute --stdin"` to replace all values in the reference column with a random GUID.

6. The migration will have partially run which will introduce problems. Undo the already completed step by running `echo "ALTER TABLE [dbo].[Document] ALTER COLUMN [reference] NVARCHAR(1000) NULL" | npx prisma db execute --stdin`.

7. This will have fixed the data and undone the partially completed migration. Now you can deploy the remaining migrations by running `npx prisma migrate deploy`.
