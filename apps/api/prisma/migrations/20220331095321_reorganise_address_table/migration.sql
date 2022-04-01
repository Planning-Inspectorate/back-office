/*
  Warnings:

  - You are about to drop the column `addressLine3` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `addressLine4` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `addressLine5` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `addressLine6` on the `Address` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Address] ALTER COLUMN [addressLine1] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[Address] ALTER COLUMN [postcode] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[Address] ALTER COLUMN [city] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[Address] DROP COLUMN [addressLine3],
[addressLine4],
[addressLine5],
[addressLine6];
ALTER TABLE [dbo].[Address] ADD [county] NVARCHAR(1000),
[town] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
