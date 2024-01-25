/*
  Update the template types within the exam timetable type table to match the name

*/
BEGIN TRY

BEGIN TRAN;

UPDATE [dbo].[ExaminationTimetableType] SET templateType = 'accompanied-site-inspection' WHERE name = 'Accompanied Site Inspection';
UPDATE [dbo].[ExaminationTimetableType] SET templateType = 'compulsory-acquisition-hearing' WHERE name = 'Compulsory Acquisition Hearing';
UPDATE [dbo].[ExaminationTimetableType] SET templateType = 'deadline' WHERE name = 'Deadline';
UPDATE [dbo].[ExaminationTimetableType] SET templateType = 'deadline-for-close-of-examination' WHERE name = 'Deadline For Close Of Examination';
UPDATE [dbo].[ExaminationTimetableType] SET templateType = 'issued-by' WHERE name = 'Issued By';
UPDATE [dbo].[ExaminationTimetableType] SET templateType = 'issue-specific-hearing' WHERE name = 'Issue Specific Hearing';
UPDATE [dbo].[ExaminationTimetableType] SET templateType = 'open-floor-hearing' WHERE name = 'Open Floor Hearing';
UPDATE [dbo].[ExaminationTimetableType] SET templateType = 'other-meeting' WHERE name = 'Other Meeting';
UPDATE [dbo].[ExaminationTimetableType] SET templateType = 'preliminary-meeting' WHERE name = 'Preliminary Meeting';
UPDATE [dbo].[ExaminationTimetableType] SET templateType = 'procedural-deadline' WHERE name = 'Procedural Deadline (Pre-Examination)';
UPDATE [dbo].[ExaminationTimetableType] SET templateType = 'procedural-decision' WHERE name = 'Procedural Decision';
UPDATE [dbo].[ExaminationTimetableType] SET templateType = 'publication-of' WHERE name = 'Publication Of';

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
