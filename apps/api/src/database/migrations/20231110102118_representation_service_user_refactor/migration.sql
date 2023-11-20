/*
  Warnings:

  - You are about to drop the `RepresentationContact` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Representation] ADD [representativeId] INT,
[representedId] INT, [representedType] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[ServiceUser] ADD [contactMethod] NVARCHAR(1000),
[jobTitle] NVARCHAR(1000),
[under18] BIT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
