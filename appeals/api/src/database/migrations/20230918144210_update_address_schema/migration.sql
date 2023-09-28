/*
  Warnings:

  - You are about to drop the column `country` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `county` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `town` on the `Address` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Address] DROP COLUMN [country],
[county],
[town];
ALTER TABLE [dbo].[Address] ADD [addressCountry] NVARCHAR(1000),
[addressCounty] NVARCHAR(1000),
[addressTown] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
