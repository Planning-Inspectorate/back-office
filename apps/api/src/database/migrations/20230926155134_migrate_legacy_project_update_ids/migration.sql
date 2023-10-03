/*
  Warnings:

  - You are about to drop the column `migratedId` on the `ProjectUpdate` table. All the data in the column will be lost.
  - You are about to drop the column `migratedId` on the `Subscription` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[ProjectUpdate] DROP COLUMN [migratedId];

-- AlterTable
ALTER TABLE [dbo].[Subscription] DROP COLUMN [migratedId];

-- Add the new seeds for the identity columns to 100 million
DBCC CHECKIDENT ('dbo.ProjectUpdate', RESEED, 100000000);
DBCC CHECKIDENT ('dbo.Subscription', RESEED, 100000000);


COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
