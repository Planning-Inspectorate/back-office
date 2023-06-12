/*
  Warnings:

  - You are about to drop the column `representationId` on the `Document` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Document] DROP CONSTRAINT [Document_representationId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Document] DROP COLUMN [representationId];

-- AlterTable
ALTER TABLE [dbo].[Representation] DROP CONSTRAINT [Representation_received_df];

-- CreateTable
CREATE TABLE [dbo].[RepresentationAttachment] (
    [id] INT NOT NULL IDENTITY(1,1),
    [representationId] INT NOT NULL,
    [documentGuid] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [RepresentationAttachment_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [RepresentationAttachment_documentGuid_key] UNIQUE NONCLUSTERED ([documentGuid])
);

-- AddForeignKey
ALTER TABLE [dbo].[RepresentationAttachment] ADD CONSTRAINT [RepresentationAttachment_representationId_fkey] FOREIGN KEY ([representationId]) REFERENCES [dbo].[Representation]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[RepresentationAttachment] ADD CONSTRAINT [RepresentationAttachment_documentGuid_fkey] FOREIGN KEY ([documentGuid]) REFERENCES [dbo].[Document]([guid]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
