import { getDocumentFolderId } from '../folder.js';
import { databaseConnector } from '#utils/database-connector.js';

const folders = [
	{
		id: 100011404,
		displayNameEn: 'Legal advice',
		displayOrder: 200,
		parentFolderId: null,
		caseId: 15360347,
		stage: null,
		displayNameCy: null
	},
	{
		id: 100011405,
		displayNameEn: 'Pre-examination',
		displayOrder: 800,
		parentFolderId: null,
		caseId: 15360347,
		stage: 'Pre-examination',
		displayNameCy: null
	},
	{
		id: 100011406,
		displayNameEn: 'Recommendation',
		displayOrder: 1100,
		parentFolderId: null,
		caseId: 15360347,
		stage: 'Recommendation',
		displayNameCy: null
	},
	{
		id: 100011407,
		displayNameEn: 'S51 advice',
		displayOrder: 500,
		parentFolderId: null,
		caseId: 15360347,
		stage: '0',
		displayNameCy: null
	},
	{
		id: 100011408,
		displayNameEn: 'Events / meetings',
		displayOrder: 100,
		parentFolderId: 100011405,
		caseId: 15360347,
		stage: 'Pre-examination',
		displayNameCy: null
	},
	{
		id: 100011409,
		displayNameEn: 'Pre-application',
		displayOrder: 600,
		parentFolderId: null,
		caseId: 15360347,
		stage: 'Pre-application',
		displayNameCy: null
	},
	{
		id: 100011410,
		displayNameEn: 'Events / meetings',
		displayOrder: 100,
		parentFolderId: 100011406,
		caseId: 15360347,
		stage: 'Recommendation',
		displayNameCy: null
	},
	{
		id: 100011411,
		displayNameEn: 'Post-decision',
		displayOrder: 1300,
		parentFolderId: null,
		caseId: 15360347,
		stage: 'Post-decision',
		displayNameCy: null
	},
	{
		id: 100011412,
		displayNameEn: 'Decision',
		displayOrder: 1200,
		parentFolderId: null,
		caseId: 15360347,
		stage: 'Decision',
		displayNameCy: null
	},
	{
		id: 100011413,
		displayNameEn: 'Correspondence',
		displayOrder: 200,
		parentFolderId: 100011405,
		caseId: 15360347,
		stage: 'Pre-examination',
		displayNameCy: null
	},
	{
		id: 100011414,
		displayNameEn: 'Transboundary',
		displayOrder: 300,
		parentFolderId: null,
		caseId: 15360347,
		stage: 'Pre-application',
		displayNameCy: null
	},
	{
		id: 100011415,
		displayNameEn: 'Project management',
		displayOrder: 100,
		parentFolderId: null,
		caseId: 15360347,
		stage: null,
		displayNameCy: null
	},
	{
		id: 100011416,
		displayNameEn: 'Judicial review',
		displayOrder: 100,
		parentFolderId: 100011411,
		caseId: 15360347,
		stage: 'Post-decision',
		displayNameCy: null
	},
	{
		id: 100011417,
		displayNameEn: 'Correspondence',
		displayOrder: 200,
		parentFolderId: 100011406,
		caseId: 15360347,
		stage: 'Recommendation',
		displayNameCy: null
	},
	{
		id: 100011418,
		displayNameEn: 'Events / meetings',
		displayOrder: 100,
		parentFolderId: 100011409,
		caseId: 15360347,
		stage: 'Pre-application',
		displayNameCy: null
	},
	{
		id: 100011419,
		displayNameEn: 'Archived documentation',
		displayOrder: 1400,
		parentFolderId: null,
		caseId: 15360347,
		stage: null,
		displayNameCy: null
	},
	{
		id: 100011420,
		displayNameEn: 'Acceptance',
		displayOrder: 700,
		parentFolderId: null,
		caseId: 15360347,
		stage: 'Acceptance',
		displayNameCy: null
	},
	{
		id: 100011421,
		displayNameEn: 'Examination',
		displayOrder: 1000,
		parentFolderId: null,
		caseId: 15360347,
		stage: 'Examination',
		displayNameCy: null
	},
	{
		id: 100011422,
		displayNameEn: 'Land rights',
		displayOrder: 400,
		parentFolderId: null,
		caseId: 15360347,
		stage: null,
		displayNameCy: null
	},
	{
		id: 100011423,
		displayNameEn: 'SoS consultation',
		displayOrder: 100,
		parentFolderId: 100011412,
		caseId: 15360347,
		stage: 'Decision',
		displayNameCy: null
	},
	{
		id: 100011424,
		displayNameEn: '01 - Internal',
		displayOrder: 100,
		parentFolderId: 100011413,
		caseId: 15360347,
		stage: 'Pre-examination',
		displayNameCy: null
	},
	{
		id: 100011425,
		displayNameEn: 'First screening',
		displayOrder: 100,
		parentFolderId: 100011414,
		caseId: 15360347,
		stage: 'Pre-application',
		displayNameCy: null
	},
	{
		id: 100011426,
		displayNameEn: 'Relevant representations',
		displayOrder: 900,
		parentFolderId: null,
		caseId: 15360347,
		stage: 'Pre-examination',
		displayNameCy: null
	},
	{
		id: 100011427,
		displayNameEn: 'Logistics',
		displayOrder: 100,
		parentFolderId: 100011415,
		caseId: 15360347,
		stage: null,
		displayNameCy: null
	},
	{
		id: 100011428,
		displayNameEn: 'Costs',
		displayOrder: 200,
		parentFolderId: 100011411,
		caseId: 15360347,
		stage: 'Post-decision',
		displayNameCy: null
	},
	{
		id: 100011429,
		displayNameEn: 'Outreach',
		displayOrder: 100,
		parentFolderId: 100011418,
		caseId: 15360347,
		stage: 'Pre-application',
		displayNameCy: null
	},
	{
		id: 100011430,
		displayNameEn: '01 - Internal',
		displayOrder: 100,
		parentFolderId: 100011417,
		caseId: 15360347,
		stage: 'Recommendation',
		displayNameCy: null
	},
	{
		id: 100011431,
		displayNameEn: 'Events / meetings',
		displayOrder: 100,
		parentFolderId: 100011420,
		caseId: 15360347,
		stage: 'Acceptance',
		displayNameCy: null
	},
	{
		id: 100011432,
		displayNameEn: 'Correspondence',
		displayOrder: 100,
		parentFolderId: 100011421,
		caseId: 15360347,
		stage: 'Examination',
		displayNameCy: null
	},
	{
		id: 100011433,
		displayNameEn: 'S52',
		displayOrder: 100,
		parentFolderId: 100011422,
		caseId: 15360347,
		stage: null,
		displayNameCy: null
	},
	{
		id: 100011434,
		displayNameEn: 'Correspondence',
		displayOrder: 100,
		parentFolderId: 100011423,
		caseId: 15360347,
		stage: 'Decision',
		displayNameCy: null
	},
	{
		id: 100011435,
		displayNameEn: 'Second screening',
		displayOrder: 200,
		parentFolderId: 100011414,
		caseId: 15360347,
		stage: 'Pre-application',
		displayNameCy: null
	},
	{
		id: 100011436,
		displayNameEn: '02 - External',
		displayOrder: 200,
		parentFolderId: 100011413,
		caseId: 15360347,
		stage: 'Pre-examination',
		displayNameCy: null
	},
	{
		id: 100011437,
		displayNameEn: 'Non-material change',
		displayOrder: 300,
		parentFolderId: 100011411,
		caseId: 15360347,
		stage: 'Post-decision',
		displayNameCy: null
	},
	{
		id: 100011438,
		displayNameEn: 'Travel',
		displayOrder: 100,
		parentFolderId: 100011427,
		caseId: 15360347,
		stage: null,
		displayNameCy: null
	},
	{
		id: 100011439,
		displayNameEn: '02 - External',
		displayOrder: 200,
		parentFolderId: 100011417,
		caseId: 15360347,
		stage: 'Recommendation',
		displayNameCy: null
	},
	{
		id: 100011440,
		displayNameEn: 'Correspondence',
		displayOrder: 200,
		parentFolderId: 100011420,
		caseId: 15360347,
		stage: 'Acceptance',
		displayNameCy: null
	},
	{
		id: 100011441,
		displayNameEn: 'Correspondence',
		displayOrder: 200,
		parentFolderId: 100011409,
		caseId: 15360347,
		stage: 'Pre-application',
		displayNameCy: null
	},
	{
		id: 100011442,
		displayNameEn: '01 - Internal',
		displayOrder: 100,
		parentFolderId: 100011434,
		caseId: 15360347,
		stage: 'Decision',
		displayNameCy: null
	},
	{
		id: 100011443,
		displayNameEn: '01 - Internal',
		displayOrder: 100,
		parentFolderId: 100011432,
		caseId: 15360347,
		stage: 'Examination',
		displayNameCy: null
	},
	{
		id: 100011444,
		displayNameEn: 'Applicant request',
		displayOrder: 100,
		parentFolderId: 100011433,
		caseId: 15360347,
		stage: null,
		displayNameCy: null
	},
	{
		id: 100011445,
		displayNameEn: 'Welsh',
		displayOrder: 200,
		parentFolderId: 100011427,
		caseId: 15360347,
		stage: null,
		displayNameCy: null
	},
	{
		id: 100011446,
		displayNameEn: 'Application documents',
		displayOrder: 100,
		parentFolderId: 100011437,
		caseId: 15360347,
		stage: 'Post-decision',
		displayNameCy: null
	},
	{
		id: 100011447,
		displayNameEn: 'Additional submissions',
		displayOrder: 300,
		parentFolderId: 100011405,
		caseId: 15360347,
		stage: 'Pre-examination',
		displayNameCy: null
	},
	{
		id: 100011448,
		displayNameEn: '01 - Internal',
		displayOrder: 100,
		parentFolderId: 100011440,
		caseId: 15360347,
		stage: 'Acceptance',
		displayNameCy: null
	},
	{
		id: 100011449,
		displayNameEn: 'External',
		displayOrder: 100,
		parentFolderId: 100011441,
		caseId: 15360347,
		stage: 'Pre-application',
		displayNameCy: null
	},
	{
		id: 100011450,
		displayNameEn: '02 - External',
		displayOrder: 200,
		parentFolderId: 100011434,
		caseId: 15360347,
		stage: 'Decision',
		displayNameCy: null
	},
	{
		id: 100011451,
		displayNameEn: 'Recommendation report',
		displayOrder: 300,
		parentFolderId: 100011406,
		caseId: 15360347,
		stage: 'Recommendation',
		displayNameCy: null
	},
	{
		id: 100011452,
		displayNameEn: '02 - External',
		displayOrder: 200,
		parentFolderId: 100011432,
		caseId: 15360347,
		stage: 'Examination',
		displayNameCy: null
	},
	{
		id: 100011453,
		displayNameEn: 'Recommendation and authorisation',
		displayOrder: 200,
		parentFolderId: 100011433,
		caseId: 15360347,
		stage: null,
		displayNameCy: null
	},
	{
		id: 100011454,
		displayNameEn: 'Consultation responses',
		displayOrder: 200,
		parentFolderId: 100011437,
		caseId: 15360347,
		stage: 'Post-decision',
		displayNameCy: null
	},
	{
		id: 100011455,
		displayNameEn: 'Programme officer',
		displayOrder: 200,
		parentFolderId: 100011427,
		caseId: 15360347,
		stage: null,
		displayNameCy: null
	},
	{
		id: 100011456,
		displayNameEn: 'Post submission changes',
		displayOrder: 100,
		parentFolderId: 100011447,
		caseId: 15360347,
		stage: 'Pre-examination',
		displayNameCy: null
	},
	{
		id: 100011457,
		displayNameEn: '02 - External',
		displayOrder: 200,
		parentFolderId: 100011440,
		caseId: 15360347,
		stage: 'Acceptance',
		displayNameCy: null
	},
	{
		id: 100011458,
		displayNameEn: 'Internal',
		displayOrder: 200,
		parentFolderId: 100011441,
		caseId: 15360347,
		stage: 'Pre-application',
		displayNameCy: null
	},
	{
		id: 100011459,
		displayNameEn: 'Correspondence',
		displayOrder: 300,
		parentFolderId: 100011433,
		caseId: 15360347,
		stage: null,
		displayNameCy: null
	},
	{
		id: 100011460,
		displayNameEn: 'Additional submissions',
		displayOrder: 200,
		parentFolderId: 100011421,
		caseId: 15360347,
		stage: 'Examination',
		displayNameCy: null
	},
	{
		id: 100011461,
		displayNameEn: 'Consultation documents',
		displayOrder: 200,
		parentFolderId: 100011423,
		caseId: 15360347,
		stage: 'Decision',
		displayNameCy: null
	},
	{
		id: 100011462,
		displayNameEn: 'Drafts',
		displayOrder: 100,
		parentFolderId: 100011451,
		caseId: 15360347,
		stage: 'Recommendation',
		displayNameCy: null
	},
	{
		id: 100011463,
		displayNameEn: 'Procedural decisions',
		displayOrder: 200,
		parentFolderId: 100011437,
		caseId: 15360347,
		stage: 'Post-decision',
		displayNameCy: null
	},
	{
		id: 100011464,
		displayNameEn: 'Mail merge spreadsheet',
		displayOrder: 200,
		parentFolderId: 100011415,
		caseId: 15360347,
		stage: null,
		displayNameCy: null
	},
	{
		id: 100011465,
		displayNameEn: 'Procedural decisions',
		displayOrder: 400,
		parentFolderId: 100011405,
		caseId: 15360347,
		stage: 'Pre-examination',
		displayNameCy: null
	},
	{
		id: 100011466,
		displayNameEn: 'EST',
		displayOrder: 300,
		parentFolderId: 100011420,
		caseId: 15360347,
		stage: 'Acceptance',
		displayNameCy: null
	},
	{
		id: 100011467,
		displayNameEn: 'EIA',
		displayOrder: 300,
		parentFolderId: 100011409,
		caseId: 15360347,
		stage: 'Pre-application',
		displayNameCy: null
	},
	{
		id: 100011468,
		displayNameEn: 'S53',
		displayOrder: 200,
		parentFolderId: 100011422,
		caseId: 15360347,
		stage: null,
		displayNameCy: null
	},
	{
		id: 100011469,
		displayNameEn: 'Material change',
		displayOrder: 400,
		parentFolderId: 100011411,
		caseId: 15360347,
		stage: 'Post-decision',
		displayNameCy: null
	},
	{
		id: 100011470,
		displayNameEn: 'Final submitted report',
		displayOrder: 200,
		parentFolderId: 100011451,
		caseId: 15360347,
		stage: 'Recommendation',
		displayNameCy: null
	},
	{
		id: 100011471,
		displayNameEn: 'Post examination submissions',
		displayOrder: 300,
		parentFolderId: 100011423,
		caseId: 15360347,
		stage: 'Decision',
		displayNameCy: null
	},
	{
		id: 100011472,
		displayNameEn: 'Examination timetable',
		displayOrder: 300,
		parentFolderId: 100011421,
		caseId: 15360347,
		stage: 'Examination',
		displayNameCy: null
	},
	{
		id: 100011473,
		displayNameEn: 'Fees',
		displayOrder: 300,
		parentFolderId: 100011415,
		caseId: 15360347,
		stage: null,
		displayNameCy: null
	},
	{
		id: 100011474,
		displayNameEn: 'EIA',
		displayOrder: 500,
		parentFolderId: 100011405,
		caseId: 15360347,
		stage: 'Pre-examination',
		displayNameCy: null
	},
	{
		id: 100011475,
		displayNameEn: 'Screening',
		displayOrder: 100,
		parentFolderId: 100011467,
		caseId: 15360347,
		stage: 'Pre-application',
		displayNameCy: null
	},
	{
		id: 100011476,
		displayNameEn: 'Application documents',
		displayOrder: 400,
		parentFolderId: 100011420,
		caseId: 15360347,
		stage: "Developer's Application",
		displayNameCy: null
	},
	{
		id: 100011477,
		displayNameEn: 'Applicant request',
		displayOrder: 100,
		parentFolderId: 100011468,
		caseId: 15360347,
		stage: null,
		displayNameCy: null
	},
	{
		id: 100011478,
		displayNameEn: 'Redetermination',
		displayOrder: 500,
		parentFolderId: 100011411,
		caseId: 15360347,
		stage: 'Post-decision',
		displayNameCy: null
	},
	{
		id: 100011479,
		displayNameEn: 'Documents received',
		displayOrder: 400,
		parentFolderId: 100011406,
		caseId: 15360347,
		stage: 'Recommendation',
		displayNameCy: null
	},
	{
		id: 100011480,
		displayNameEn: 'Other',
		displayOrder: 30000000,
		parentFolderId: 100011472,
		caseId: 15360347,
		stage: 'Examination',
		displayNameCy: null
	},
	{
		id: 100011481,
		displayNameEn: 'Case management',
		displayOrder: 400,
		parentFolderId: 100011415,
		caseId: 15360347,
		stage: null,
		displayNameCy: null
	},
	{
		id: 100011482,
		displayNameEn: 'Correspondence',
		displayOrder: 600,
		parentFolderId: 100011411,
		caseId: 15360347,
		stage: 'Post-decision',
		displayNameCy: null
	},
	{
		id: 100011483,
		displayNameEn: 'SoS decision',
		displayOrder: 200,
		parentFolderId: 100011412,
		caseId: 15360347,
		stage: 'Decision',
		displayNameCy: null
	},
	{
		id: 100011484,
		displayNameEn: 'Habitat regulations',
		displayOrder: 600,
		parentFolderId: 100011405,
		caseId: 15360347,
		stage: 'Pre-examination',
		displayNameCy: null
	},
	{
		id: 100011485,
		displayNameEn: 'Scoping',
		displayOrder: 200,
		parentFolderId: 100011467,
		caseId: 15360347,
		stage: 'Pre-application',
		displayNameCy: null
	},
	{
		id: 100011486,
		displayNameEn: 'Recommendation and authorisation',
		displayOrder: 200,
		parentFolderId: 100011468,
		caseId: 15360347,
		stage: null,
		displayNameCy: null
	},
	{
		id: 100011487,
		displayNameEn: 'Application form',
		displayOrder: 100,
		parentFolderId: 100011476,
		caseId: 15360347,
		stage: "Developer's Application",
		displayNameCy: null
	},
	{
		id: 100011488,
		displayNameEn: 'Procedural decisions',
		displayOrder: 400,
		parentFolderId: 100011421,
		caseId: 15360347,
		stage: 'Examination',
		displayNameCy: null
	},
	{
		id: 100011489,
		displayNameEn: 'Correspondence',
		displayOrder: 300,
		parentFolderId: 100011412,
		caseId: 15360347,
		stage: 'Decision',
		displayNameCy: null
	},
	{
		id: 100011490,
		displayNameEn: '01 - Internal',
		displayOrder: 100,
		parentFolderId: 100011482,
		caseId: 15360347,
		stage: 'Post-decision',
		displayNameCy: null
	},
	{
		id: 100011491,
		displayNameEn: 'Internal ExA meetings',
		displayOrder: 500,
		parentFolderId: 100011415,
		caseId: 15360347,
		stage: null,
		displayNameCy: null
	},
	{
		id: 100011492,
		displayNameEn: 'Responses',
		displayOrder: 100,
		parentFolderId: 100011485,
		caseId: 15360347,
		stage: 'Pre-application',
		displayNameCy: null
	},
	{
		id: 100011493,
		displayNameEn: 'Correspondence',
		displayOrder: 300,
		parentFolderId: 100011468,
		caseId: 15360347,
		stage: null,
		displayNameCy: null
	},
	{
		id: 100011494,
		displayNameEn: 'Compulsory acquisition information',
		displayOrder: 200,
		parentFolderId: 100011476,
		caseId: 15360347,
		stage: "Developer's Application",
		displayNameCy: null
	},
	{
		id: 100011495,
		displayNameEn: 'EIA',
		displayOrder: 500,
		parentFolderId: 100011421,
		caseId: 15360347,
		stage: 'Examination',
		displayNameCy: null
	},
	{
		id: 100011496,
		displayNameEn: '01 - Internal',
		displayOrder: 100,
		parentFolderId: 100011489,
		caseId: 15360347,
		stage: 'Decision',
		displayNameCy: null
	},
	{
		id: 100011497,
		displayNameEn: '02 - External',
		displayOrder: 200,
		parentFolderId: 100011482,
		caseId: 15360347,
		stage: 'Post-decision',
		displayNameCy: null
	},
	{
		id: 100011498,
		displayNameEn: 'Habitat regulations',
		displayOrder: 400,
		parentFolderId: 100011409,
		caseId: 15360347,
		stage: 'Pre-application',
		displayNameCy: null
	},
	{
		id: 100011499,
		displayNameEn: 'DCO documents',
		displayOrder: 300,
		parentFolderId: 100011476,
		caseId: 15360347,
		stage: "Developer's Application",
		displayNameCy: null
	},
	{
		id: 100011500,
		displayNameEn: 'Feedback',
		displayOrder: 700,
		parentFolderId: 100011411,
		caseId: 15360347,
		stage: 'Post-decision',
		displayNameCy: null
	},
	{
		id: 100011501,
		displayNameEn: '02 - External',
		displayOrder: 200,
		parentFolderId: 100011489,
		caseId: 15360347,
		stage: 'Decision',
		displayNameCy: null
	},
	{
		id: 100011502,
		displayNameEn: 'Habitat regulations',
		displayOrder: 600,
		parentFolderId: 100011421,
		caseId: 15360347,
		stage: 'Examination',
		displayNameCy: null
	},
	{
		id: 100011503,
		displayNameEn: 'Evidence plans',
		displayOrder: 500,
		parentFolderId: 100011409,
		caseId: 15360347,
		stage: 'Pre-application',
		displayNameCy: null
	},
	{
		id: 100011504,
		displayNameEn: 'Environmental statement',
		displayOrder: 400,
		parentFolderId: 100011476,
		caseId: 15360347,
		stage: "Developer's Application",
		displayNameCy: null
	},
	{
		id: 100011505,
		displayNameEn: 'Other documents',
		displayOrder: 500,
		parentFolderId: 100011476,
		caseId: 15360347,
		stage: "Developer's Application",
		displayNameCy: null
	},
	{
		id: 100011506,
		displayNameEn: 'Draft documents',
		displayOrder: 600,
		parentFolderId: 100011409,
		caseId: 15360347,
		stage: 'Pre-application',
		displayNameCy: null
	},
	{
		id: 100011507,
		displayNameEn: 'Plans',
		displayOrder: 600,
		parentFolderId: 100011476,
		caseId: 15360347,
		stage: "Developer's Application",
		displayNameCy: null
	},
	{
		id: 100011508,
		displayNameEn: 'SOCC',
		displayOrder: 100,
		parentFolderId: 100011506,
		caseId: 15360347,
		stage: 'Pre-application',
		displayNameCy: null
	},
	{
		id: 100011509,
		displayNameEn: 'Reports',
		displayOrder: 700,
		parentFolderId: 100011476,
		caseId: 15360347,
		stage: "Developer's Application",
		displayNameCy: null
	},
	{
		id: 100011510,
		displayNameEn: "Developer's consultation",
		displayOrder: 700,
		parentFolderId: 100011409,
		caseId: 15360347,
		stage: 'Pre-application',
		displayNameCy: null
	},
	{
		id: 100011511,
		displayNameEn: 'Additional Reg 6 information',
		displayOrder: 800,
		parentFolderId: 100011476,
		caseId: 15360347,
		stage: "Developer's Application",
		displayNameCy: null
	},
	{
		id: 100011512,
		displayNameEn: 'Statutory',
		displayOrder: 100,
		parentFolderId: 100011510,
		caseId: 15360347,
		stage: 'Pre-application',
		displayNameCy: null
	},
	{
		id: 100011513,
		displayNameEn: 'Adequacy of consultation',
		displayOrder: 500,
		parentFolderId: 100011420,
		caseId: 15360347,
		stage: 'Acceptance',
		displayNameCy: null
	},
	{
		id: 100011514,
		displayNameEn: 'PEIR',
		displayOrder: 100,
		parentFolderId: 100011512,
		caseId: 15360347,
		stage: 'Pre-application',
		displayNameCy: null
	},
	{
		id: 100011515,
		displayNameEn: 'Reg 5 and Reg 6',
		displayOrder: 600,
		parentFolderId: 100011420,
		caseId: 15360347,
		stage: 'Acceptance',
		displayNameCy: null
	},
	{
		id: 100011516,
		displayNameEn: 'Drafting and decision',
		displayOrder: 700,
		parentFolderId: 100011420,
		caseId: 15360347,
		stage: 'Acceptance',
		displayNameCy: null
	},
	{
		id: 100011517,
		displayNameEn: 'Non-statutory',
		displayOrder: 200,
		parentFolderId: 100011510,
		caseId: 15360347,
		stage: 'Pre-application',
		displayNameCy: null
	},
	{
		id: 100011518,
		displayNameEn: 'Consultation feedback',
		displayOrder: 300,
		parentFolderId: 100011510,
		caseId: 15360347,
		stage: 'Pre-application',
		displayNameCy: null
	}
];

