declare @sub_sector_abbreviation nchar(4), @max_reference int, @reference_number int;

declare @minimum_new_reference int = 10001;
declare @id int = CASE_ID;

select @sub_sector_abbreviation = sub_sector_table.abbreviation
FROM [dbo].[Case] as case_table
    join [dbo].[ApplicationDetails] as application_details_table
    on case_table.id = application_details_table.caseId
    join [dbo].[SubSector] as sub_sector_table
    on application_details_table.subSectorId = sub_sector_table.id
where case_table.id = @id;

SELECT @max_reference = max(cast(SUBSTRING(case_table.reference, 5, len(case_table.reference)) as int))
FROM [dbo].[Case] as case_table
    join [dbo].[ApplicationDetails] as application_details_table
    on case_table.id = application_details_table.caseId
    join [dbo].[SubSector] as sub_sector_table
    on application_details_table.subSectorId = sub_sector_table.id
        and sub_sector_table.abbreviation = @sub_sector_abbreviation;

if(@max_reference < @minimum_new_reference OR @max_reference IS NULL) select @reference_number = @minimum_new_reference else select @reference_number = @max_reference + 1;

update [dbo].[Case]
    set reference = CONCAT(@sub_sector_abbreviation, cast(@reference_number as nchar(5)))
    where id = @id;
