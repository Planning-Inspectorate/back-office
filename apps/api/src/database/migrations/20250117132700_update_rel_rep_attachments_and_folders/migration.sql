/*
  Warnings:

	APPLICS-1211 Update Relevant Representation Attachments and folders
	-This is intended as a run-once but can be safely multiply run

	1: Update the Relevant Reps folders default documentCaseStage Folder:stage with 'Relevant representation attachment', for the Rel Reps folders on all cases if it is not already.
	2: Replace the Document:documentType field for any rel rep attachment docs not set with documentType 'relevant-representation'
	3: Populate / replace the DocumentVersion:stage field for all rel rep attachent docs with 'Relevant representation attachment' - overwriting any existing values
	4: Populate / replace the DocumentVersion:filter1 field for all rel rep attachent docs with 'Relevant representation attachment' - overwriting any existing values
	5: Populate the DocumentVersion:author (from) field for all rel rep attachent docs with either the represented Organisation name (if any) or the Person FullName, if the field is null



*/
BEGIN TRY

BEGIN TRAN;
	-- 1: correct default stage on All existing "Relevant representations" Top level folders
	UPDATE [Folder] SET stage = 'Relevant representation attachment'
	WHERE displayNameEn = 'Relevant representations' AND parentFolderId IS NULL and stage != 'Relevant representation attachment';

	-- 2: update Document:documentType for Rel Rep attachments not set correctly
	UPDATE [Document] SET documentType = 'relevant-representation'
	WHERE documentType != 'relevant-representation' AND guid IN (SELECT documentGuid FROM RepresentationAttachment);

	-- 3: correctly update DocumentVersion:stage for all existing rel rep attachments not set correctly
	--		latest version only
	UPDATE [DocumentVersion] SET stage = 'Relevant representation attachment'
	FROM DocumentVersion
	INNER JOIN Document ON DocumentVersion.documentGuid = Document.guid
	INNER JOIN RepresentationAttachment ON DocumentVersion.documentGuid = RepresentationAttachment.documentGuid
	WHERE Document.latestVersionId = DocumentVersion.version AND DocumentVersion.documentGuid = Document.guid
	AND DocumentVersion.documentGuid = RepresentationAttachment.documentGuid
	AND DocumentVersion.stage != 'Relevant representation attachment'

	-- 4: correctly populate DocumentVersion:filter1 for all existing rel rep attachments with null filter1
	--		latest version only
	UPDATE [DocumentVersion] SET filter1 = 'Relevant representation attachment'
	FROM DocumentVersion
	INNER JOIN Document ON DocumentVersion.documentGuid = Document.guid
	INNER JOIN RepresentationAttachment ON DocumentVersion.documentGuid = RepresentationAttachment.documentGuid
	WHERE Document.latestVersionId = DocumentVersion.version AND DocumentVersion.documentGuid = Document.guid
	AND DocumentVersion.documentGuid = RepresentationAttachment.documentGuid
	AND filter1 IS NULL

	-- 5: update the documentVersion:author field with the represented user organisationName or user Full name
	--		latest version only
	UPDATE DocumentVersion SET author = COALESCE(ServiceUser.organisationName, (TRIM(ISNULL(ServiceUser.firstName, '') + ' ' + ISNULL(ServiceUser.lastName, ''))))
	FROM DocumentVersion
	INNER JOIN Document ON DocumentVersion.documentGuid = Document.guid
	INNER JOIN RepresentationAttachment ON DocumentVersion.documentGuid = RepresentationAttachment.documentGuid
	INNER JOIN Representation ON RepresentationAttachment.representationId = Representation.Id
	INNER JOIN ServiceUser ON Representation.representedId = ServiceUser.Id
	WHERE Document.latestVersionId = DocumentVersion.version AND DocumentVersion.documentGuid = Document.guid
	AND DocumentVersion.documentGuid = RepresentationAttachment.documentGuid
  	AND RepresentationAttachment.representationId = Representation.Id
	AND Representation.representedId = ServiceUser.Id
	AND DocumentVersion.author IS NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
