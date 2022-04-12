/*
  Warnings:

  - A unique constraint covering the columns `[appellantId]` on the table `Appeal` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Appeal] ADD [appellantId] INT;

-- CreateTable
CREATE TABLE [dbo].[Appellant] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [agentName] NVARCHAR(1000),
    CONSTRAINT [Appellant_pkey] PRIMARY KEY ([id])
);

-- CreateIndex
CREATE UNIQUE INDEX [Appeal_appellantId_key] ON [dbo].[Appeal]([appellantId]);

-- AddForeignKey
ALTER TABLE [dbo].[Appeal] ADD CONSTRAINT [Appeal_appellantId_fkey] FOREIGN KEY ([appellantId]) REFERENCES [dbo].[Appellant]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
