BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[ApplicationDetails] ADD [locationDescriptionWelsh] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[Case] ADD [descriptionWelsh] VARCHAR(2000),
[titleWelsh] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[DocumentVersion] ADD [authorWelsh] NVARCHAR(1000),
[descriptionWelsh] NVARCHAR(1000),
[filter1Welsh] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[ExaminationTimetableItem] ADD [descriptionWelsh] NTEXT,
[nameWelsh] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[S51Advice] ADD [adviceDetailsWelsh] NTEXT,
[enquiryDetailsWelsh] NTEXT,
[titleWelsh] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
