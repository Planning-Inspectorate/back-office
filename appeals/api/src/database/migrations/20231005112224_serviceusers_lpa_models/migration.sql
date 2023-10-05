/*
  Warnings:

  - You are about to drop the column `localPlanningDepartment` on the `Appeal` table. All the data in the column will be lost.
  - You are about to drop the column `agentName` on the `Appellant` table. All the data in the column will be lost.
  - You are about to drop the column `company` on the `Appellant` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Appellant` table. All the data in the column will be lost.
  - You are about to drop the column `caseId` on the `ServiceCustomer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `ServiceCustomer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lpaId` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerId` to the `Appellant` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `ServiceCustomer` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Appeal] DROP CONSTRAINT [Appeal_appellantId_fkey];

-- DropIndex
ALTER TABLE [dbo].[Appeal] DROP CONSTRAINT [Appeal_appellantId_key];

-- AlterTable
ALTER TABLE [dbo].[Appeal] DROP COLUMN [localPlanningDepartment];
ALTER TABLE [dbo].[Appeal] ADD [agentId] INT,
[lpaId] INT NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[Appellant] DROP COLUMN [agentName],
[company],
[email];
ALTER TABLE [dbo].[Appellant] ADD [customerId] INT NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[ServiceCustomer] ALTER COLUMN [email] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[ServiceCustomer] DROP COLUMN [caseId];

-- AlterTable
ALTER TABLE [dbo].[User] ADD [sapId] NVARCHAR(1000);

-- CreateTable
CREATE TABLE [dbo].[Agent] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [customerId] INT NOT NULL,
    CONSTRAINT [Agent_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[LPA] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [lpaCode] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [LPA_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [LPA_lpaCode_key] UNIQUE NONCLUSTERED ([lpaCode])
);

-- CreateTable
CREATE TABLE [dbo].[_lpa] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_lpa_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_lpa_B_index] ON [dbo].[_lpa]([B]);

-- CreateIndex
ALTER TABLE [dbo].[ServiceCustomer] ADD CONSTRAINT [ServiceCustomer_email_key] UNIQUE NONCLUSTERED ([email]);

-- AddForeignKey
ALTER TABLE [dbo].[Appeal] ADD CONSTRAINT [Appeal_appellantId_fkey] FOREIGN KEY ([appellantId]) REFERENCES [dbo].[Appellant]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Appeal] ADD CONSTRAINT [Appeal_agentId_fkey] FOREIGN KEY ([agentId]) REFERENCES [dbo].[Agent]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Appeal] ADD CONSTRAINT [Appeal_lpaId_fkey] FOREIGN KEY ([lpaId]) REFERENCES [dbo].[LPA]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Appellant] ADD CONSTRAINT [Appellant_customerId_fkey] FOREIGN KEY ([customerId]) REFERENCES [dbo].[ServiceCustomer]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Agent] ADD CONSTRAINT [Agent_customerId_fkey] FOREIGN KEY ([customerId]) REFERENCES [dbo].[ServiceCustomer]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_lpa] ADD CONSTRAINT [_lpa_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[LPA]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_lpa] ADD CONSTRAINT [_lpa_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[ServiceCustomer]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
