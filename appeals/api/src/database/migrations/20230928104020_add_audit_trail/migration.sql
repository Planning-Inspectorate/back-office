/*
  Warnings:

  - You are about to drop the column `azureUserId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[azureAdUserId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[User] DROP CONSTRAINT [User_azureUserId_key];

-- AlterTable
ALTER TABLE [dbo].[User] DROP COLUMN [azureUserId];
ALTER TABLE [dbo].[User] ADD [azureAdUserId] NVARCHAR(1000);

-- CreateTable
CREATE TABLE [dbo].[AuditTrail] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [userId] INT NOT NULL,
    [loggedAt] DATETIME2 NOT NULL,
    [details] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [AuditTrail_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_azureAdUserId_key] UNIQUE NONCLUSTERED ([azureAdUserId]);

-- AddForeignKey
ALTER TABLE [dbo].[AuditTrail] ADD CONSTRAINT [AuditTrail_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AuditTrail] ADD CONSTRAINT [AuditTrail_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
