/*
  Warnings:

  - You are about to drop the `Agent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Appellant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServiceCustomer` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[_lpa] DROP CONSTRAINT [_lpa_B_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Agent] DROP CONSTRAINT [Agent_customerId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Appeal] DROP CONSTRAINT [Appeal_agentId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Appeal] DROP CONSTRAINT [Appeal_appellantId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Appellant] DROP CONSTRAINT [Appellant_customerId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ServiceCustomer] DROP CONSTRAINT [ServiceCustomer_addressId_fkey];

-- AlterTable
ALTER TABLE [dbo].[LPA] ADD [email] NVARCHAR(1000);

-- DropTable
DROP TABLE [dbo].[Agent];

-- DropTable
DROP TABLE [dbo].[Appellant];

-- DropTable
DROP TABLE [dbo].[ServiceCustomer];

-- CreateTable
CREATE TABLE [dbo].[ServiceUser] (
    [id] INT NOT NULL IDENTITY(1,1),
    [organisationName] NVARCHAR(1000),
    [firstName] NVARCHAR(1000),
    [middleName] NVARCHAR(1000),
    [lastName] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [website] NVARCHAR(1000),
    [phoneNumber] NVARCHAR(1000),
    [addressId] INT,
    CONSTRAINT [ServiceUser_pkey] PRIMARY KEY CLUSTERED ([id])
);

UPDATE [dbo].[Appeal] SET appellantId = NULL, agentId = NULL

-- AddForeignKey
ALTER TABLE [dbo].[Appeal] ADD CONSTRAINT [Appeal_appellantId_fkey] FOREIGN KEY ([appellantId]) REFERENCES [dbo].[ServiceUser]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Appeal] ADD CONSTRAINT [Appeal_agentId_fkey] FOREIGN KEY ([agentId]) REFERENCES [dbo].[ServiceUser]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ServiceUser] ADD CONSTRAINT [ServiceUser_addressId_fkey] FOREIGN KEY ([addressId]) REFERENCES [dbo].[Address]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_lpa] ADD CONSTRAINT [_lpa_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[ServiceUser]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
