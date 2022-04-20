/*
  Warnings:

  - Added the required column `appealTypeId` to the `Appeal` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Appeal] ADD [appealTypeId] INT NOT NULL;

-- CreateTable
CREATE TABLE [dbo].[AppealType] (
    [id] INT NOT NULL IDENTITY(1,1),
    [type] NVARCHAR(1000) NOT NULL,
    [shorthand] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [AppealType_pkey] PRIMARY KEY ([id]),
    CONSTRAINT [AppealType_type_key] UNIQUE ([type]),
    CONSTRAINT [AppealType_shorthand_key] UNIQUE ([shorthand])
);

-- AddForeignKey
ALTER TABLE [dbo].[Appeal] ADD CONSTRAINT [Appeal_appealTypeId_fkey] FOREIGN KEY ([appealTypeId]) REFERENCES [dbo].[AppealType]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
