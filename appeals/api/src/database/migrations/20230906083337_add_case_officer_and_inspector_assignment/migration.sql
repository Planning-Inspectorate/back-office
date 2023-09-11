/*
  Warnings:

  - You are about to drop the column `userId` on the `Appeal` table. All the data in the column will be lost.
  - You are about to drop the column `azureReference` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[azureUserId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Appeal] DROP CONSTRAINT [Appeal_userId_fkey];

-- DropIndex
ALTER TABLE [dbo].[User] DROP CONSTRAINT [User_azureReference_key];

-- AlterTable
ALTER TABLE [dbo].[Appeal] DROP COLUMN [userId];
ALTER TABLE [dbo].[Appeal] ADD [caseOfficerUserId] INT,
[inspectorUserId] INT;

-- AlterTable
ALTER TABLE [dbo].[User] DROP COLUMN [azureReference];
ALTER TABLE [dbo].[User] ADD [azureUserId] NVARCHAR(1000);

-- CreateIndex
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_azureUserId_key] UNIQUE NONCLUSTERED ([azureUserId]);

-- AddForeignKey
ALTER TABLE [dbo].[Appeal] ADD CONSTRAINT [Appeal_caseOfficerUserId_fkey] FOREIGN KEY ([caseOfficerUserId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Appeal] ADD CONSTRAINT [Appeal_inspectorUserId_fkey] FOREIGN KEY ([inspectorUserId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
