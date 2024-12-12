/*
  Warnings:

  - You are about to alter the column `locationDescription` on the `ApplicationDetails` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `VarChar(2000)`.
  - You are about to alter the column `locationDescriptionWelsh` on the `ApplicationDetails` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `VarChar(2000)`.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[ApplicationDetails] ALTER COLUMN [locationDescription] VARCHAR(2000) NULL;
ALTER TABLE [dbo].[ApplicationDetails] ALTER COLUMN [locationDescriptionWelsh] VARCHAR(2000) NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
