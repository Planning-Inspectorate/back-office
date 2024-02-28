const { databaseConnector } = await import('#utils/database-connector.js');
import { migrateFolders } from '../folder-migrator.js';

describe('folder-migrator', () => {
	describe('migrateFolders', () => {
		const inputFolders = [
			{
				id: 24601474,
				caseReference: 'TR020002',
				displayNameEnglish: 'SOCC',
				parentFolderId: 15360365,
				caseStage: 'pre-application'
			},
			{
				id: 26810831,
				caseReference: 'TR020002',
				displayNameEnglish: 'Schedule 1',
				parentFolderId: 26819966
			},
			{
				id: 28112828,
				caseReference: 'TR020002',
				displayNameEnglish: 'Revised Env. Information',
				parentFolderId: 27138001,
				caseStage: 'pre-application'
			},
			{
				id: 16746289,
				caseReference: 'TR020002',
				displayNameEnglish: 'Scoping Opinion',
				parentFolderId: 15360367,
				caseStage: 'pre-application'
			},
			{
				id: 24600274,
				caseReference: 'TR020002',
				displayNameEnglish: 'Developers Consultation',
				parentFolderId: 15360364,
				caseStage: 'pre-application'
			},
			{
				id: 15360365,
				caseReference: 'TR020002',
				displayNameEnglish: 'Draft Documents',
				parentFolderId: 15360364,
				caseStage: 'pre-application'
			},
			{
				id: 24605323,
				caseReference: 'TR020002',
				displayNameEnglish: 'Post Exam Submissions',
				parentFolderId: 24608591,
				caseStage: 'decision'
			},
			{
				id: 25425559,
				caseReference: 'TR020002',
				displayNameEnglish: 'Recommendation and Authorisation',
				parentFolderId: 25426758
			},
			{
				id: 24600385,
				caseReference: 'TR020002',
				displayNameEnglish: 'Decision',
				parentFolderId: 24605311
			},
			{
				id: 28614236,
				caseReference: 'TR020002',
				displayNameEnglish: 'Further Information Request 20180815',
				parentFolderId: 25426266
			},
			{
				id: 24600278,
				caseReference: 'TR020002',
				displayNameEnglish: 'Drafts',
				parentFolderId: 15360375
			},
			{
				id: 27890916,
				caseReference: 'TR020002',
				displayNameEnglish: 'Compulsory Acquisition Information Superseded',
				parentFolderId: 27890793
			},
			{
				id: 24607873,
				caseReference: 'TR020002',
				displayNameEnglish: 'EST',
				parentFolderId: 15360372
			},
			{
				id: 26657360,
				caseReference: 'TR020002',
				displayNameEnglish: '2018 consultation',
				parentFolderId: 24600049
			},
			{
				id: 17098663,
				caseReference: 'TR020002',
				displayNameEnglish: 'Outgoing',
				parentFolderId: 24619908
			},
			{
				id: 24600041,
				caseReference: 'TR020002',
				displayNameEnglish: 'Correspondence',
				parentFolderId: 15360359
			},
			{
				id: 29534882,
				caseReference: 'TR020002',
				displayNameEnglish: 'Acceptance',
				parentFolderId: 15360350
			},
			{
				id: 16916015,
				caseReference: 'TR020002',
				displayNameEnglish: 'Stone Hill Park',
				parentFolderId: 15360361
			},
			{
				id: 15360386,
				caseReference: 'TR020002',
				displayNameEnglish: 'Post Decision',
				caseStage: 'post_decision'
			},
			{
				id: 24835833,
				caseReference: 'TR020002',
				displayNameEnglish: 'Reports',
				parentFolderId: 24601048
			},
			{
				id: 15360366,
				caseReference: 'TR020002',
				displayNameEnglish: 'EIA',
				parentFolderId: 15360364,
				caseStage: 'pre-application'
			},
			{
				id: 24600050,
				caseReference: 'TR020002',
				displayNameEnglish: 'Decision',
				parentFolderId: 15360372
			},
			{
				id: 24610300,
				caseReference: 'TR020002',
				displayNameEnglish: 'Costs',
				parentFolderId: 15360386,
				caseStage: 'post_decision'
			},
			{
				id: 25160075,
				caseReference: 'TR020002',
				displayNameEnglish: 'Second Consultation - January 2018',
				parentFolderId: 24609186,
				caseStage: 'pre-application'
			},
			{
				id: 16746202,
				caseReference: 'TR020002',
				displayNameEnglish: 'Responses',
				parentFolderId: 15360367,
				caseStage: 'pre-application'
			},
			{
				id: 24619908,
				caseReference: 'TR020002',
				displayNameEnglish: 'Correspondence',
				parentFolderId: 15360361
			},
			{
				id: 25743820,
				caseReference: 'TR020002',
				displayNameEnglish: 'Draft Doc Comments',
				parentFolderId: 15360365,
				caseStage: 'pre-application'
			},
			{
				id: 27891745,
				caseReference: 'TR020002',
				displayNameEnglish: 'Reports Superseded',
				parentFolderId: 27890793
			},
			{
				id: 15360379,
				caseReference: 'TR020002',
				displayNameEnglish: 'Legal Advice',
				parentFolderId: 15360371
			},
			{
				id: 26819976,
				caseReference: 'TR020002',
				displayNameEnglish: 'Further Information Request 20180403',
				parentFolderId: 25426266
			},
			{
				id: 15360356,
				caseReference: 'TR020002',
				displayNameEnglish: 'Internal',
				parentFolderId: 24590508
			},
			{
				id: 27540901,
				caseReference: 'TR020002',
				displayNameEnglish: 'Drafts',
				parentFolderId: 24605401,
				caseStage: 'pre-application'
			},
			{
				id: 24601270,
				caseReference: 'TR020002',
				displayNameEnglish: 'Internal',
				parentFolderId: 24600044
			},
			{
				id: 28809091,
				caseReference: 'TR020002',
				displayNameEnglish: 'Paper RRs not on the prescribed form',
				parentFolderId: 15360371
			},
			{
				id: 24608592,
				caseReference: 'TR020002',
				displayNameEnglish: 'Procedural Decisions',
				parentFolderId: 24610399,
				caseStage: 'post_decision'
			},
			{
				id: 26820779,
				caseReference: 'TR020002',
				displayNameEnglish: 'Schedule 3',
				parentFolderId: 26819976
			},
			{
				id: 29279787,
				caseReference: 'TR020002',
				displayNameEnglish: 'Late submissions',
				parentFolderId: 29216885
			},
			{
				id: 28715548,
				caseReference: 'TR020002',
				displayNameEnglish: 'Issue',
				parentFolderId: 25426769
			},
			{
				id: 24836613,
				caseReference: 'TR020002',
				displayNameEnglish: 'Other Documents',
				parentFolderId: 24601048
			},
			{
				id: 27691140,
				caseReference: 'TR020002',
				displayNameEnglish: 'FOI - EIR',
				parentFolderId: 15360364,
				caseStage: 'pre-application'
			},
			{
				id: 24608586,
				caseReference: 'TR020002',
				displayNameEnglish: 'Internal',
				parentFolderId: 24600931
			},
			{
				id: 26658146,
				caseReference: 'TR020002',
				displayNameEnglish: 'Stat consultee responses',
				parentFolderId: 26657360
			},
			{
				id: 29460874,
				caseReference: 'TR020002',
				displayNameEnglish: 'Responded in prescribed form',
				parentFolderId: 29475559
			},
			{
				id: 26651612,
				caseReference: 'TR020002',
				displayNameEnglish: '2017 consultation',
				parentFolderId: 24600049
			},
			{
				id: 26866884,
				caseReference: 'TR020002',
				displayNameEnglish: 'Correspondence from Landowner',
				parentFolderId: 25426769
			},
			{
				id: 26656010,
				caseReference: 'TR020002',
				displayNameEnglish: 'SoCC consultation',
				parentFolderId: 24600049
			},
			{
				id: 27707254,
				caseReference: 'TR020002',
				displayNameEnglish: 'EIR Material AoCRs',
				parentFolderId: 27691140,
				caseStage: 'pre-application'
			},
			{
				id: 29421551,
				caseReference: 'TR020002',
				displayNameEnglish: 'CoI',
				parentFolderId: 15360349
			},
			{
				id: 26651492,
				caseReference: 'TR020002',
				displayNameEnglish: 'Public responses',
				parentFolderId: 26651612
			},
			{
				id: 26655523,
				caseReference: 'TR020002',
				displayNameEnglish: 'Businesses',
				parentFolderId: 26651492
			},
			{
				id: 24600382,
				caseReference: 'TR020002',
				displayNameEnglish: 'Acceptance',
				parentFolderId: 24605311
			},
			{
				id: 24619692,
				caseReference: 'TR020002',
				displayNameEnglish: 'Recommendation and Authorisation',
				parentFolderId: 15360361
			},
			{
				id: 27891681,
				caseReference: 'TR020002',
				displayNameEnglish: 'Other Documents Superseded',
				parentFolderId: 27890793
			},
			{
				id: 22000306,
				caseReference: 'TR020002',
				displayNameEnglish: 'Section 46',
				parentFolderId: 24609186,
				caseStage: 'pre-application'
			},
			{
				id: 15360367,
				caseReference: 'TR020002',
				displayNameEnglish: 'Scoping',
				parentFolderId: 15360366,
				caseStage: 'pre-application'
			},
			{
				id: 26657148,
				caseReference: 'TR020002',
				displayNameEnglish: 'Parish councils',
				parentFolderId: 26657354
			},
			{
				id: 27923594,
				caseReference: 'TR020002',
				displayNameEnglish: 'Emails',
				parentFolderId: 24601049
			},
			{
				id: 26810732,
				caseReference: 'TR020002',
				displayNameEnglish: 'Further Information Request 20180504',
				parentFolderId: 25426266
			},
			{
				id: 29223738,
				caseReference: 'TR020002',
				displayNameEnglish: "SHP's RR attachments",
				parentFolderId: 29216885
			},
			{
				id: 15360368,
				caseReference: 'TR020002',
				displayNameEnglish: 'Screening',
				parentFolderId: 15360366,
				caseStage: 'pre-application'
			},
			{
				id: 24605318,
				caseReference: 'TR020002',
				displayNameEnglish: 'Internal',
				parentFolderId: 24600385
			},
			{
				id: 24600379,
				caseReference: 'TR020002',
				displayNameEnglish: 'Outreach',
				parentFolderId: 24605401,
				caseStage: 'pre-application'
			},
			{
				id: 24600386,
				caseReference: 'TR020002',
				displayNameEnglish: 'Internal',
				parentFolderId: 24608585
			},
			{
				id: 19345595,
				caseReference: 'TR020002',
				displayNameEnglish: 's53 issue',
				parentFolderId: 15360361
			},
			{
				id: 15360372,
				caseReference: 'TR020002',
				displayNameEnglish: 'Acceptance',
				parentFolderId: 15360371
			},
			{
				id: 24601048,
				caseReference: 'TR020002',
				displayNameEnglish: 'Application Documents',
				parentFolderId: 15360372
			},
			{
				id: 26811834,
				caseReference: 'TR020002',
				displayNameEnglish: 'Schedule 1',
				parentFolderId: 26819976
			},
			{
				id: 15360364,
				caseReference: 'TR020002',
				displayNameEnglish: 'Pre-App',
				caseStage: 'pre-application'
			},
			{
				id: 15360370,
				caseReference: 'TR020002',
				displayNameEnglish: 'Evidence Plans',
				parentFolderId: 15360364,
				caseStage: 'pre-application'
			},
			{
				id: 16745646,
				caseReference: 'TR020002',
				displayNameEnglish: 'Late Scoping Responses',
				parentFolderId: 16746202,
				caseStage: 'pre-application'
			},
			{
				id: 15360378,
				caseReference: 'TR020002',
				displayNameEnglish: 'Habitat Regulations',
				parentFolderId: 15360371
			},
			{
				id: 26657289,
				caseReference: 'TR020002',
				displayNameEnglish: 'Local authority responses',
				parentFolderId: 26658146
			},
			{
				id: 27944574,
				caseReference: 'TR020002',
				displayNameEnglish: 'Superceded forms',
				parentFolderId: 24607873
			},
			{
				id: 15360351,
				caseReference: 'TR020002',
				displayNameEnglish: 'Case Management',
				parentFolderId: 15360349
			},
			{
				id: 24605311,
				caseReference: 'TR020002',
				displayNameEnglish: 'Post-Submission Correspondence'
			},
			{
				id: 24601049,
				caseReference: 'TR020002',
				displayNameEnglish: 'Adequacy of Consultation',
				parentFolderId: 15360372
			},
			{
				id: 15360349,
				caseReference: 'TR020002',
				displayNameEnglish: 'Project Management'
			},
			{
				id: 26649522,
				caseReference: 'TR020002',
				displayNameEnglish: 'Public feedback',
				parentFolderId: 26651492
			},
			{
				id: 29216885,
				caseReference: 'TR020002',
				displayNameEnglish: 'Other',
				parentFolderId: 15360371
			},
			{
				id: 26743871,
				caseReference: 'TR020002',
				displayNameEnglish: 'Emails',
				parentFolderId: 27922530
			},
			{
				id: 24609692,
				caseReference: 'TR020002',
				displayNameEnglish: 'External',
				parentFolderId: 24600162
			},
			{
				id: 26656397,
				caseReference: 'TR020002',
				displayNameEnglish: '2017 draft SoCC consultation',
				parentFolderId: 26656010
			},
			{
				id: 24600378,
				caseReference: 'TR020002',
				displayNameEnglish: 'Second Screening',
				parentFolderId: 15360363
			},
			{
				id: 26811391,
				caseReference: 'TR020002',
				displayNameEnglish: 'Further Information Request 20180309',
				parentFolderId: 25426266
			},
			{
				id: 24600545,
				caseReference: 'TR020002',
				displayNameEnglish: 'Welsh Translations',
				parentFolderId: 24600766
			},
			{
				id: 24600830,
				caseReference: 'TR020002',
				displayNameEnglish: 'External',
				parentFolderId: 24600044
			},
			{
				id: 26656073,
				caseReference: 'TR020002',
				displayNameEnglish: 'Public responses',
				parentFolderId: 26657360
			},
			{
				id: 15360363,
				caseReference: 'TR020002',
				displayNameEnglish: 'Transboundary'
			},
			{
				id: 24601478,
				caseReference: 'TR020002',
				displayNameEnglish: 'Application Documents',
				parentFolderId: 24610399,
				caseStage: 'post_decision'
			},
			{
				id: 21001019,
				caseReference: 'TR020002',
				displayNameEnglish: 'Applicant-BDB',
				parentFolderId: 24619908
			},
			{
				id: 24601600,
				caseReference: 'TR020002',
				displayNameEnglish: 'External',
				parentFolderId: 24600382
			},
			{
				id: 25426758,
				caseReference: 'TR020002',
				displayNameEnglish: '2018 S53 Application',
				parentFolderId: 15360361
			},
			{
				id: 24608591,
				caseReference: 'TR020002',
				displayNameEnglish: 'SoS Consultation',
				parentFolderId: 15360385,
				caseStage: 'decision'
			},
			{
				id: 27707253,
				caseReference: 'TR020002',
				displayNameEnglish: 'EIR Material Third Party Emails',
				parentFolderId: 27691140,
				caseStage: 'pre-application'
			},
			{
				id: 27891688,
				caseReference: 'TR020002',
				displayNameEnglish: 'Plans Superseded',
				parentFolderId: 27890793
			},
			{
				id: 24605322,
				caseReference: 'TR020002',
				displayNameEnglish: 'Consultation Docs',
				parentFolderId: 24608591,
				caseStage: 'decision'
			},
			{
				id: 24835052,
				caseReference: 'TR020002',
				displayNameEnglish: 'Compulsory Acquisition Information',
				parentFolderId: 24601048
			},
			{
				id: 24600929,
				caseReference: 'TR020002',
				displayNameEnglish: 'Non-Statutory',
				parentFolderId: 24600274,
				caseStage: 'pre-application'
			},
			{
				id: 24600931,
				caseReference: 'TR020002',
				displayNameEnglish: 'SoS',
				parentFolderId: 24605311
			},
			{
				id: 24609186,
				caseReference: 'TR020002',
				displayNameEnglish: 'Statutory',
				parentFolderId: 24600274,
				caseStage: 'pre-application'
			},
			{
				id: 26810407,
				caseReference: 'TR020002',
				displayNameEnglish: 'Schedule 2',
				parentFolderId: 26819976
			},
			{
				id: 15360380,
				caseReference: 'TR020002',
				displayNameEnglish: 'Relevant Representation Attachments',
				parentFolderId: 15360371
			},
			{
				id: 27890926,
				caseReference: 'TR020002',
				displayNameEnglish: 'DCO Documents Superseded',
				parentFolderId: 27890793
			},
			{
				id: 15360358,
				caseReference: 'TR020002',
				displayNameEnglish: 'Land Rights'
			},
			{
				id: 24610299,
				caseReference: 'TR020002',
				displayNameEnglish: 'JR',
				parentFolderId: 15360386,
				caseStage: 'post_decision'
			},
			{
				id: 24600874,
				caseReference: 'TR020002',
				displayNameEnglish: 'Programme Officer',
				parentFolderId: 24600766
			},
			{
				id: 27138001,
				caseReference: 'TR020002',
				displayNameEnglish: '2018 resubmission',
				parentFolderId: 15360365,
				caseStage: 'pre-application'
			},
			{
				id: 24609188,
				caseReference: 'TR020002',
				displayNameEnglish: 'External',
				parentFolderId: 24600931
			},
			{
				id: 15360377,
				caseReference: 'TR020002',
				displayNameEnglish: 'EIA',
				parentFolderId: 15360371
			},
			{
				id: 24600163,
				caseReference: 'TR020002',
				displayNameEnglish: 'Internal',
				parentFolderId: 24600382
			},
			{
				id: 28661379,
				caseReference: 'TR020002',
				displayNameEnglish: 'Examining Authority',
				parentFolderId: 15360371
			},
			{
				id: 26199393,
				caseReference: 'TR020002',
				displayNameEnglish: 'Emails confirming LA contact',
				parentFolderId: 26200273,
				caseStage: 'pre-application'
			},
			{
				id: 24601050,
				caseReference: 'TR020002',
				displayNameEnglish: 'Final Submitted Report',
				parentFolderId: 15360381,
				caseStage: 'recommendation'
			},
			{
				id: 16748641,
				caseReference: 'TR020002',
				displayNameEnglish: 'Scoping Background',
				parentFolderId: 15360367,
				caseStage: 'pre-application'
			},
			{
				id: 24609694,
				caseReference: 'TR020002',
				displayNameEnglish: 'Drafting',
				parentFolderId: 15360381,
				caseStage: 'recommendation'
			},
			{
				id: 24605401,
				caseReference: 'TR020002',
				displayNameEnglish: 'Meetings',
				parentFolderId: 15360364,
				caseStage: 'pre-application'
			},
			{
				id: 24601423,
				caseReference: 'TR020002',
				displayNameEnglish: 'Internal ExA Meetings',
				parentFolderId: 15360349
			},
			{
				id: 26200273,
				caseReference: 'TR020002',
				displayNameEnglish: 'LA contact details',
				parentFolderId: 24590508,
				caseStage: 'pre-application'
			},
			{
				id: 15360375,
				caseReference: 'TR020002',
				displayNameEnglish: 'Procedural Decisions',
				parentFolderId: 15360371
			},
			{
				id: 24590508,
				caseReference: 'TR020002',
				displayNameEnglish: 'Correspondence',
				parentFolderId: 15360364,
				caseStage: 'pre-application'
			},
			{
				id: 24600164,
				caseReference: 'TR020002',
				displayNameEnglish: 'External',
				parentFolderId: 24608585
			},
			{
				id: 26656248,
				caseReference: 'TR020002',
				displayNameEnglish: 'PIL responses',
				parentFolderId: 26657360
			},
			{
				id: 15360350,
				caseReference: 'TR020002',
				displayNameEnglish: 'Fees',
				parentFolderId: 15360349
			},
			{
				id: 27890933,
				caseReference: 'TR020002',
				displayNameEnglish: 'Environmental Statement Superseded',
				parentFolderId: 27890793
			},
			{
				id: 26657247,
				caseReference: 'TR020002',
				displayNameEnglish: 'Prescribed consultee responses',
				parentFolderId: 26656583
			},
			{
				id: 21003872,
				caseReference: 'TR020002',
				displayNameEnglish: 'SHP-HSF',
				parentFolderId: 24619908
			},
			{
				id: 28544880,
				caseReference: 'TR020002',
				displayNameEnglish: 'Further Information Request 20180531',
				parentFolderId: 25426266
			},
			{
				id: 26656583,
				caseReference: 'TR020002',
				displayNameEnglish: 'Stats con responses',
				parentFolderId: 26651612
			},
			{
				id: 15360374,
				caseReference: 'TR020002',
				displayNameEnglish: 'Additional Submissions',
				parentFolderId: 15360371
			},
			{
				id: 15360352,
				caseReference: 'TR020002',
				displayNameEnglish: 'Section 51 Advice'
			},
			{
				id: 15360361,
				caseReference: 'TR020002',
				displayNameEnglish: 's53',
				parentFolderId: 15360358
			},
			{
				id: 24605319,
				caseReference: 'TR020002',
				displayNameEnglish: 'External',
				parentFolderId: 24600385
			},
			{
				id: 15360369,
				caseReference: 'TR020002',
				displayNameEnglish: 'Habitat Regulations',
				parentFolderId: 15360364,
				caseStage: 'pre-application'
			},
			{
				id: 29282660,
				caseReference: 'TR020002',
				displayNameEnglish: 'Corres',
				parentFolderId: 29279787
			},
			{
				id: 16628369,
				caseReference: 'TR020002',
				displayNameEnglish: 'June 2016 Reg 9 list',
				parentFolderId: 15360367,
				caseStage: 'pre-application'
			},
			{
				id: 26820305,
				caseReference: 'TR020002',
				displayNameEnglish: 'Schedule 3',
				parentFolderId: 26819966
			},
			{
				id: 24608585,
				caseReference: 'TR020002',
				displayNameEnglish: 'Post Decision',
				parentFolderId: 24605311
			},
			{
				id: 25426769,
				caseReference: 'TR020002',
				displayNameEnglish: 'Correspondence',
				parentFolderId: 25426758
			},
			{
				id: 24600162,
				caseReference: 'TR020002',
				displayNameEnglish: 'Recommendation',
				parentFolderId: 24605311
			},
			{
				id: 15360357,
				caseReference: 'TR020002',
				displayNameEnglish: 'External',
				parentFolderId: 24590508
			},
			{
				id: 26819966,
				caseReference: 'TR020002',
				displayNameEnglish: 'Further Information Request 20180308',
				parentFolderId: 25426266
			},
			{
				id: 25426266,
				caseReference: 'TR020002',
				displayNameEnglish: "Applicant's Request",
				parentFolderId: 25426758
			},
			{
				id: 26657405,
				caseReference: 'TR020002',
				displayNameEnglish: 'Prescribed consultee responses',
				parentFolderId: 26658146
			},
			{
				id: 26657354,
				caseReference: 'TR020002',
				displayNameEnglish: 'Local authority responses',
				parentFolderId: 26656583
			},
			{
				id: 27695674,
				caseReference: 'TR020002',
				displayNameEnglish: 'EIR Material Applicant Emails',
				parentFolderId: 27691140
			},
			{
				id: 24836614,
				caseReference: 'TR020002',
				displayNameEnglish: 'Additional Reg 6 Information',
				parentFolderId: 24601048
			},
			{
				id: 24605406,
				caseReference: 'TR020002',
				displayNameEnglish: 'Feedback',
				parentFolderId: 15360386,
				caseStage: 'post_decision'
			},
			{
				id: 27890899,
				caseReference: 'TR020002',
				displayNameEnglish: 'Application Form Superseded',
				parentFolderId: 27890793
			},
			{
				id: 24600766,
				caseReference: 'TR020002',
				displayNameEnglish: 'Logistics',
				parentFolderId: 15360349
			},
			{
				id: 19977999,
				caseReference: 'TR020002',
				displayNameEnglish: 'Unredacted version',
				parentFolderId: 19977113
			},
			{
				id: 24600652,
				caseReference: 'TR020002',
				displayNameEnglish: 'Travel',
				parentFolderId: 24600766
			},
			{
				id: 24600049,
				caseReference: 'TR020002',
				displayNameEnglish: 'Reg 5',
				parentFolderId: 15360372
			},
			{
				id: 29783297,
				caseReference: 'TR020002',
				displayNameEnglish: 'RR attachments',
				parentFolderId: 29475559
			},
			{
				id: 26657098,
				caseReference: 'TR020002',
				displayNameEnglish: '2018 draft SoCC consultation',
				parentFolderId: 26656010
			},
			{
				id: 15360373,
				caseReference: 'TR020002',
				displayNameEnglish: 'Post Submission Changes',
				parentFolderId: 15360371
			},
			{
				id: 24600044,
				caseReference: 'TR020002',
				displayNameEnglish: 'Pre-Exam and Exam',
				parentFolderId: 24605311
			},
			{
				id: 15360381,
				caseReference: 'TR020002',
				displayNameEnglish: 'Recommendation',
				caseStage: 'recommendation'
			},
			{
				id: 24601471,
				caseReference: 'TR020002',
				displayNameEnglish: 'Recommendation and Authorisation',
				parentFolderId: 15360359
			},
			{
				id: 24609696,
				caseReference: 'TR020002',
				displayNameEnglish: 'Consultation Responses',
				parentFolderId: 24610399,
				caseStage: 'post_decision'
			},
			{
				id: 24836830,
				caseReference: 'TR020002',
				displayNameEnglish: 'Environmental Statement',
				parentFolderId: 24601048
			},
			{
				id: 27923382,
				caseReference: 'TR020002',
				displayNameEnglish: 'First submission',
				parentFolderId: 15360350
			},
			{
				id: 27889961,
				caseReference: 'TR020002',
				displayNameEnglish: 'First submission',
				parentFolderId: 24609693
			},
			{
				id: 27922530,
				caseReference: 'TR020002',
				displayNameEnglish: 'First submission',
				parentFolderId: 24601049
			},
			{
				id: 24601476,
				caseReference: 'TR020002',
				displayNameEnglish: 'Internal',
				parentFolderId: 24600162
			},
			{
				id: 29475559,
				caseReference: 'TR020002',
				displayNameEnglish: 'RRs related documents',
				parentFolderId: 15360349
			},
			{
				id: 24600042,
				caseReference: 'TR020002',
				displayNameEnglish: 'First Screening',
				parentFolderId: 15360363
			},
			{
				id: 16748636,
				caseReference: 'TR020002',
				displayNameEnglish: 'Scoping Request',
				parentFolderId: 15360367,
				caseStage: 'pre-application'
			},
			{
				id: 24834971,
				caseReference: 'TR020002',
				displayNameEnglish: 'Application Form',
				parentFolderId: 24601048
			},
			{
				id: 19977113,
				caseReference: 'TR020002',
				displayNameEnglish: 'FOI Request',
				parentFolderId: 15360361
			},
			{
				id: 24601044,
				caseReference: 'TR020002',
				displayNameEnglish: 'Consultation Feedback',
				parentFolderId: 24600274,
				caseStage: 'pre-application'
			},
			{
				id: 24600270,
				caseReference: 'TR020002',
				displayNameEnglish: 'Applicants Request',
				parentFolderId: 15360359
			},
			{
				id: 27891791,
				caseReference: 'TR020002',
				displayNameEnglish: 'Additional Reg 6 Information Superseded',
				parentFolderId: 27890793
			},
			{
				id: 21004907,
				caseReference: 'TR020002',
				displayNameEnglish: 'PINS',
				parentFolderId: 24619908
			},
			{
				id: 26655527,
				caseReference: 'TR020002',
				displayNameEnglish: 'Community groups',
				parentFolderId: 26651492
			},
			{
				id: 27890793,
				caseReference: 'TR020002',
				displayNameEnglish: 'Superseded Application Documents',
				parentFolderId: 24601048
			},
			{
				id: 29534331,
				caseReference: 'TR020002',
				displayNameEnglish: 'Reg 6',
				parentFolderId: 15360350
			},
			{
				id: 26655916,
				caseReference: 'TR020002',
				displayNameEnglish: 'PIL responses',
				parentFolderId: 26651612
			},
			{
				id: 15360376,
				caseReference: 'TR020002',
				displayNameEnglish: 'Exam Timetable',
				parentFolderId: 15360371,
				caseStage: 'examination'
			},
			{
				id: 24617004,
				caseReference: 'TR020002',
				displayNameEnglish: 'Applicants Request',
				parentFolderId: 15360361
			},
			{
				id: 26822498,
				caseReference: 'TR020002',
				displayNameEnglish: 'Schedule 2',
				parentFolderId: 26810732
			},
			{
				id: 24610399,
				caseReference: 'TR020002',
				displayNameEnglish: 'Non-Material Change',
				parentFolderId: 15360386,
				caseStage: 'post_decision'
			},
			{
				id: 24609693,
				caseReference: 'TR020002',
				displayNameEnglish: 'Drafting',
				parentFolderId: 15360372
			},
			{
				id: 24836452,
				caseReference: 'TR020002',
				displayNameEnglish: 'Plans',
				parentFolderId: 24601048
			},
			{
				id: 15360385,
				caseReference: 'TR020002',
				displayNameEnglish: 'Decision',
				caseStage: 'decision'
			},
			{
				id: 15360382,
				caseReference: 'TR020002',
				displayNameEnglish: 'Documents Received',
				parentFolderId: 15360381,
				caseStage: 'recommendation'
			},
			{
				id: 24836073,
				caseReference: 'TR020002',
				displayNameEnglish: 'DCO Documents',
				parentFolderId: 24601048
			},
			{
				id: 15360371,
				caseReference: 'TR020002',
				displayNameEnglish: 'Acceptance, Pre-Exam and Exam'
			},
			{
				id: 19361878,
				caseReference: 'TR020002',
				displayNameEnglish: 'Redacted copy',
				parentFolderId: 15360361
			},
			{
				id: 26657050,
				caseReference: 'TR020002',
				displayNameEnglish: 'Local authorities',
				parentFolderId: 26657354
			},
			{
				id: 24609190,
				caseReference: 'TR020002',
				displayNameEnglish: 'SoS Decision',
				parentFolderId: 15360385,
				caseStage: 'decision'
			},
			{
				id: 19977997,
				caseReference: 'TR020002',
				displayNameEnglish: 'Redacted version',
				parentFolderId: 19977113
			},
			{
				id: 15360359,
				caseReference: 'TR020002',
				displayNameEnglish: 's52',
				parentFolderId: 15360358
			}
		];

		const outputFolders = [
			{
				id: 15360386,
				displayNameEn: 'Post-decision',
				displayOrder: null,
				caseId: 1234567,
				stage: 'post_decision'
			},
			{
				id: 24610300,
				displayNameEn: 'Costs',
				displayOrder: null,
				parentFolderId: 15360386,
				caseId: 1234567,
				stage: 'post_decision'
			},
			{
				id: 24610299,
				displayNameEn: 'JR',
				displayOrder: null,
				parentFolderId: 15360386,
				caseId: 1234567,
				stage: 'post_decision'
			},
			{
				id: 24605406,
				displayNameEn: 'Feedback',
				displayOrder: null,
				parentFolderId: 15360386,
				caseId: 1234567,
				stage: 'post_decision'
			},
			{
				id: 24610399,
				displayNameEn: 'Non-Material Change',
				displayOrder: null,
				parentFolderId: 15360386,
				caseId: 1234567,
				stage: 'post_decision'
			},
			{
				id: 24608592,
				displayNameEn: 'Procedural Decisions',
				displayOrder: null,
				parentFolderId: 24610399,
				caseId: 1234567,
				stage: 'post_decision'
			},
			{
				id: 24601478,
				displayNameEn: 'Application Documents',
				displayOrder: null,
				parentFolderId: 24610399,
				caseId: 1234567,
				stage: 'post_decision'
			},
			{
				id: 24609696,
				displayNameEn: 'Consultation Responses',
				displayOrder: null,
				parentFolderId: 24610399,
				caseId: 1234567,
				stage: 'post_decision'
			},
			{
				id: 15360364,
				displayNameEn: 'Pre-application',
				displayOrder: null,
				caseId: 1234567,
				stage: 'pre-application'
			},
			{
				id: 24600274,
				displayNameEn: 'Developers Consultation',
				displayOrder: null,
				parentFolderId: 15360364,
				caseId: 1234567,
				stage: 'pre-application'
			},
			{
				id: 24600929,
				displayNameEn: 'Non-Statutory',
				displayOrder: null,
				parentFolderId: 24600274,
				caseId: 1234567,
				stage: 'pre-application'
			},
			{
				id: 24609186,
				displayNameEn: 'Statutory',
				displayOrder: null,
				parentFolderId: 24600274,
				caseId: 1234567,
				stage: 'pre-application'
			},
			{
				id: 25160075,
				displayNameEn: 'Second Consultation - January 2018',
				displayOrder: null,
				parentFolderId: 24609186,
				caseId: 1234567,
				stage: 'pre-application'
			},
			{
				id: 22000306,
				displayNameEn: 'Section 46',
				displayOrder: null,
				parentFolderId: 24609186,
				caseId: 1234567,
				stage: 'pre-application'
			},
			{
				id: 24601044,
				displayNameEn: 'Consultation Feedback',
				displayOrder: null,
				parentFolderId: 24600274,
				caseId: 1234567,
				stage: 'pre-application'
			},
			{
				id: 15360365,
				displayNameEn: 'Draft Documents',
				displayOrder: null,
				parentFolderId: 15360364,
				caseId: 1234567,
				stage: 'pre-application'
			},
			{
				id: 24601474,
				displayNameEn: 'SOCC',
				displayOrder: null,
				parentFolderId: 15360365,
				caseId: 1234567,
				stage: 'pre-application'
			},
			{
				id: 25743820,
				displayNameEn: 'Draft Doc Comments',
				displayOrder: null,
				parentFolderId: 15360365,
				caseId: 1234567,
				stage: 'pre-application'
			},
			{
				id: 27138001,
				displayNameEn: '2018 resubmission',
				displayOrder: null,
				parentFolderId: 15360365,
				caseId: 1234567,
				stage: 'pre-application'
			},
			{
				id: 28112828,
				displayNameEn: 'Revised Env. Information',
				displayOrder: null,
				parentFolderId: 27138001,
				caseId: 1234567,
				stage: 'pre-application'
			},
			{
				id: 15360366,
				displayNameEn: 'EIA',
				displayOrder: null,
				parentFolderId: 15360364,
				caseId: 1234567,
				stage: 'pre-application'
			},
			{
				id: 15360367,
				displayNameEn: 'Scoping',
				displayOrder: null,
				parentFolderId: 15360366,
				caseId: 1234567,
				stage: 'pre-application'
			},
			{
				id: 16746289,
				displayNameEn: 'Scoping Opinion',
				displayOrder: null,
				parentFolderId: 15360367,
				caseId: 1234567,
				stage: 'pre-application'
			},
			{
				id: 16746202,
				displayNameEn: 'Responses',
				displayOrder: null,
				parentFolderId: 15360367,
				caseId: 1234567,
				stage: 'pre-application'
			},
			{
				id: 16745646,
				displayNameEn: 'Late Scoping Responses',
				displayOrder: null,
				parentFolderId: 16746202,
				caseId: 1234567,
				stage: 'pre-application'
			},
			{
				id: 16748641,
				displayNameEn: 'Scoping Background',
				displayOrder: null,
				parentFolderId: 15360367,
				caseId: 1234567,
				stage: 'pre-application'
			},
			{
				id: 16628369,
				displayNameEn: 'June 2016 Reg 9 list',
				displayOrder: null,
				parentFolderId: 15360367,
				caseId: 1234567,
				stage: 'pre-application'
			},
			{
				id: 16748636,
				displayNameEn: 'Scoping Request',
				displayOrder: null,
				parentFolderId: 15360367,
				caseId: 1234567,
				stage: 'pre-application'
			},
			{
				id: 15360368,
				displayNameEn: 'Screening',
				displayOrder: null,
				parentFolderId: 15360366,
				caseId: 1234567,
				stage: 'pre-application'
			},
			{
				id: 27691140,
				displayNameEn: 'FOI - EIR',
				displayOrder: null,
				parentFolderId: 15360364,
				caseId: 1234567,
				stage: 'pre-application'
			},
			{
				id: 27707254,
				displayNameEn: 'EIR Material AoCRs',
				displayOrder: null,
				parentFolderId: 27691140,
				caseId: 1234567,
				stage: 'pre-application'
			},
			{
				id: 27707253,
				displayNameEn: 'EIR Material Third Party Emails',
				displayOrder: null,
				parentFolderId: 27691140,
				caseId: 1234567,
				stage: 'pre-application'
			},
			{
				id: 27695674,
				displayNameEn: 'EIR Material Applicant Emails',
				displayOrder: null,
				parentFolderId: 27691140,
				caseId: 1234567
			},
			{
				id: 15360370,
				displayNameEn: 'Evidence Plans',
				displayOrder: null,
				parentFolderId: 15360364,
				caseId: 1234567,
				stage: 'pre-application'
			},
			{
				id: 24605401,
				displayNameEn: 'Meetings',
				displayOrder: null,
				parentFolderId: 15360364,
				caseId: 1234567,
				stage: 'pre-application'
			},
			{
				id: 27540901,
				displayNameEn: 'Drafts',
				displayOrder: null,
				parentFolderId: 24605401,
				caseId: 1234567,
				stage: 'pre-application'
			},
			{
				id: 24600379,
				displayNameEn: 'Outreach',
				displayOrder: null,
				parentFolderId: 24605401,
				caseId: 1234567,
				stage: 'pre-application'
			},
			{
				id: 24590508,
				displayNameEn: 'Correspondence',
				displayOrder: null,
				parentFolderId: 15360364,
				caseId: 1234567,
				stage: 'pre-application'
			},
			{
				id: 15360356,
				displayNameEn: 'Internal',
				displayOrder: null,
				parentFolderId: 24590508,
				caseId: 1234567
			},
			{
				id: 26200273,
				displayNameEn: 'LA contact details',
				displayOrder: null,
				parentFolderId: 24590508,
				caseId: 1234567,
				stage: 'pre-application'
			},
			{
				id: 26199393,
				displayNameEn: 'Emails confirming LA contact',
				displayOrder: null,
				parentFolderId: 26200273,
				caseId: 1234567,
				stage: 'pre-application'
			},
			{
				id: 15360357,
				displayNameEn: 'External',
				displayOrder: null,
				parentFolderId: 24590508,
				caseId: 1234567
			},
			{
				id: 15360369,
				displayNameEn: 'Habitat Regulations',
				displayOrder: null,
				parentFolderId: 15360364,
				caseId: 1234567,
				stage: 'pre-application'
			},
			{
				id: 24605311,
				displayNameEn: 'Post-Submission Correspondence',
				displayOrder: null,
				caseId: 1234567
			},
			{
				id: 24600385,
				displayNameEn: 'Decision',
				displayOrder: null,
				parentFolderId: 24605311,
				caseId: 1234567
			},
			{
				id: 24605318,
				displayNameEn: 'Internal',
				displayOrder: null,
				parentFolderId: 24600385,
				caseId: 1234567
			},
			{
				id: 24605319,
				displayNameEn: 'External',
				displayOrder: null,
				parentFolderId: 24600385,
				caseId: 1234567
			},
			{
				id: 24600382,
				displayNameEn: 'Acceptance',
				displayOrder: null,
				parentFolderId: 24605311,
				caseId: 1234567
			},
			{
				id: 24601600,
				displayNameEn: 'External',
				displayOrder: null,
				parentFolderId: 24600382,
				caseId: 1234567
			},
			{
				id: 24600163,
				displayNameEn: 'Internal',
				displayOrder: null,
				parentFolderId: 24600382,
				caseId: 1234567
			},
			{
				id: 24600931,
				displayNameEn: 'SoS',
				displayOrder: null,
				parentFolderId: 24605311,
				caseId: 1234567
			},
			{
				id: 24608586,
				displayNameEn: 'Internal',
				displayOrder: null,
				parentFolderId: 24600931,
				caseId: 1234567
			},
			{
				id: 24609188,
				displayNameEn: 'External',
				displayOrder: null,
				parentFolderId: 24600931,
				caseId: 1234567
			},
			{
				id: 24608585,
				displayNameEn: 'Post-decision',
				displayOrder: null,
				parentFolderId: 24605311,
				caseId: 1234567
			},
			{
				id: 24600386,
				displayNameEn: 'Internal',
				displayOrder: null,
				parentFolderId: 24608585,
				caseId: 1234567
			},
			{
				id: 24600164,
				displayNameEn: 'External',
				displayOrder: null,
				parentFolderId: 24608585,
				caseId: 1234567
			},
			{
				id: 24600162,
				displayNameEn: 'Recommendation',
				displayOrder: null,
				parentFolderId: 24605311,
				caseId: 1234567
			},
			{
				id: 24609692,
				displayNameEn: 'External',
				displayOrder: null,
				parentFolderId: 24600162,
				caseId: 1234567
			},
			{
				id: 24601476,
				displayNameEn: 'Internal',
				displayOrder: null,
				parentFolderId: 24600162,
				caseId: 1234567
			},
			{
				id: 24600044,
				displayNameEn: 'Pre-Exam and Exam',
				displayOrder: null,
				parentFolderId: 24605311,
				caseId: 1234567
			},
			{
				id: 24601270,
				displayNameEn: 'Internal',
				displayOrder: null,
				parentFolderId: 24600044,
				caseId: 1234567
			},
			{
				id: 24600830,
				displayNameEn: 'External',
				displayOrder: null,
				parentFolderId: 24600044,
				caseId: 1234567
			},
			{
				id: 15360349,
				displayNameEn: 'Project management',
				displayOrder: null,
				caseId: 1234567
			},
			{
				id: 29421551,
				displayNameEn: 'CoI',
				displayOrder: null,
				parentFolderId: 15360349,
				caseId: 1234567
			},
			{
				id: 15360351,
				displayNameEn: 'Case Management',
				displayOrder: null,
				parentFolderId: 15360349,
				caseId: 1234567
			},
			{
				id: 24601423,
				displayNameEn: 'Internal ExA Meetings',
				displayOrder: null,
				parentFolderId: 15360349,
				caseId: 1234567
			},
			{
				id: 15360350,
				displayNameEn: 'Fees',
				displayOrder: null,
				parentFolderId: 15360349,
				caseId: 1234567
			},
			{
				id: 29534882,
				displayNameEn: 'Acceptance',
				displayOrder: null,
				parentFolderId: 15360350,
				caseId: 1234567
			},
			{
				id: 27923382,
				displayNameEn: 'First submission',
				displayOrder: null,
				parentFolderId: 15360350,
				caseId: 1234567
			},
			{
				id: 29534331,
				displayNameEn: 'Reg 6',
				displayOrder: null,
				parentFolderId: 15360350,
				caseId: 1234567
			},
			{
				id: 24600766,
				displayNameEn: 'Logistics',
				displayOrder: null,
				parentFolderId: 15360349,
				caseId: 1234567
			},
			{
				id: 24600545,
				displayNameEn: 'Welsh Translations',
				displayOrder: null,
				parentFolderId: 24600766,
				caseId: 1234567
			},
			{
				id: 24600874,
				displayNameEn: 'Programme Officer',
				displayOrder: null,
				parentFolderId: 24600766,
				caseId: 1234567
			},
			{
				id: 24600652,
				displayNameEn: 'Travel',
				displayOrder: null,
				parentFolderId: 24600766,
				caseId: 1234567
			},
			{
				id: 29475559,
				displayNameEn: 'RRs related documents',
				displayOrder: null,
				parentFolderId: 15360349,
				caseId: 1234567
			},
			{
				id: 29460874,
				displayNameEn: 'Responded in prescribed form',
				displayOrder: null,
				parentFolderId: 29475559,
				caseId: 1234567
			},
			{
				id: 29783297,
				displayNameEn: 'RR attachments',
				displayOrder: null,
				parentFolderId: 29475559,
				caseId: 1234567
			},
			{
				id: 15360363,
				displayNameEn: 'Transboundary',
				displayOrder: null,
				caseId: 1234567
			},
			{
				id: 24600378,
				displayNameEn: 'Second Screening',
				displayOrder: null,
				parentFolderId: 15360363,
				caseId: 1234567
			},
			{
				id: 24600042,
				displayNameEn: 'First Screening',
				displayOrder: null,
				parentFolderId: 15360363,
				caseId: 1234567
			},
			{
				id: 15360358,
				displayNameEn: 'Land rights',
				displayOrder: null,
				caseId: 1234567
			},
			{
				id: 15360361,
				displayNameEn: 's53',
				displayOrder: null,
				parentFolderId: 15360358,
				caseId: 1234567
			},
			{
				id: 16916015,
				displayNameEn: 'Stone Hill Park',
				displayOrder: null,
				parentFolderId: 15360361,
				caseId: 1234567
			},
			{
				id: 24619908,
				displayNameEn: 'Correspondence',
				displayOrder: null,
				parentFolderId: 15360361,
				caseId: 1234567
			},
			{
				id: 17098663,
				displayNameEn: 'Outgoing',
				displayOrder: null,
				parentFolderId: 24619908,
				caseId: 1234567
			},
			{
				id: 21001019,
				displayNameEn: 'Applicant-BDB',
				displayOrder: null,
				parentFolderId: 24619908,
				caseId: 1234567
			},
			{
				id: 21003872,
				displayNameEn: 'SHP-HSF',
				displayOrder: null,
				parentFolderId: 24619908,
				caseId: 1234567
			},
			{
				id: 21004907,
				displayNameEn: 'PINS',
				displayOrder: null,
				parentFolderId: 24619908,
				caseId: 1234567
			},
			{
				id: 24619692,
				displayNameEn: 'Recommendation and Authorisation',
				displayOrder: null,
				parentFolderId: 15360361,
				caseId: 1234567
			},
			{
				id: 19345595,
				displayNameEn: 's53 issue',
				displayOrder: null,
				parentFolderId: 15360361,
				caseId: 1234567
			},
			{
				id: 25426758,
				displayNameEn: '2018 S53 Application',
				displayOrder: null,
				parentFolderId: 15360361,
				caseId: 1234567
			},
			{
				id: 25425559,
				displayNameEn: 'Recommendation and Authorisation',
				displayOrder: null,
				parentFolderId: 25426758,
				caseId: 1234567
			},
			{
				id: 25426769,
				displayNameEn: 'Correspondence',
				displayOrder: null,
				parentFolderId: 25426758,
				caseId: 1234567
			},
			{
				id: 28715548,
				displayNameEn: 'Issue',
				displayOrder: null,
				parentFolderId: 25426769,
				caseId: 1234567
			},
			{
				id: 26866884,
				displayNameEn: 'Correspondence from Landowner',
				displayOrder: null,
				parentFolderId: 25426769,
				caseId: 1234567
			},
			{
				id: 25426266,
				displayNameEn: "Applicant's Request",
				displayOrder: null,
				parentFolderId: 25426758,
				caseId: 1234567
			},
			{
				id: 28614236,
				displayNameEn: 'Further Information Request 20180815',
				displayOrder: null,
				parentFolderId: 25426266,
				caseId: 1234567
			},
			{
				id: 26819976,
				displayNameEn: 'Further Information Request 20180403',
				displayOrder: null,
				parentFolderId: 25426266,
				caseId: 1234567
			},
			{
				id: 26820779,
				displayNameEn: 'Schedule 3',
				displayOrder: null,
				parentFolderId: 26819976,
				caseId: 1234567
			},
			{
				id: 26811834,
				displayNameEn: 'Schedule 1',
				displayOrder: null,
				parentFolderId: 26819976,
				caseId: 1234567
			},
			{
				id: 26810407,
				displayNameEn: 'Schedule 2',
				displayOrder: null,
				parentFolderId: 26819976,
				caseId: 1234567
			},
			{
				id: 26810732,
				displayNameEn: 'Further Information Request 20180504',
				displayOrder: null,
				parentFolderId: 25426266,
				caseId: 1234567
			},
			{
				id: 26822498,
				displayNameEn: 'Schedule 2',
				displayOrder: null,
				parentFolderId: 26810732,
				caseId: 1234567
			},
			{
				id: 26811391,
				displayNameEn: 'Further Information Request 20180309',
				displayOrder: null,
				parentFolderId: 25426266,
				caseId: 1234567
			},
			{
				id: 28544880,
				displayNameEn: 'Further Information Request 20180531',
				displayOrder: null,
				parentFolderId: 25426266,
				caseId: 1234567
			},
			{
				id: 26819966,
				displayNameEn: 'Further Information Request 20180308',
				displayOrder: null,
				parentFolderId: 25426266,
				caseId: 1234567
			},
			{
				id: 26810831,
				displayNameEn: 'Schedule 1',
				displayOrder: null,
				parentFolderId: 26819966,
				caseId: 1234567
			},
			{
				id: 26820305,
				displayNameEn: 'Schedule 3',
				displayOrder: null,
				parentFolderId: 26819966,
				caseId: 1234567
			},
			{
				id: 19977113,
				displayNameEn: 'FOI Request',
				displayOrder: null,
				parentFolderId: 15360361,
				caseId: 1234567
			},
			{
				id: 19977999,
				displayNameEn: 'Unredacted version',
				displayOrder: null,
				parentFolderId: 19977113,
				caseId: 1234567
			},
			{
				id: 19977997,
				displayNameEn: 'Redacted version',
				displayOrder: null,
				parentFolderId: 19977113,
				caseId: 1234567
			},
			{
				id: 24617004,
				displayNameEn: 'Applicants Request',
				displayOrder: null,
				parentFolderId: 15360361,
				caseId: 1234567
			},
			{
				id: 19361878,
				displayNameEn: 'Redacted copy',
				displayOrder: null,
				parentFolderId: 15360361,
				caseId: 1234567
			},
			{
				id: 15360359,
				displayNameEn: 's52',
				displayOrder: null,
				parentFolderId: 15360358,
				caseId: 1234567
			},
			{
				id: 24600041,
				displayNameEn: 'Correspondence',
				displayOrder: null,
				parentFolderId: 15360359,
				caseId: 1234567
			},
			{
				id: 24601471,
				displayNameEn: 'Recommendation and Authorisation',
				displayOrder: null,
				parentFolderId: 15360359,
				caseId: 1234567
			},
			{
				id: 24600270,
				displayNameEn: 'Applicants Request',
				displayOrder: null,
				parentFolderId: 15360359,
				caseId: 1234567
			},
			{
				id: 15360352,
				displayNameEn: 'S51 advice',
				displayOrder: null,
				caseId: 1234567
			},
			{
				id: 15360381,
				displayNameEn: 'Recommendation',
				displayOrder: null,
				caseId: 1234567,
				stage: 'recommendation'
			},
			{
				id: 24601050,
				displayNameEn: 'Final Submitted Report',
				displayOrder: null,
				parentFolderId: 15360381,
				caseId: 1234567,
				stage: 'recommendation'
			},
			{
				id: 24609694,
				displayNameEn: 'Drafting',
				displayOrder: null,
				parentFolderId: 15360381,
				caseId: 1234567,
				stage: 'recommendation'
			},
			{
				id: 15360382,
				displayNameEn: 'Documents Received',
				displayOrder: null,
				parentFolderId: 15360381,
				caseId: 1234567,
				stage: 'recommendation'
			},
			{
				id: 15360385,
				displayNameEn: 'Decision',
				displayOrder: null,
				caseId: 1234567,
				stage: 'decision'
			},
			{
				id: 24608591,
				displayNameEn: 'SoS Consultation',
				displayOrder: null,
				parentFolderId: 15360385,
				caseId: 1234567,
				stage: 'decision'
			},
			{
				id: 24605323,
				displayNameEn: 'Post Exam Submissions',
				displayOrder: null,
				parentFolderId: 24608591,
				caseId: 1234567,
				stage: 'decision'
			},
			{
				id: 24605322,
				displayNameEn: 'Consultation Docs',
				displayOrder: null,
				parentFolderId: 24608591,
				caseId: 1234567,
				stage: 'decision'
			},
			{
				id: 24609190,
				displayNameEn: 'SoS Decision',
				displayOrder: null,
				parentFolderId: 15360385,
				caseId: 1234567,
				stage: 'decision'
			},
			{
				id: 15360371,
				displayNameEn: 'Acceptance, Pre-Exam and Exam',
				displayOrder: null,
				caseId: 1234567
			},
			{
				id: 15360379,
				displayNameEn: 'Legal Advice',
				displayOrder: null,
				parentFolderId: 15360371,
				caseId: 1234567
			},
			{
				id: 28809091,
				displayNameEn: 'Paper RRs not on the prescribed form',
				displayOrder: null,
				parentFolderId: 15360371,
				caseId: 1234567
			},
			{
				id: 15360372,
				displayNameEn: 'Acceptance',
				displayOrder: null,
				parentFolderId: 15360371,
				caseId: 1234567
			},
			{
				id: 24607873,
				displayNameEn: 'EST',
				displayOrder: null,
				parentFolderId: 15360372,
				caseId: 1234567
			},
			{
				id: 27944574,
				displayNameEn: 'Superceded forms',
				displayOrder: null,
				parentFolderId: 24607873,
				caseId: 1234567
			},
			{
				id: 24600050,
				displayNameEn: 'Decision',
				displayOrder: null,
				parentFolderId: 15360372,
				caseId: 1234567
			},
			{
				id: 24601048,
				displayNameEn: 'Application Documents',
				displayOrder: null,
				parentFolderId: 15360372,
				caseId: 1234567
			},
			{
				id: 24835833,
				displayNameEn: 'Reports',
				displayOrder: null,
				parentFolderId: 24601048,
				caseId: 1234567
			},
			{
				id: 24836613,
				displayNameEn: 'Other Documents',
				displayOrder: null,
				parentFolderId: 24601048,
				caseId: 1234567
			},
			{
				id: 24835052,
				displayNameEn: 'Compulsory Acquisition Information',
				displayOrder: null,
				parentFolderId: 24601048,
				caseId: 1234567
			},
			{
				id: 24836614,
				displayNameEn: 'Additional Reg 6 Information',
				displayOrder: null,
				parentFolderId: 24601048,
				caseId: 1234567
			},
			{
				id: 24836830,
				displayNameEn: 'Environmental Statement',
				displayOrder: null,
				parentFolderId: 24601048,
				caseId: 1234567
			},
			{
				id: 24834971,
				displayNameEn: 'Application Form',
				displayOrder: null,
				parentFolderId: 24601048,
				caseId: 1234567
			},
			{
				id: 27890793,
				displayNameEn: 'Superseded Application Documents',
				displayOrder: null,
				parentFolderId: 24601048,
				caseId: 1234567
			},
			{
				id: 27890916,
				displayNameEn: 'Compulsory Acquisition Information Superseded',
				displayOrder: null,
				parentFolderId: 27890793,
				caseId: 1234567
			},
			{
				id: 27891745,
				displayNameEn: 'Reports Superseded',
				displayOrder: null,
				parentFolderId: 27890793,
				caseId: 1234567
			},
			{
				id: 27891681,
				displayNameEn: 'Other Documents Superseded',
				displayOrder: null,
				parentFolderId: 27890793,
				caseId: 1234567
			},
			{
				id: 27891688,
				displayNameEn: 'Plans Superseded',
				displayOrder: null,
				parentFolderId: 27890793,
				caseId: 1234567
			},
			{
				id: 27890926,
				displayNameEn: 'DCO Documents Superseded',
				displayOrder: null,
				parentFolderId: 27890793,
				caseId: 1234567
			},
			{
				id: 27890933,
				displayNameEn: 'Environmental Statement Superseded',
				displayOrder: null,
				parentFolderId: 27890793,
				caseId: 1234567
			},
			{
				id: 27890899,
				displayNameEn: 'Application Form Superseded',
				displayOrder: null,
				parentFolderId: 27890793,
				caseId: 1234567
			},
			{
				id: 27891791,
				displayNameEn: 'Additional Reg 6 Information Superseded',
				displayOrder: null,
				parentFolderId: 27890793,
				caseId: 1234567
			},
			{
				id: 24836452,
				displayNameEn: 'Plans',
				displayOrder: null,
				parentFolderId: 24601048,
				caseId: 1234567
			},
			{
				id: 24836073,
				displayNameEn: 'DCO Documents',
				displayOrder: null,
				parentFolderId: 24601048,
				caseId: 1234567
			},
			{
				id: 24601049,
				displayNameEn: 'Adequacy of Consultation',
				displayOrder: null,
				parentFolderId: 15360372,
				caseId: 1234567
			},
			{
				id: 27923594,
				displayNameEn: 'Emails',
				displayOrder: null,
				parentFolderId: 24601049,
				caseId: 1234567
			},
			{
				id: 27922530,
				displayNameEn: 'First submission',
				displayOrder: null,
				parentFolderId: 24601049,
				caseId: 1234567
			},
			{
				id: 26743871,
				displayNameEn: 'Emails',
				displayOrder: null,
				parentFolderId: 27922530,
				caseId: 1234567
			},
			{
				id: 24600049,
				displayNameEn: 'Reg 5',
				displayOrder: null,
				parentFolderId: 15360372,
				caseId: 1234567
			},
			{
				id: 26657360,
				displayNameEn: '2018 consultation',
				displayOrder: null,
				parentFolderId: 24600049,
				caseId: 1234567
			},
			{
				id: 26658146,
				displayNameEn: 'Stat consultee responses',
				displayOrder: null,
				parentFolderId: 26657360,
				caseId: 1234567
			},
			{
				id: 26657289,
				displayNameEn: 'Local authority responses',
				displayOrder: null,
				parentFolderId: 26658146,
				caseId: 1234567
			},
			{
				id: 26657405,
				displayNameEn: 'Prescribed consultee responses',
				displayOrder: null,
				parentFolderId: 26658146,
				caseId: 1234567
			},
			{
				id: 26656073,
				displayNameEn: 'Public responses',
				displayOrder: null,
				parentFolderId: 26657360,
				caseId: 1234567
			},
			{
				id: 26656248,
				displayNameEn: 'PIL responses',
				displayOrder: null,
				parentFolderId: 26657360,
				caseId: 1234567
			},
			{
				id: 26651612,
				displayNameEn: '2017 consultation',
				displayOrder: null,
				parentFolderId: 24600049,
				caseId: 1234567
			},
			{
				id: 26651492,
				displayNameEn: 'Public responses',
				displayOrder: null,
				parentFolderId: 26651612,
				caseId: 1234567
			},
			{
				id: 26655523,
				displayNameEn: 'Businesses',
				displayOrder: null,
				parentFolderId: 26651492,
				caseId: 1234567
			},
			{
				id: 26649522,
				displayNameEn: 'Public feedback',
				displayOrder: null,
				parentFolderId: 26651492,
				caseId: 1234567
			},
			{
				id: 26655527,
				displayNameEn: 'Community groups',
				displayOrder: null,
				parentFolderId: 26651492,
				caseId: 1234567
			},
			{
				id: 26656583,
				displayNameEn: 'Stats con responses',
				displayOrder: null,
				parentFolderId: 26651612,
				caseId: 1234567
			},
			{
				id: 26657247,
				displayNameEn: 'Prescribed consultee responses',
				displayOrder: null,
				parentFolderId: 26656583,
				caseId: 1234567
			},
			{
				id: 26657354,
				displayNameEn: 'Local authority responses',
				displayOrder: null,
				parentFolderId: 26656583,
				caseId: 1234567
			},
			{
				id: 26657148,
				displayNameEn: 'Parish councils',
				displayOrder: null,
				parentFolderId: 26657354,
				caseId: 1234567
			},
			{
				id: 26657050,
				displayNameEn: 'Local authorities',
				displayOrder: null,
				parentFolderId: 26657354,
				caseId: 1234567
			},
			{
				id: 26655916,
				displayNameEn: 'PIL responses',
				displayOrder: null,
				parentFolderId: 26651612,
				caseId: 1234567
			},
			{
				id: 26656010,
				displayNameEn: 'SoCC consultation',
				displayOrder: null,
				parentFolderId: 24600049,
				caseId: 1234567
			},
			{
				id: 26656397,
				displayNameEn: '2017 draft SoCC consultation',
				displayOrder: null,
				parentFolderId: 26656010,
				caseId: 1234567
			},
			{
				id: 26657098,
				displayNameEn: '2018 draft SoCC consultation',
				displayOrder: null,
				parentFolderId: 26656010,
				caseId: 1234567
			},
			{
				id: 24609693,
				displayNameEn: 'Drafting',
				displayOrder: null,
				parentFolderId: 15360372,
				caseId: 1234567
			},
			{
				id: 27889961,
				displayNameEn: 'First submission',
				displayOrder: null,
				parentFolderId: 24609693,
				caseId: 1234567
			},
			{
				id: 15360378,
				displayNameEn: 'Habitat Regulations',
				displayOrder: null,
				parentFolderId: 15360371,
				caseId: 1234567
			},
			{
				id: 29216885,
				displayNameEn: 'Other',
				displayOrder: null,
				parentFolderId: 15360371,
				caseId: 1234567
			},
			{
				id: 29279787,
				displayNameEn: 'Late submissions',
				displayOrder: null,
				parentFolderId: 29216885,
				caseId: 1234567
			},
			{
				id: 29282660,
				displayNameEn: 'Corres',
				displayOrder: null,
				parentFolderId: 29279787,
				caseId: 1234567
			},
			{
				id: 29223738,
				displayNameEn: "SHP's RR attachments",
				displayOrder: null,
				parentFolderId: 29216885,
				caseId: 1234567
			},
			{
				id: 15360380,
				displayNameEn: 'Relevant Representation Attachments',
				displayOrder: null,
				parentFolderId: 15360371,
				caseId: 1234567
			},
			{
				id: 15360377,
				displayNameEn: 'EIA',
				displayOrder: null,
				parentFolderId: 15360371,
				caseId: 1234567
			},
			{
				id: 28661379,
				displayNameEn: 'Examining Authority',
				displayOrder: null,
				parentFolderId: 15360371,
				caseId: 1234567
			},
			{
				id: 15360375,
				displayNameEn: 'Procedural Decisions',
				displayOrder: null,
				parentFolderId: 15360371,
				caseId: 1234567
			},
			{
				id: 24600278,
				displayNameEn: 'Drafts',
				displayOrder: null,
				parentFolderId: 15360375,
				caseId: 1234567
			},
			{
				id: 15360374,
				displayNameEn: 'Additional Submissions',
				displayOrder: null,
				parentFolderId: 15360371,
				caseId: 1234567
			},
			{
				id: 15360373,
				displayNameEn: 'Post Submission Changes',
				displayOrder: null,
				parentFolderId: 15360371,
				caseId: 1234567
			},
			{
				id: 15360376,
				displayNameEn: 'Examination timetable',
				displayOrder: null,
				parentFolderId: 15360371,
				caseId: 1234567,
				stage: 'examination'
			}
		];

		it('executes db query for each folder with expected parameters', async () => {
			const mockCaseId = 1234567;

			databaseConnector.case.findFirst.mockResolvedValue({ id: mockCaseId });

			await migrateFolders(inputFolders);

			outputFolders.forEach((folder) => {
				expect(databaseConnector.$executeRawUnsafe).toHaveBeenCalledWith(
					expect.any(String), // SQL string
					...[
						folder.id,
						folder.displayNameEn,
						folder.displayOrder,
						folder.parentFolderId,
						folder.caseId,
						folder.stage
					].filter((x) => !!x)
				);
			});
		});
	});
});
