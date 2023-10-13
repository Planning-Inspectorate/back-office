/*
  Warnings:

  - You are about to drop the `ServiceCustomer` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[ServiceCustomer] DROP CONSTRAINT [ServiceCustomer_addressId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ServiceCustomer] DROP CONSTRAINT [ServiceCustomer_caseId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Case] ADD [applicantId] INT,
[serviceUserId] INT;

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
		-- Use this column to map service customers to service users
    [tmpCaseId] INT,
    CONSTRAINT [ServiceUser_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- Insert Service Customers into Service Users, mapping the IDs
INSERT INTO [dbo].[ServiceUser] ([organisationName], [firstName], [middleName], [lastName], [email], [website], [phoneNumber], [addressId], [tmpCaseId])
SELECT [organisationName], [firstName], [middleName], [lastName], [email], [website], [phoneNumber], [addressId], [caseId] FROM [dbo].[ServiceCustomer];

-- Update the Case records with the correct applicantId
UPDATE c
SET c.applicantId = su.id
FROM [dbo].[Case] c
JOIN [dbo].[ServiceUser] su ON su.tmpCaseId = c.id;

-- Drop the temporary case ID from the ServiceUser table
ALTER TABLE [dbo].[ServiceUser] DROP COLUMN [tmpCaseId];

-- AddForeignKey
ALTER TABLE [dbo].[Case] ADD CONSTRAINT [Case_serviceUserId_fkey] FOREIGN KEY ([serviceUserId]) REFERENCES [dbo].[ServiceUser]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ServiceUser] ADD CONSTRAINT [ServiceUser_addressId_fkey] FOREIGN KEY ([addressId]) REFERENCES [dbo].[Address]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- DropTable
DROP TABLE [dbo].[ServiceCustomer];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
