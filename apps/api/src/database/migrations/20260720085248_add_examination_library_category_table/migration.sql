BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[DocumentVersion] ADD [examinationLibraryCategoryId] INT,
[examinationLibraryIndex] INT,
[typeOfParty] NVARCHAR(1000);

-- CreateTable
CREATE TABLE [dbo].[ExaminationLibraryCategory] (
    [id] INT NOT NULL IDENTITY(1,1),
    [caseId] INT NOT NULL,
    [categoryCode] NVARCHAR(1000) NOT NULL,
    [categoryName] NVARCHAR(1000) NOT NULL,
    [publishedStatus] NVARCHAR(1000) NOT NULL CONSTRAINT [ExaminationLibraryCategory_publishedStatus_df] DEFAULT 'unpublished',
    [source] NVARCHAR(1000) NOT NULL,
    [examinationTimetableItemId] INT,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [ExaminationLibraryCategory_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [ExaminationLibraryCategory_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [ExaminationLibraryCategory_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [ExaminationLibraryCategory_examinationTimetableItemId_key] UNIQUE NONCLUSTERED ([examinationTimetableItemId]),
    CONSTRAINT [ExaminationLibraryCategory_caseId_categoryCode_key] UNIQUE NONCLUSTERED ([caseId],[categoryCode])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [DocumentVersion_examinationLibraryCategoryId_idx] ON [dbo].[DocumentVersion]([examinationLibraryCategoryId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [DocumentVersion_examinationLibraryIndex_idx] ON [dbo].[DocumentVersion]([examinationLibraryIndex]);

-- AddForeignKey
ALTER TABLE [dbo].[DocumentVersion] ADD CONSTRAINT [DocumentVersion_examinationLibraryCategoryId_fkey] FOREIGN KEY ([examinationLibraryCategoryId]) REFERENCES [dbo].[ExaminationLibraryCategory]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ExaminationLibraryCategory] ADD CONSTRAINT [ExaminationLibraryCategory_caseId_fkey] FOREIGN KEY ([caseId]) REFERENCES [dbo].[Case]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ExaminationLibraryCategory] ADD CONSTRAINT [ExaminationLibraryCategory_examinationTimetableItemId_fkey] FOREIGN KEY ([examinationTimetableItemId]) REFERENCES [dbo].[ExaminationTimetableItem]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
