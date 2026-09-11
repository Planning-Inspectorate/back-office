BEGIN TRY

BEGIN TRAN;

IF NOT EXISTS (
    SELECT *
    FROM [dbo].[ExaminationTimetableType]
    WHERE [name] = 'Unaccompanied Site Inspection'
)
BEGIN
INSERT INTO [dbo].[ExaminationTimetableType] (
	[name],
	[templateType],
	[displayNameEn],
[displayNameCy]
)
VALUES (
	'Unaccompanied Site Inspection',
	'unaccompanied-site-inspection',
	'Unaccompanied site inspection',
	'Unaccompanied site inspection'
	)
END

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
ROLLBACK TRAN;
END;

THROW

END CATCH