describe('folder migration utils', () => {
	describe('getDocumentFolderId', () => {
		beforeAll(() => databaseConnector.folder.findMany.mockResolvedValue(folders));
		afterEach(() => databaseConnector.folder.upsert.mockClear());

		it('returns correct folderId for path with a direct mapping', async () => {
			const document = {
				path: 'TR020002 - Manston Airport/05 - Pre-App > 06 - Meetings'
			};

			const result = await getDocumentFolderId(document, 1);

			expect(result).toEqual(100011418);
		});

		it('returns correct folderId for path with a stage mapping', async () => {
			const document = {
				path: 'TR020002 - Manston Airport/06 - Post-Submission Correspondence > 02 - Pre-Exam and Exam > 02 - External',
				documentCaseStage: 'pre-examination'
			};

			const result = await getDocumentFolderId(document, 1);

			expect(result).toEqual(100011436);
		});

		it('creates new folder within for path with no mapping', async () => {
			const document = {
				path: 'TR020002 - Manston Airport/Foo/Bar/Baz'
			};
			const caseId = 100001;

			const archiveFolder = { id: 100011419, displayNameEn: 'Archived documentation' };

			// 'Foo' folder
			const folderInput1 = { caseId, displayNameEn: 'Foo', parentFolderId: archiveFolder.id };
			const folderOutput1 = { id: 1, ...folderInput1 };

			// 'Bar' folder
			const folderInput2 = { caseId, displayNameEn: 'Bar', parentFolderId: folderOutput1.id };
			const folderOutput2 = { id: 2, ...folderInput2 };

			// 'Baz' folder
			const folderInput3 = { caseId, displayNameEn: 'Baz', parentFolderId: folderOutput2.id };
			const folderOutput3 = { id: 3, ...folderInput3 };

			databaseConnector.folder.findFirst.mockResolvedValueOnce(archiveFolder);

			// mock return value from creation of folders 'Foo', 'Bar' and 'Baz'
			databaseConnector.folder.upsert.mockResolvedValueOnce(folderOutput1);
			databaseConnector.folder.upsert.mockResolvedValueOnce(folderOutput2);
			databaseConnector.folder.upsert.mockResolvedValueOnce(folderOutput3);

			const result = await getDocumentFolderId(document, caseId);

			expect(databaseConnector.folder.upsert).toHaveBeenCalledWith({
				where: {
					caseId_displayNameEn_parentFolderId: folderInput1
				},
				update: {},
				create: folderInput1
			});
			expect(databaseConnector.folder.upsert).toHaveBeenCalledWith({
				where: {
					caseId_displayNameEn_parentFolderId: folderInput2
				},
				update: {},
				create: folderInput2
			});
			expect(databaseConnector.folder.upsert).toHaveBeenCalledWith({
				where: {
					caseId_displayNameEn_parentFolderId: folderInput3
				},
				update: {},
				create: folderInput3
			});

			expect(result).toEqual(folderOutput3.id); // function returns last created folder ID
		});

		it('returns s51 folder for path in section 51 folder', async () => {
			const document = {
				path: 'TR020002 - Manston Airport/02 - Section 51 Advice/TR020002-Advice-00001 - TEST'
			};
			const caseId = 100001;

			const s51AdviceFolder = { id: 100011407, displayNameEn: 'S51 advice' };

			databaseConnector.folder.findFirst.mockResolvedValueOnce(s51AdviceFolder);

			const result = await getDocumentFolderId(document, caseId);

			expect(databaseConnector.folder.upsert).not.toHaveBeenCalled();

			expect(result).toEqual(s51AdviceFolder.id); // function returns last created folder ID
		});
	});
});
