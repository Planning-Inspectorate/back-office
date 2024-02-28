import { buildFolderHierarchy } from '../utils.js';

describe('migrator utils', () => {
	describe('buildFolderHierarchy', () => {
		const horizonFolders = [
			{
				id: 15360349,
				caseReference: 'TR020002',
				displayNameEnglish: '01 - Project Management',
				displayNameWelsh: null,
				parentFolderId: null,
				caseStage: null
			},
			{
				id: 15360352,
				caseReference: 'TR020002',
				displayNameEnglish: '02 - Section 51 Advice',
				displayNameWelsh: null,
				parentFolderId: null,
				caseStage: null
			},
			{
				id: 15360358,
				caseReference: 'TR020002',
				displayNameEnglish: '03 - Land Rights',
				displayNameWelsh: null,
				parentFolderId: null,
				caseStage: null
			},
			{
				id: 15360363,
				caseReference: 'TR020002',
				displayNameEnglish: '04 - Transboundary',
				displayNameWelsh: null,
				parentFolderId: null,
				caseStage: null
			},
			{
				id: 15360364,
				caseReference: 'TR020002',
				displayNameEnglish: '05 - Pre-App',
				displayNameWelsh: null,
				parentFolderId: null,
				caseStage: 'pre-application'
			},
			{
				id: 24605311,
				caseReference: 'TR020002',
				displayNameEnglish: '06 - Post-Submission Correspondence',
				displayNameWelsh: null,
				parentFolderId: null,
				caseStage: null
			},
			{
				id: 15360371,
				caseReference: 'TR020002',
				displayNameEnglish: '07 - Acceptance, Pre-Exam and Exam',
				displayNameWelsh: null,
				parentFolderId: null,
				caseStage: null
			},
			{
				id: 15360381,
				caseReference: 'TR020002',
				displayNameEnglish: '08 - Recommendation',
				displayNameWelsh: null,
				parentFolderId: null,
				caseStage: 'recommendation'
			},
			{
				id: 15360385,
				caseReference: 'TR020002',
				displayNameEnglish: '09 - Decision',
				displayNameWelsh: null,
				parentFolderId: null,
				caseStage: 'decision'
			},
			{
				id: 15360386,
				caseReference: 'TR020002',
				displayNameEnglish: '10 - Post Decision',
				displayNameWelsh: null,
				parentFolderId: null,
				caseStage: 'post_decision'
			},
			{
				id: 15360350,
				caseReference: 'TR020002',
				displayNameEnglish: '01 - Fees',
				displayNameWelsh: null,
				parentFolderId: 15360349,
				caseStage: null
			},
			{
				id: 15360351,
				caseReference: 'TR020002',
				displayNameEnglish: '02 - Case Management',
				displayNameWelsh: null,
				parentFolderId: 15360349,
				caseStage: null
			},
			{
				id: 24600766,
				caseReference: 'TR020002',
				displayNameEnglish: '03 - Logistics',
				displayNameWelsh: null,
				parentFolderId: 15360349,
				caseStage: null
			},
			{
				id: 24601423,
				caseReference: 'TR020002',
				displayNameEnglish: '04 - Internal ExA Meetings',
				displayNameWelsh: null,
				parentFolderId: 15360349,
				caseStage: null
			},
			{
				id: 29421551,
				caseReference: 'TR020002',
				displayNameEnglish: '05 - CoI',
				displayNameWelsh: null,
				parentFolderId: 15360349,
				caseStage: null
			},
			{
				id: 29475559,
				caseReference: 'TR020002',
				displayNameEnglish: '06 - RRs related documents',
				displayNameWelsh: null,
				parentFolderId: 15360349,
				caseStage: null
			},
			{
				id: 29534882,
				caseReference: 'TR020002',
				displayNameEnglish: 'Acceptance',
				displayNameWelsh: null,
				parentFolderId: 15360350,
				caseStage: null
			},
			{
				id: 27923382,
				caseReference: 'TR020002',
				displayNameEnglish: 'First submission',
				displayNameWelsh: null,
				parentFolderId: 15360350,
				caseStage: null
			},
			{
				id: 29534331,
				caseReference: 'TR020002',
				displayNameEnglish: 'Reg 6',
				displayNameWelsh: null,
				parentFolderId: 15360350,
				caseStage: null
			},
			{
				id: 15360359,
				caseReference: 'TR020002',
				displayNameEnglish: '01 - s52',
				displayNameWelsh: null,
				parentFolderId: 15360358,
				caseStage: null
			},
			{
				id: 15360361,
				caseReference: 'TR020002',
				displayNameEnglish: '02 - s53',
				displayNameWelsh: null,
				parentFolderId: 15360358,
				caseStage: null
			},
			{
				id: 24600270,
				caseReference: 'TR020002',
				displayNameEnglish: '01 - Applicants Request',
				displayNameWelsh: null,
				parentFolderId: 15360359,
				caseStage: null
			},
			{
				id: 24601471,
				caseReference: 'TR020002',
				displayNameEnglish: '02 - Recommendation and Authorisation',
				displayNameWelsh: null,
				parentFolderId: 15360359,
				caseStage: null
			},
			{
				id: 24600041,
				caseReference: 'TR020002',
				displayNameEnglish: '03 - Correspondence',
				displayNameWelsh: null,
				parentFolderId: 15360359,
				caseStage: null
			},
			{
				id: 24617004,
				caseReference: 'TR020002',
				displayNameEnglish: '01 - Applicants Request',
				displayNameWelsh: null,
				parentFolderId: 15360361,
				caseStage: null
			},
			{
				id: 24619692,
				caseReference: 'TR020002',
				displayNameEnglish: '02 - Recommendation and Authorisation',
				displayNameWelsh: null,
				parentFolderId: 15360361,
				caseStage: null
			},
			{
				id: 24619908,
				caseReference: 'TR020002',
				displayNameEnglish: '03 - Correspondence',
				displayNameWelsh: null,
				parentFolderId: 15360361,
				caseStage: null
			},
			{
				id: 25426758,
				caseReference: 'TR020002',
				displayNameEnglish: '2018 S53 Application',
				displayNameWelsh: null,
				parentFolderId: 15360361,
				caseStage: null
			},
			{
				id: 19977113,
				caseReference: 'TR020002',
				displayNameEnglish: 'FOI Request',
				displayNameWelsh: null,
				parentFolderId: 15360361,
				caseStage: null
			},
			{
				id: 19361878,
				caseReference: 'TR020002',
				displayNameEnglish: 'Redacted copy',
				displayNameWelsh: null,
				parentFolderId: 15360361,
				caseStage: null
			},
			{
				id: 16916015,
				caseReference: 'TR020002',
				displayNameEnglish: 'Stone Hill Park',
				displayNameWelsh: null,
				parentFolderId: 15360361,
				caseStage: null
			},
			{
				id: 19345595,
				caseReference: 'TR020002',
				displayNameEnglish: 's53 issue',
				displayNameWelsh: null,
				parentFolderId: 15360361,
				caseStage: null
			},
			{
				id: 24600042,
				caseReference: 'TR020002',
				displayNameEnglish: '01 - First Screening',
				displayNameWelsh: null,
				parentFolderId: 15360363,
				caseStage: null
			},
			{
				id: 24600378,
				caseReference: 'TR020002',
				displayNameEnglish: '02 - Second Screening',
				displayNameWelsh: null,
				parentFolderId: 15360363,
				caseStage: null
			},
			{
				id: 15360365,
				caseReference: 'TR020002',
				displayNameEnglish: '01 - Draft Documents',
				displayNameWelsh: null,
				parentFolderId: 15360364,
				caseStage: 'pre-application'
			},
			{
				id: 15360366,
				caseReference: 'TR020002',
				displayNameEnglish: '02 - EIA',
				displayNameWelsh: null,
				parentFolderId: 15360364,
				caseStage: 'pre-application'
			},
			{
				id: 15360369,
				caseReference: 'TR020002',
				displayNameEnglish: '03 - Habitat Regulations',
				displayNameWelsh: null,
				parentFolderId: 15360364,
				caseStage: 'pre-application'
			},
			{
				id: 15360370,
				caseReference: 'TR020002',
				displayNameEnglish: '04 - Evidence Plans',
				displayNameWelsh: null,
				parentFolderId: 15360364,
				caseStage: 'pre-application'
			},
			{
				id: 24590508,
				caseReference: 'TR020002',
				displayNameEnglish: '05 - Correspondence',
				displayNameWelsh: null,
				parentFolderId: 15360364,
				caseStage: 'pre-application'
			},
			{
				id: 24605401,
				caseReference: 'TR020002',
				displayNameEnglish: '06 - Meetings',
				displayNameWelsh: null,
				parentFolderId: 15360364,
				caseStage: 'pre-application'
			},
			{
				id: 24600274,
				caseReference: 'TR020002',
				displayNameEnglish: '07 - Developers Consultation',
				displayNameWelsh: null,
				parentFolderId: 15360364,
				caseStage: 'pre-application'
			},
			{
				id: 27691140,
				caseReference: 'TR020002',
				displayNameEnglish: 'FOI - EIR',
				displayNameWelsh: null,
				parentFolderId: 15360364,
				caseStage: 'pre-application'
			},
			{
				id: 24601474,
				caseReference: 'TR020002',
				displayNameEnglish: '01 - SOCC',
				displayNameWelsh: null,
				parentFolderId: 15360365,
				caseStage: 'pre-application'
			},
			{
				id: 27138001,
				caseReference: 'TR020002',
				displayNameEnglish: '2018 resubmission',
				displayNameWelsh: null,
				parentFolderId: 15360365,
				caseStage: 'pre-application'
			},
			{
				id: 25743820,
				caseReference: 'TR020002',
				displayNameEnglish: 'Draft Doc Comments',
				displayNameWelsh: null,
				parentFolderId: 15360365,
				caseStage: 'pre-application'
			},
			{
				id: 15360368,
				caseReference: 'TR020002',
				displayNameEnglish: '01 - Screening',
				displayNameWelsh: null,
				parentFolderId: 15360366,
				caseStage: 'pre-application'
			},
			{
				id: 15360367,
				caseReference: 'TR020002',
				displayNameEnglish: '02 - Scoping',
				displayNameWelsh: null,
				parentFolderId: 15360366,
				caseStage: 'pre-application'
			},
			{
				id: 16746202,
				caseReference: 'TR020002',
				displayNameEnglish: '01 - Responses',
				displayNameWelsh: null,
				parentFolderId: 15360367,
				caseStage: 'pre-application'
			},
			{
				id: 16628369,
				caseReference: 'TR020002',
				displayNameEnglish: 'June 2016 Reg 9 list',
				displayNameWelsh: null,
				parentFolderId: 15360367,
				caseStage: 'pre-application'
			},
			{
				id: 16748641,
				caseReference: 'TR020002',
				displayNameEnglish: 'Scoping Background',
				displayNameWelsh: null,
				parentFolderId: 15360367,
				caseStage: 'pre-application'
			},
			{
				id: 16746289,
				caseReference: 'TR020002',
				displayNameEnglish: 'Scoping Opinion',
				displayNameWelsh: null,
				parentFolderId: 15360367,
				caseStage: 'pre-application'
			},
			{
				id: 16748636,
				caseReference: 'TR020002',
				displayNameEnglish: 'Scoping Request',
				displayNameWelsh: null,
				parentFolderId: 15360367,
				caseStage: 'pre-application'
			},
			{
				id: 15360372,
				caseReference: 'TR020002',
				displayNameEnglish: '01 - Acceptance',
				displayNameWelsh: null,
				parentFolderId: 15360371,
				caseStage: null
			},
			{
				id: 15360373,
				caseReference: 'TR020002',
				displayNameEnglish: '02 - Post Submission Changes',
				displayNameWelsh: null,
				parentFolderId: 15360371,
				caseStage: null
			},
			{
				id: 15360374,
				caseReference: 'TR020002',
				displayNameEnglish: '03 - Additional Submissions',
				displayNameWelsh: null,
				parentFolderId: 15360371,
				caseStage: null
			},
			{
				id: 15360375,
				caseReference: 'TR020002',
				displayNameEnglish: '04 - Procedural Decisions',
				displayNameWelsh: null,
				parentFolderId: 15360371,
				caseStage: null
			},
			{
				id: 15360376,
				caseReference: 'TR020002',
				displayNameEnglish: '05 - Exam Timetable',
				displayNameWelsh: null,
				parentFolderId: 15360371,
				caseStage: 'examination'
			},
			{
				id: 15360377,
				caseReference: 'TR020002',
				displayNameEnglish: '06 - EIA',
				displayNameWelsh: null,
				parentFolderId: 15360371,
				caseStage: null
			},
			{
				id: 15360378,
				caseReference: 'TR020002',
				displayNameEnglish: '07 - Habitat Regulations',
				displayNameWelsh: null,
				parentFolderId: 15360371,
				caseStage: null
			},
			{
				id: 15360379,
				caseReference: 'TR020002',
				displayNameEnglish: '08 - Legal Advice',
				displayNameWelsh: null,
				parentFolderId: 15360371,
				caseStage: null
			},
			{
				id: 15360380,
				caseReference: 'TR020002',
				displayNameEnglish: '09 - Relevant Representation Attachments',
				displayNameWelsh: null,
				parentFolderId: 15360371,
				caseStage: null
			},
			{
				id: 28661379,
				caseReference: 'TR020002',
				displayNameEnglish: '10 - Examining Authority',
				displayNameWelsh: null,
				parentFolderId: 15360371,
				caseStage: null
			},
			{
				id: 28809091,
				caseReference: 'TR020002',
				displayNameEnglish: '11 - Paper RRs not on the prescribed form',
				displayNameWelsh: null,
				parentFolderId: 15360371,
				caseStage: null
			},
			{
				id: 29216885,
				caseReference: 'TR020002',
				displayNameEnglish: '12 - Other',
				displayNameWelsh: null,
				parentFolderId: 15360371,
				caseStage: null
			},
			{
				id: 24601048,
				caseReference: 'TR020002',
				displayNameEnglish: '01 - Application Documents',
				displayNameWelsh: null,
				parentFolderId: 15360372,
				caseStage: null
			},
			{
				id: 24601049,
				caseReference: 'TR020002',
				displayNameEnglish: '02 - Adequacy of Consultation',
				displayNameWelsh: null,
				parentFolderId: 15360372,
				caseStage: null
			},
			{
				id: 24600049,
				caseReference: 'TR020002',
				displayNameEnglish: '03 - Reg 5',
				displayNameWelsh: null,
				parentFolderId: 15360372,
				caseStage: null
			},
			{
				id: 24607873,
				caseReference: 'TR020002',
				displayNameEnglish: '04 - EST',
				displayNameWelsh: null,
				parentFolderId: 15360372,
				caseStage: null
			},
			{
				id: 24609693,
				caseReference: 'TR020002',
				displayNameEnglish: '05 - Drafting',
				displayNameWelsh: null,
				parentFolderId: 15360372,
				caseStage: null
			},
			{
				id: 24600050,
				caseReference: 'TR020002',
				displayNameEnglish: '06 - Decision',
				displayNameWelsh: null,
				parentFolderId: 15360372,
				caseStage: null
			},
			{
				id: 24600278,
				caseReference: 'TR020002',
				displayNameEnglish: '01 - Drafts',
				displayNameWelsh: null,
				parentFolderId: 15360375,
				caseStage: null
			},
			{
				id: 15360382,
				caseReference: 'TR020002',
				displayNameEnglish: '01 - Documents Received',
				displayNameWelsh: null,
				parentFolderId: 15360381,
				caseStage: 'recommendation'
			},
			{
				id: 24609694,
				caseReference: 'TR020002',
				displayNameEnglish: '02 - Drafting',
				displayNameWelsh: null,
				parentFolderId: 15360381,
				caseStage: 'recommendation'
			},
			{
				id: 24601050,
				caseReference: 'TR020002',
				displayNameEnglish: '03 - Final Submitted Report',
				displayNameWelsh: null,
				parentFolderId: 15360381,
				caseStage: 'recommendation'
			},
			{
				id: 24608591,
				caseReference: 'TR020002',
				displayNameEnglish: '01 - SoS Consultation',
				displayNameWelsh: null,
				parentFolderId: 15360385,
				caseStage: 'decision'
			},
			{
				id: 24609190,
				caseReference: 'TR020002',
				displayNameEnglish: '02 - SoS Decision',
				displayNameWelsh: null,
				parentFolderId: 15360385,
				caseStage: 'decision'
			},
			{
				id: 24605406,
				caseReference: 'TR020002',
				displayNameEnglish: '01 - Feedback',
				displayNameWelsh: null,
				parentFolderId: 15360386,
				caseStage: 'post_decision'
			},
			{
				id: 24610299,
				caseReference: 'TR020002',
				displayNameEnglish: '02 - JR',
				displayNameWelsh: null,
				parentFolderId: 15360386,
				caseStage: 'post_decision'
			},
			{
				id: 24610399,
				caseReference: 'TR020002',
				displayNameEnglish: '03 - Non-Material Change',
				displayNameWelsh: null,
				parentFolderId: 15360386,
				caseStage: 'post_decision'
			},
			{
				id: 24610300,
				caseReference: 'TR020002',
				displayNameEnglish: '04 - Costs',
				displayNameWelsh: null,
				parentFolderId: 15360386,
				caseStage: 'post_decision'
			},
			{
				id: 16745646,
				caseReference: 'TR020002',
				displayNameEnglish: 'Late Scoping Responses',
				displayNameWelsh: null,
				parentFolderId: 16746202,
				caseStage: 'pre-application'
			},
			{
				id: 19977997,
				caseReference: 'TR020002',
				displayNameEnglish: 'Redacted version',
				displayNameWelsh: null,
				parentFolderId: 19977113,
				caseStage: null
			},
			{
				id: 19977999,
				caseReference: 'TR020002',
				displayNameEnglish: 'Unredacted version',
				displayNameWelsh: null,
				parentFolderId: 19977113,
				caseStage: null
			},
			{
				id: 15360356,
				caseReference: 'TR020002',
				displayNameEnglish: '01 - Internal',
				displayNameWelsh: null,
				parentFolderId: 24590508,
				caseStage: null
			},
			{
				id: 15360357,
				caseReference: 'TR020002',
				displayNameEnglish: '02 - External',
				displayNameWelsh: null,
				parentFolderId: 24590508,
				caseStage: null
			},
			{
				id: 26200273,
				caseReference: 'TR020002',
				displayNameEnglish: '03 - LA contact details',
				displayNameWelsh: null,
				parentFolderId: 24590508,
				caseStage: 'pre-application'
			},
			{
				id: 24601270,
				caseReference: 'TR020002',
				displayNameEnglish: '01 - Internal',
				displayNameWelsh: null,
				parentFolderId: 24600044,
				caseStage: null
			},
			{
				id: 24600830,
				caseReference: 'TR020002',
				displayNameEnglish: '02 - External',
				displayNameWelsh: null,
				parentFolderId: 24600044,
				caseStage: null
			},
			{
				id: 26651612,
				caseReference: 'TR020002',
				displayNameEnglish: '2017 consultation',
				displayNameWelsh: null,
				parentFolderId: 24600049,
				caseStage: null
			},
			{
				id: 26657360,
				caseReference: 'TR020002',
				displayNameEnglish: '2018 consultation',
				displayNameWelsh: null,
				parentFolderId: 24600049,
				caseStage: null
			},
			{
				id: 26656010,
				caseReference: 'TR020002',
				displayNameEnglish: 'SoCC consultation',
				displayNameWelsh: null,
				parentFolderId: 24600049,
				caseStage: null
			},
			{
				id: 24601476,
				caseReference: 'TR020002',
				displayNameEnglish: '01 - Internal',
				displayNameWelsh: null,
				parentFolderId: 24600162,
				caseStage: null
			},
			{
				id: 24609692,
				caseReference: 'TR020002',
				displayNameEnglish: '02 - External',
				displayNameWelsh: null,
				parentFolderId: 24600162,
				caseStage: null
			},
			{
				id: 24609186,
				caseReference: 'TR020002',
				displayNameEnglish: '01 - Statutory',
				displayNameWelsh: null,
				parentFolderId: 24600274,
				caseStage: 'pre-application'
			},
			{
				id: 24600929,
				caseReference: 'TR020002',
				displayNameEnglish: '02 - Non-Statutory',
				displayNameWelsh: null,
				parentFolderId: 24600274,
				caseStage: 'pre-application'
			},
			{
				id: 24601044,
				caseReference: 'TR020002',
				displayNameEnglish: '03 - Consultation Feedback',
				displayNameWelsh: null,
				parentFolderId: 24600274,
				caseStage: 'pre-application'
			},
			{
				id: 24600163,
				caseReference: 'TR020002',
				displayNameEnglish: '01 - Internal',
				displayNameWelsh: null,
				parentFolderId: 24600382,
				caseStage: null
			},
			{
				id: 24601600,
				caseReference: 'TR020002',
				displayNameEnglish: '02 - External',
				displayNameWelsh: null,
				parentFolderId: 24600382,
				caseStage: null
			},
			{
				id: 24605318,
				caseReference: 'TR020002',
				displayNameEnglish: '01 - Internal',
				displayNameWelsh: null,
				parentFolderId: 24600385,
				caseStage: null
			},
			{
				id: 24605319,
				caseReference: 'TR020002',
				displayNameEnglish: '02 - External',
				displayNameWelsh: null,
				parentFolderId: 24600385,
				caseStage: null
			},
			{
				id: 24600652,
				caseReference: 'TR020002',
				displayNameEnglish: '01 - Travel',
				displayNameWelsh: null,
				parentFolderId: 24600766,
				caseStage: null
			},
			{
				id: 24600874,
				caseReference: 'TR020002',
				displayNameEnglish: '02 - Programme Officer',
				displayNameWelsh: null,
				parentFolderId: 24600766,
				caseStage: null
			},
			{
				id: 24600545,
				caseReference: 'TR020002',
				displayNameEnglish: '03 - Welsh Translations',
				displayNameWelsh: null,
				parentFolderId: 24600766,
				caseStage: null
			},
			{
				id: 24608586,
				caseReference: 'TR020002',
				displayNameEnglish: '01 - Internal',
				displayNameWelsh: null,
				parentFolderId: 24600931,
				caseStage: null
			},
			{
				id: 24609188,
				caseReference: 'TR020002',
				displayNameEnglish: '02 - External',
				displayNameWelsh: null,
				parentFolderId: 24600931,
				caseStage: null
			},
			{
				id: 24834971,
				caseReference: 'TR020002',
				displayNameEnglish: '01 - Application Form',
				displayNameWelsh: null,
				parentFolderId: 24601048,
				caseStage: null
			},
			{
				id: 24835052,
				caseReference: 'TR020002',
				displayNameEnglish: '02 - Compulsory Acquisition Information',
				displayNameWelsh: null,
				parentFolderId: 24601048,
				caseStage: null
			},
			{
				id: 24836073,
				caseReference: 'TR020002',
				displayNameEnglish: '03 - DCO Documents',
				displayNameWelsh: null,
				parentFolderId: 24601048,
				caseStage: null
			},
			{
				id: 24836830,
				caseReference: 'TR020002',
				displayNameEnglish: '04 - Environmental Statement',
				displayNameWelsh: null,
				parentFolderId: 24601048,
				caseStage: null
			},
			{
				id: 24836613,
				caseReference: 'TR020002',
				displayNameEnglish: '05 - Other Documents',
				displayNameWelsh: null,
				parentFolderId: 24601048,
				caseStage: null
			},
			{
				id: 24836452,
				caseReference: 'TR020002',
				displayNameEnglish: '06 - Plans',
				displayNameWelsh: null,
				parentFolderId: 24601048,
				caseStage: null
			},
			{
				id: 24835833,
				caseReference: 'TR020002',
				displayNameEnglish: '07 - Reports',
				displayNameWelsh: null,
				parentFolderId: 24601048,
				caseStage: null
			},
			{
				id: 24836614,
				caseReference: 'TR020002',
				displayNameEnglish: '08 - Additional Reg 6 Information',
				displayNameWelsh: null,
				parentFolderId: 24601048,
				caseStage: null
			},
			{
				id: 27890793,
				caseReference: 'TR020002',
				displayNameEnglish: 'Superseded Application Documents',
				displayNameWelsh: null,
				parentFolderId: 24601048,
				caseStage: null
			},
			{
				id: 27923594,
				caseReference: 'TR020002',
				displayNameEnglish: 'Emails',
				displayNameWelsh: null,
				parentFolderId: 24601049,
				caseStage: null
			},
			{
				id: 27922530,
				caseReference: 'TR020002',
				displayNameEnglish: 'First submission',
				displayNameWelsh: null,
				parentFolderId: 24601049,
				caseStage: null
			},
			{
				id: 24600382,
				caseReference: 'TR020002',
				displayNameEnglish: '01 - Acceptance',
				displayNameWelsh: null,
				parentFolderId: 24605311,
				caseStage: null
			},
			{
				id: 24600044,
				caseReference: 'TR020002',
				displayNameEnglish: '02 - Pre-Exam and Exam',
				displayNameWelsh: null,
				parentFolderId: 24605311,
				caseStage: null
			},
			{
				id: 24600162,
				caseReference: 'TR020002',
				displayNameEnglish: '03 - Recommendation',
				displayNameWelsh: null,
				parentFolderId: 24605311,
				caseStage: null
			},
			{
				id: 24600385,
				caseReference: 'TR020002',
				displayNameEnglish: '04 - Decision',
				displayNameWelsh: null,
				parentFolderId: 24605311,
				caseStage: null
			},
			{
				id: 24608585,
				caseReference: 'TR020002',
				displayNameEnglish: '05 - Post Decision',
				displayNameWelsh: null,
				parentFolderId: 24605311,
				caseStage: null
			},
			{
				id: 24600931,
				caseReference: 'TR020002',
				displayNameEnglish: '06 - SoS',
				displayNameWelsh: null,
				parentFolderId: 24605311,
				caseStage: null
			},
			{
				id: 24600379,
				caseReference: 'TR020002',
				displayNameEnglish: '01 - Outreach',
				displayNameWelsh: null,
				parentFolderId: 24605401,
				caseStage: 'pre-application'
			},
			{
				id: 27540901,
				caseReference: 'TR020002',
				displayNameEnglish: '02 - Drafts',
				displayNameWelsh: null,
				parentFolderId: 24605401,
				caseStage: 'pre-application'
			},
			{
				id: 27944574,
				caseReference: 'TR020002',
				displayNameEnglish: 'Superceded forms',
				displayNameWelsh: null,
				parentFolderId: 24607873,
				caseStage: null
			},
			{
				id: 24600386,
				caseReference: 'TR020002',
				displayNameEnglish: '01 - Internal',
				displayNameWelsh: null,
				parentFolderId: 24608585,
				caseStage: null
			},
			{
				id: 24600164,
				caseReference: 'TR020002',
				displayNameEnglish: '02 - External',
				displayNameWelsh: null,
				parentFolderId: 24608585,
				caseStage: null
			},
			{
				id: 24605322,
				caseReference: 'TR020002',
				displayNameEnglish: '01 - Consultation Docs',
				displayNameWelsh: null,
				parentFolderId: 24608591,
				caseStage: 'decision'
			},
			{
				id: 24605323,
				caseReference: 'TR020002',
				displayNameEnglish: '02 - Post Exam Submissions',
				displayNameWelsh: null,
				parentFolderId: 24608591,
				caseStage: 'decision'
			},
			{
				id: 25160075,
				caseReference: 'TR020002',
				displayNameEnglish: 'Second Consultation - January 2018',
				displayNameWelsh: null,
				parentFolderId: 24609186,
				caseStage: 'pre-application'
			},
			{
				id: 22000306,
				caseReference: 'TR020002',
				displayNameEnglish: 'Section 46',
				displayNameWelsh: null,
				parentFolderId: 24609186,
				caseStage: 'pre-application'
			},
			{
				id: 27889961,
				caseReference: 'TR020002',
				displayNameEnglish: 'First submission',
				displayNameWelsh: null,
				parentFolderId: 24609693,
				caseStage: null
			},
			{
				id: 24601478,
				caseReference: 'TR020002',
				displayNameEnglish: '01 - Application Documents',
				displayNameWelsh: null,
				parentFolderId: 24610399,
				caseStage: 'post_decision'
			},
			{
				id: 24609696,
				caseReference: 'TR020002',
				displayNameEnglish: '02 - Consultation Responses',
				displayNameWelsh: null,
				parentFolderId: 24610399,
				caseStage: 'post_decision'
			},
			{
				id: 24608592,
				caseReference: 'TR020002',
				displayNameEnglish: '03 - Procedural Decisions',
				displayNameWelsh: null,
				parentFolderId: 24610399,
				caseStage: 'post_decision'
			},
			{
				id: 21001019,
				caseReference: 'TR020002',
				displayNameEnglish: 'Applicant-BDB',
				displayNameWelsh: null,
				parentFolderId: 24619908,
				caseStage: null
			},
			{
				id: 17098663,
				caseReference: 'TR020002',
				displayNameEnglish: 'Outgoing',
				displayNameWelsh: null,
				parentFolderId: 24619908,
				caseStage: null
			},
			{
				id: 21004907,
				caseReference: 'TR020002',
				displayNameEnglish: 'PINS',
				displayNameWelsh: null,
				parentFolderId: 24619908,
				caseStage: null
			},
			{
				id: 21003872,
				caseReference: 'TR020002',
				displayNameEnglish: 'SHP-HSF',
				displayNameWelsh: null,
				parentFolderId: 24619908,
				caseStage: null
			},
			{
				id: 26819966,
				caseReference: 'TR020002',
				displayNameEnglish: 'Further Information Request 20180308',
				displayNameWelsh: null,
				parentFolderId: 25426266,
				caseStage: null
			},
			{
				id: 26811391,
				caseReference: 'TR020002',
				displayNameEnglish: 'Further Information Request 20180309',
				displayNameWelsh: null,
				parentFolderId: 25426266,
				caseStage: null
			},
			{
				id: 26819976,
				caseReference: 'TR020002',
				displayNameEnglish: 'Further Information Request 20180403',
				displayNameWelsh: null,
				parentFolderId: 25426266,
				caseStage: null
			},
			{
				id: 26810732,
				caseReference: 'TR020002',
				displayNameEnglish: 'Further Information Request 20180504',
				displayNameWelsh: null,
				parentFolderId: 25426266,
				caseStage: null
			},
			{
				id: 28544880,
				caseReference: 'TR020002',
				displayNameEnglish: 'Further Information Request 20180531',
				displayNameWelsh: null,
				parentFolderId: 25426266,
				caseStage: null
			},
			{
				id: 28614236,
				caseReference: 'TR020002',
				displayNameEnglish: 'Further Information Request 20180815',
				displayNameWelsh: null,
				parentFolderId: 25426266,
				caseStage: null
			},
			{
				id: 25426266,
				caseReference: 'TR020002',
				displayNameEnglish: "01 - Applicant's Request",
				displayNameWelsh: null,
				parentFolderId: 25426758,
				caseStage: null
			},
			{
				id: 25425559,
				caseReference: 'TR020002',
				displayNameEnglish: '02 - Recommendation and Authorisation',
				displayNameWelsh: null,
				parentFolderId: 25426758,
				caseStage: null
			},
			{
				id: 25426769,
				caseReference: 'TR020002',
				displayNameEnglish: '03 - Correspondence',
				displayNameWelsh: null,
				parentFolderId: 25426758,
				caseStage: null
			},
			{
				id: 26866884,
				caseReference: 'TR020002',
				displayNameEnglish: 'Correspondence from Landowner',
				displayNameWelsh: null,
				parentFolderId: 25426769,
				caseStage: null
			},
			{
				id: 28715548,
				caseReference: 'TR020002',
				displayNameEnglish: 'Issue',
				displayNameWelsh: null,
				parentFolderId: 25426769,
				caseStage: null
			},
			{
				id: 26199393,
				caseReference: 'TR020002',
				displayNameEnglish: 'Emails confirming LA contact',
				displayNameWelsh: null,
				parentFolderId: 26200273,
				caseStage: 'pre-application'
			},
			{
				id: 26655523,
				caseReference: 'TR020002',
				displayNameEnglish: 'Businesses',
				displayNameWelsh: null,
				parentFolderId: 26651492,
				caseStage: null
			},
			{
				id: 26655527,
				caseReference: 'TR020002',
				displayNameEnglish: 'Community groups',
				displayNameWelsh: null,
				parentFolderId: 26651492,
				caseStage: null
			},
			{
				id: 26649522,
				caseReference: 'TR020002',
				displayNameEnglish: 'Public feedback',
				displayNameWelsh: null,
				parentFolderId: 26651492,
				caseStage: null
			},
			{
				id: 26655916,
				caseReference: 'TR020002',
				displayNameEnglish: 'PIL responses',
				displayNameWelsh: null,
				parentFolderId: 26651612,
				caseStage: null
			},
			{
				id: 26651492,
				caseReference: 'TR020002',
				displayNameEnglish: 'Public responses',
				displayNameWelsh: null,
				parentFolderId: 26651612,
				caseStage: null
			},
			{
				id: 26656583,
				caseReference: 'TR020002',
				displayNameEnglish: 'Stats con responses',
				displayNameWelsh: null,
				parentFolderId: 26651612,
				caseStage: null
			},
			{
				id: 26656397,
				caseReference: 'TR020002',
				displayNameEnglish: '2017 draft SoCC consultation',
				displayNameWelsh: null,
				parentFolderId: 26656010,
				caseStage: null
			},
			{
				id: 26657098,
				caseReference: 'TR020002',
				displayNameEnglish: '2018 draft SoCC consultation',
				displayNameWelsh: null,
				parentFolderId: 26656010,
				caseStage: null
			},
			{
				id: 26657354,
				caseReference: 'TR020002',
				displayNameEnglish: 'Local authority responses',
				displayNameWelsh: null,
				parentFolderId: 26656583,
				caseStage: null
			},
			{
				id: 26657247,
				caseReference: 'TR020002',
				displayNameEnglish: 'Prescribed consultee responses',
				displayNameWelsh: null,
				parentFolderId: 26656583,
				caseStage: null
			},
			{
				id: 26657050,
				caseReference: 'TR020002',
				displayNameEnglish: 'Local authorities',
				displayNameWelsh: null,
				parentFolderId: 26657354,
				caseStage: null
			},
			{
				id: 26657148,
				caseReference: 'TR020002',
				displayNameEnglish: 'Parish councils',
				displayNameWelsh: null,
				parentFolderId: 26657354,
				caseStage: null
			},
			{
				id: 26656248,
				caseReference: 'TR020002',
				displayNameEnglish: 'PIL responses',
				displayNameWelsh: null,
				parentFolderId: 26657360,
				caseStage: null
			},
			{
				id: 26656073,
				caseReference: 'TR020002',
				displayNameEnglish: 'Public responses',
				displayNameWelsh: null,
				parentFolderId: 26657360,
				caseStage: null
			},
			{
				id: 26658146,
				caseReference: 'TR020002',
				displayNameEnglish: 'Stat consultee responses',
				displayNameWelsh: null,
				parentFolderId: 26657360,
				caseStage: null
			},
			{
				id: 26657289,
				caseReference: 'TR020002',
				displayNameEnglish: 'Local authority responses',
				displayNameWelsh: null,
				parentFolderId: 26658146,
				caseStage: null
			},
			{
				id: 26657405,
				caseReference: 'TR020002',
				displayNameEnglish: 'Prescribed consultee responses',
				displayNameWelsh: null,
				parentFolderId: 26658146,
				caseStage: null
			},
			{
				id: 26822498,
				caseReference: 'TR020002',
				displayNameEnglish: 'Schedule 2',
				displayNameWelsh: null,
				parentFolderId: 26810732,
				caseStage: null
			},
			{
				id: 26810831,
				caseReference: 'TR020002',
				displayNameEnglish: 'Schedule 1',
				displayNameWelsh: null,
				parentFolderId: 26819966,
				caseStage: null
			},
			{
				id: 26820305,
				caseReference: 'TR020002',
				displayNameEnglish: 'Schedule 3',
				displayNameWelsh: null,
				parentFolderId: 26819966,
				caseStage: null
			},
			{
				id: 26811834,
				caseReference: 'TR020002',
				displayNameEnglish: 'Schedule 1',
				displayNameWelsh: null,
				parentFolderId: 26819976,
				caseStage: null
			},
			{
				id: 26810407,
				caseReference: 'TR020002',
				displayNameEnglish: 'Schedule 2',
				displayNameWelsh: null,
				parentFolderId: 26819976,
				caseStage: null
			},
			{
				id: 26820779,
				caseReference: 'TR020002',
				displayNameEnglish: 'Schedule 3',
				displayNameWelsh: null,
				parentFolderId: 26819976,
				caseStage: null
			},
			{
				id: 28112828,
				caseReference: 'TR020002',
				displayNameEnglish: 'Revised Env. Information',
				displayNameWelsh: null,
				parentFolderId: 27138001,
				caseStage: 'pre-application'
			},
			{
				id: 27707254,
				caseReference: 'TR020002',
				displayNameEnglish: 'EIR Material AoCRs',
				displayNameWelsh: null,
				parentFolderId: 27691140,
				caseStage: 'pre-application'
			},
			{
				id: 27695674,
				caseReference: 'TR020002',
				displayNameEnglish: 'EIR Material Applicant Emails',
				displayNameWelsh: null,
				parentFolderId: 27691140,
				caseStage: null
			},
			{
				id: 27707253,
				caseReference: 'TR020002',
				displayNameEnglish: 'EIR Material Third Party Emails',
				displayNameWelsh: null,
				parentFolderId: 27691140,
				caseStage: 'pre-application'
			},
			{
				id: 27890899,
				caseReference: 'TR020002',
				displayNameEnglish: '01 - Application Form Superseded',
				displayNameWelsh: null,
				parentFolderId: 27890793,
				caseStage: null
			},
			{
				id: 27890916,
				caseReference: 'TR020002',
				displayNameEnglish: '02 - Compulsory Acquisition Information Superseded',
				displayNameWelsh: null,
				parentFolderId: 27890793,
				caseStage: null
			},
			{
				id: 27890926,
				caseReference: 'TR020002',
				displayNameEnglish: '03 - DCO Documents Superseded',
				displayNameWelsh: null,
				parentFolderId: 27890793,
				caseStage: null
			},
			{
				id: 27890933,
				caseReference: 'TR020002',
				displayNameEnglish: '04 - Environmental Statement Superseded',
				displayNameWelsh: null,
				parentFolderId: 27890793,
				caseStage: null
			},
			{
				id: 27891681,
				caseReference: 'TR020002',
				displayNameEnglish: '05 - Other Documents Superseded',
				displayNameWelsh: null,
				parentFolderId: 27890793,
				caseStage: null
			},
			{
				id: 27891688,
				caseReference: 'TR020002',
				displayNameEnglish: '06 - Plans Superseded',
				displayNameWelsh: null,
				parentFolderId: 27890793,
				caseStage: null
			},
			{
				id: 27891745,
				caseReference: 'TR020002',
				displayNameEnglish: '07 - Reports Superseded',
				displayNameWelsh: null,
				parentFolderId: 27890793,
				caseStage: null
			},
			{
				id: 27891791,
				caseReference: 'TR020002',
				displayNameEnglish: '08 - Additional Reg 6 Information Superseded',
				displayNameWelsh: null,
				parentFolderId: 27890793,
				caseStage: null
			},
			{
				id: 26743871,
				caseReference: 'TR020002',
				displayNameEnglish: 'Emails',
				displayNameWelsh: null,
				parentFolderId: 27922530,
				caseStage: null
			},
			{
				id: 29279787,
				caseReference: 'TR020002',
				displayNameEnglish: 'Late submissions',
				displayNameWelsh: null,
				parentFolderId: 29216885,
				caseStage: null
			},
			{
				id: 29223738,
				caseReference: 'TR020002',
				displayNameEnglish: "SHP's RR attachments",
				displayNameWelsh: null,
				parentFolderId: 29216885,
				caseStage: null
			},
			{
				id: 29282660,
				caseReference: 'TR020002',
				displayNameEnglish: 'Corres',
				displayNameWelsh: null,
				parentFolderId: 29279787,
				caseStage: null
			},
			{
				id: 29783297,
				caseReference: 'TR020002',
				displayNameEnglish: 'RR attachments',
				displayNameWelsh: null,
				parentFolderId: 29475559,
				caseStage: null
			},
			{
				id: 29460874,
				caseReference: 'TR020002',
				displayNameEnglish: 'Responded in prescribed form',
				displayNameWelsh: null,
				parentFolderId: 29475559,
				caseStage: null
			}
		];

		const sortedFolders = [
			{
				id: 15360349,
				caseReference: 'TR020002',
				displayNameEnglish: '01 - Project Management',
				parentFolderId: null,
				caseStage: null,
				children: [
					{
						id: 15360350,
						caseReference: 'TR020002',
						displayNameEnglish: '01 - Fees',
						parentFolderId: 15360349,
						caseStage: null,
						children: [
							{
								id: 29534882,
								caseReference: 'TR020002',
								displayNameEnglish: 'Acceptance',
								parentFolderId: 15360350,
								caseStage: null,
								children: []
							},
							{
								id: 27923382,
								caseReference: 'TR020002',
								displayNameEnglish: 'First submission',
								parentFolderId: 15360350,
								caseStage: null,
								children: []
							},
							{
								id: 29534331,
								caseReference: 'TR020002',
								displayNameEnglish: 'Reg 6',
								parentFolderId: 15360350,
								caseStage: null,
								children: []
							}
						]
					},
					{
						id: 15360351,
						caseReference: 'TR020002',
						displayNameEnglish: '02 - Case Management',
						parentFolderId: 15360349,
						caseStage: null,
						children: []
					},
					{
						id: 24600766,
						caseReference: 'TR020002',
						displayNameEnglish: '03 - Logistics',
						parentFolderId: 15360349,
						caseStage: null,
						children: [
							{
								id: 24600652,
								caseReference: 'TR020002',
								displayNameEnglish: '01 - Travel',
								parentFolderId: 24600766,
								caseStage: null,
								children: []
							},
							{
								id: 24600874,
								caseReference: 'TR020002',
								displayNameEnglish: '02 - Programme Officer',
								parentFolderId: 24600766,
								caseStage: null,
								children: []
							},
							{
								id: 24600545,
								caseReference: 'TR020002',
								displayNameEnglish: '03 - Welsh Translations',
								parentFolderId: 24600766,
								caseStage: null,
								children: []
							}
						]
					},
					{
						id: 24601423,
						caseReference: 'TR020002',
						displayNameEnglish: '04 - Internal ExA Meetings',
						parentFolderId: 15360349,
						caseStage: null,
						children: []
					},
					{
						id: 29421551,
						caseReference: 'TR020002',
						displayNameEnglish: '05 - CoI',
						parentFolderId: 15360349,
						caseStage: null,
						children: []
					},
					{
						id: 29475559,
						caseReference: 'TR020002',
						displayNameEnglish: '06 - RRs related documents',
						parentFolderId: 15360349,
						caseStage: null,
						children: [
							{
								id: 29783297,
								caseReference: 'TR020002',
								displayNameEnglish: 'RR attachments',
								parentFolderId: 29475559,
								caseStage: null,
								children: []
							},
							{
								id: 29460874,
								caseReference: 'TR020002',
								displayNameEnglish: 'Responded in prescribed form',
								parentFolderId: 29475559,
								caseStage: null,
								children: []
							}
						]
					}
				]
			},
			{
				id: 15360352,
				caseReference: 'TR020002',
				displayNameEnglish: '02 - Section 51 Advice',
				parentFolderId: null,
				caseStage: null,
				children: []
			},
			{
				id: 15360358,
				caseReference: 'TR020002',
				displayNameEnglish: '03 - Land Rights',
				parentFolderId: null,
				caseStage: null,
				children: [
					{
						id: 15360359,
						caseReference: 'TR020002',
						displayNameEnglish: '01 - s52',
						parentFolderId: 15360358,
						caseStage: null,
						children: [
							{
								id: 24600270,
								caseReference: 'TR020002',
								displayNameEnglish: '01 - Applicants Request',
								parentFolderId: 15360359,
								caseStage: null,
								children: []
							},
							{
								id: 24601471,
								caseReference: 'TR020002',
								displayNameEnglish: '02 - Recommendation and Authorisation',
								parentFolderId: 15360359,
								caseStage: null,
								children: []
							},
							{
								id: 24600041,
								caseReference: 'TR020002',
								displayNameEnglish: '03 - Correspondence',
								parentFolderId: 15360359,
								caseStage: null,
								children: []
							}
						]
					},
					{
						id: 15360361,
						caseReference: 'TR020002',
						displayNameEnglish: '02 - s53',
						parentFolderId: 15360358,
						caseStage: null,
						children: [
							{
								id: 24617004,
								caseReference: 'TR020002',
								displayNameEnglish: '01 - Applicants Request',
								parentFolderId: 15360361,
								caseStage: null,
								children: []
							},
							{
								id: 24619692,
								caseReference: 'TR020002',
								displayNameEnglish: '02 - Recommendation and Authorisation',
								parentFolderId: 15360361,
								caseStage: null,
								children: []
							},
							{
								id: 24619908,
								caseReference: 'TR020002',
								displayNameEnglish: '03 - Correspondence',
								parentFolderId: 15360361,
								caseStage: null,
								children: [
									{
										id: 21001019,
										caseReference: 'TR020002',
										displayNameEnglish: 'Applicant-BDB',
										parentFolderId: 24619908,
										caseStage: null,
										children: []
									},
									{
										id: 17098663,
										caseReference: 'TR020002',
										displayNameEnglish: 'Outgoing',
										parentFolderId: 24619908,
										caseStage: null,
										children: []
									},
									{
										id: 21004907,
										caseReference: 'TR020002',
										displayNameEnglish: 'PINS',
										parentFolderId: 24619908,
										caseStage: null,
										children: []
									},
									{
										id: 21003872,
										caseReference: 'TR020002',
										displayNameEnglish: 'SHP-HSF',
										parentFolderId: 24619908,
										caseStage: null,
										children: []
									}
								]
							},
							{
								id: 25426758,
								caseReference: 'TR020002',
								displayNameEnglish: '2018 S53 Application',
								parentFolderId: 15360361,
								caseStage: null,
								children: [
									{
										id: 25426266,
										caseReference: 'TR020002',
										displayNameEnglish: "01 - Applicant's Request",
										parentFolderId: 25426758,
										caseStage: null,
										children: [
											{
												id: 26819966,
												caseReference: 'TR020002',
												displayNameEnglish: 'Further Information Request 20180308',
												parentFolderId: 25426266,
												caseStage: null,
												children: [
													{
														id: 26810831,
														caseReference: 'TR020002',
														displayNameEnglish: 'Schedule 1',
														parentFolderId: 26819966,
														caseStage: null,
														children: []
													},
													{
														id: 26820305,
														caseReference: 'TR020002',
														displayNameEnglish: 'Schedule 3',
														parentFolderId: 26819966,
														caseStage: null,
														children: []
													}
												]
											},
											{
												id: 26811391,
												caseReference: 'TR020002',
												displayNameEnglish: 'Further Information Request 20180309',
												parentFolderId: 25426266,
												caseStage: null,
												children: []
											},
											{
												id: 26819976,
												caseReference: 'TR020002',
												displayNameEnglish: 'Further Information Request 20180403',
												parentFolderId: 25426266,
												caseStage: null,
												children: [
													{
														id: 26811834,
														caseReference: 'TR020002',
														displayNameEnglish: 'Schedule 1',
														parentFolderId: 26819976,
														caseStage: null,
														children: []
													},
													{
														id: 26810407,
														caseReference: 'TR020002',
														displayNameEnglish: 'Schedule 2',
														parentFolderId: 26819976,
														caseStage: null,
														children: []
													},
													{
														id: 26820779,
														caseReference: 'TR020002',
														displayNameEnglish: 'Schedule 3',
														parentFolderId: 26819976,
														caseStage: null,
														children: []
													}
												]
											},
											{
												id: 26810732,
												caseReference: 'TR020002',
												displayNameEnglish: 'Further Information Request 20180504',
												parentFolderId: 25426266,
												caseStage: null,
												children: [
													{
														id: 26822498,
														caseReference: 'TR020002',
														displayNameEnglish: 'Schedule 2',
														parentFolderId: 26810732,
														caseStage: null,
														children: []
													}
												]
											},
											{
												id: 28544880,
												caseReference: 'TR020002',
												displayNameEnglish: 'Further Information Request 20180531',
												parentFolderId: 25426266,
												caseStage: null,
												children: []
											},
											{
												id: 28614236,
												caseReference: 'TR020002',
												displayNameEnglish: 'Further Information Request 20180815',
												parentFolderId: 25426266,
												caseStage: null,
												children: []
											}
										]
									},
									{
										id: 25425559,
										caseReference: 'TR020002',
										displayNameEnglish: '02 - Recommendation and Authorisation',
										parentFolderId: 25426758,
										caseStage: null,
										children: []
									},
									{
										id: 25426769,
										caseReference: 'TR020002',
										displayNameEnglish: '03 - Correspondence',
										parentFolderId: 25426758,
										caseStage: null,
										children: [
											{
												id: 26866884,
												caseReference: 'TR020002',
												displayNameEnglish: 'Correspondence from Landowner',
												parentFolderId: 25426769,
												caseStage: null,
												children: []
											},
											{
												id: 28715548,
												caseReference: 'TR020002',
												displayNameEnglish: 'Issue',
												parentFolderId: 25426769,
												caseStage: null,
												children: []
											}
										]
									}
								]
							},
							{
								id: 19977113,
								caseReference: 'TR020002',
								displayNameEnglish: 'FOI Request',
								parentFolderId: 15360361,
								caseStage: null,
								children: [
									{
										id: 19977997,
										caseReference: 'TR020002',
										displayNameEnglish: 'Redacted version',
										parentFolderId: 19977113,
										caseStage: null,
										children: []
									},
									{
										id: 19977999,
										caseReference: 'TR020002',
										displayNameEnglish: 'Unredacted version',
										parentFolderId: 19977113,
										caseStage: null,
										children: []
									}
								]
							},
							{
								id: 19361878,
								caseReference: 'TR020002',
								displayNameEnglish: 'Redacted copy',
								parentFolderId: 15360361,
								caseStage: null,
								children: []
							},
							{
								id: 16916015,
								caseReference: 'TR020002',
								displayNameEnglish: 'Stone Hill Park',
								parentFolderId: 15360361,
								caseStage: null,
								children: []
							},
							{
								id: 19345595,
								caseReference: 'TR020002',
								displayNameEnglish: 's53 issue',
								parentFolderId: 15360361,
								caseStage: null,
								children: []
							}
						]
					}
				]
			},
			{
				id: 15360363,
				caseReference: 'TR020002',
				displayNameEnglish: '04 - Transboundary',
				parentFolderId: null,
				caseStage: null,
				children: [
					{
						id: 24600042,
						caseReference: 'TR020002',
						displayNameEnglish: '01 - First Screening',
						parentFolderId: 15360363,
						caseStage: null,
						children: []
					},
					{
						id: 24600378,
						caseReference: 'TR020002',
						displayNameEnglish: '02 - Second Screening',
						parentFolderId: 15360363,
						caseStage: null,
						children: []
					}
				]
			},
			{
				id: 15360364,
				caseReference: 'TR020002',
				displayNameEnglish: '05 - Pre-App',
				parentFolderId: null,
				caseStage: 'pre-application',
				children: [
					{
						id: 15360365,
						caseReference: 'TR020002',
						displayNameEnglish: '01 - Draft Documents',
						parentFolderId: 15360364,
						caseStage: 'pre-application',
						children: [
							{
								id: 24601474,
								caseReference: 'TR020002',
								displayNameEnglish: '01 - SOCC',
								parentFolderId: 15360365,
								caseStage: 'pre-application',
								children: []
							},
							{
								id: 27138001,
								caseReference: 'TR020002',
								displayNameEnglish: '2018 resubmission',
								parentFolderId: 15360365,
								caseStage: 'pre-application',
								children: [
									{
										id: 28112828,
										caseReference: 'TR020002',
										displayNameEnglish: 'Revised Env. Information',
										parentFolderId: 27138001,
										caseStage: 'pre-application',
										children: []
									}
								]
							},
							{
								id: 25743820,
								caseReference: 'TR020002',
								displayNameEnglish: 'Draft Doc Comments',
								parentFolderId: 15360365,
								caseStage: 'pre-application',
								children: []
							}
						]
					},
					{
						id: 15360366,
						caseReference: 'TR020002',
						displayNameEnglish: '02 - EIA',
						parentFolderId: 15360364,
						caseStage: 'pre-application',
						children: [
							{
								id: 15360368,
								caseReference: 'TR020002',
								displayNameEnglish: '01 - Screening',
								parentFolderId: 15360366,
								caseStage: 'pre-application',
								children: []
							},
							{
								id: 15360367,
								caseReference: 'TR020002',
								displayNameEnglish: '02 - Scoping',
								parentFolderId: 15360366,
								caseStage: 'pre-application',
								children: [
									{
										id: 16746202,
										caseReference: 'TR020002',
										displayNameEnglish: '01 - Responses',
										parentFolderId: 15360367,
										caseStage: 'pre-application',
										children: [
											{
												id: 16745646,
												caseReference: 'TR020002',
												displayNameEnglish: 'Late Scoping Responses',
												parentFolderId: 16746202,
												caseStage: 'pre-application',
												children: []
											}
										]
									},
									{
										id: 16628369,
										caseReference: 'TR020002',
										displayNameEnglish: 'June 2016 Reg 9 list',
										parentFolderId: 15360367,
										caseStage: 'pre-application',
										children: []
									},
									{
										id: 16748641,
										caseReference: 'TR020002',
										displayNameEnglish: 'Scoping Background',
										parentFolderId: 15360367,
										caseStage: 'pre-application',
										children: []
									},
									{
										id: 16746289,
										caseReference: 'TR020002',
										displayNameEnglish: 'Scoping Opinion',
										parentFolderId: 15360367,
										caseStage: 'pre-application',
										children: []
									},
									{
										id: 16748636,
										caseReference: 'TR020002',
										displayNameEnglish: 'Scoping Request',
										parentFolderId: 15360367,
										caseStage: 'pre-application',
										children: []
									}
								]
							}
						]
					},
					{
						id: 15360369,
						caseReference: 'TR020002',
						displayNameEnglish: '03 - Habitat Regulations',
						parentFolderId: 15360364,
						caseStage: 'pre-application',
						children: []
					},
					{
						id: 15360370,
						caseReference: 'TR020002',
						displayNameEnglish: '04 - Evidence Plans',
						parentFolderId: 15360364,
						caseStage: 'pre-application',
						children: []
					},
					{
						id: 24590508,
						caseReference: 'TR020002',
						displayNameEnglish: '05 - Correspondence',
						parentFolderId: 15360364,
						caseStage: 'pre-application',
						children: [
							{
								id: 15360356,
								caseReference: 'TR020002',
								displayNameEnglish: '01 - Internal',
								parentFolderId: 24590508,
								caseStage: null,
								children: []
							},
							{
								id: 15360357,
								caseReference: 'TR020002',
								displayNameEnglish: '02 - External',
								parentFolderId: 24590508,
								caseStage: null,
								children: []
							},
							{
								id: 26200273,
								caseReference: 'TR020002',
								displayNameEnglish: '03 - LA contact details',
								parentFolderId: 24590508,
								caseStage: 'pre-application',
								children: [
									{
										id: 26199393,
										caseReference: 'TR020002',
										displayNameEnglish: 'Emails confirming LA contact',
										parentFolderId: 26200273,
										caseStage: 'pre-application',
										children: []
									}
								]
							}
						]
					},
					{
						id: 24605401,
						caseReference: 'TR020002',
						displayNameEnglish: '06 - Meetings',
						parentFolderId: 15360364,
						caseStage: 'pre-application',
						children: [
							{
								id: 24600379,
								caseReference: 'TR020002',
								displayNameEnglish: '01 - Outreach',
								parentFolderId: 24605401,
								caseStage: 'pre-application',
								children: []
							},
							{
								id: 27540901,
								caseReference: 'TR020002',
								displayNameEnglish: '02 - Drafts',
								parentFolderId: 24605401,
								caseStage: 'pre-application',
								children: []
							}
						]
					},
					{
						id: 24600274,
						caseReference: 'TR020002',
						displayNameEnglish: '07 - Developers Consultation',
						parentFolderId: 15360364,
						caseStage: 'pre-application',
						children: [
							{
								id: 24609186,
								caseReference: 'TR020002',
								displayNameEnglish: '01 - Statutory',
								parentFolderId: 24600274,
								caseStage: 'pre-application',
								children: [
									{
										id: 25160075,
										caseReference: 'TR020002',
										displayNameEnglish: 'Second Consultation - January 2018',
										parentFolderId: 24609186,
										caseStage: 'pre-application',
										children: []
									},
									{
										id: 22000306,
										caseReference: 'TR020002',
										displayNameEnglish: 'Section 46',
										parentFolderId: 24609186,
										caseStage: 'pre-application',
										children: []
									}
								]
							},
							{
								id: 24600929,
								caseReference: 'TR020002',
								displayNameEnglish: '02 - Non-Statutory',
								parentFolderId: 24600274,
								caseStage: 'pre-application',
								children: []
							},
							{
								id: 24601044,
								caseReference: 'TR020002',
								displayNameEnglish: '03 - Consultation Feedback',
								parentFolderId: 24600274,
								caseStage: 'pre-application',
								children: []
							}
						]
					},
					{
						id: 27691140,
						caseReference: 'TR020002',
						displayNameEnglish: 'FOI - EIR',
						parentFolderId: 15360364,
						caseStage: 'pre-application',
						children: [
							{
								id: 27707254,
								caseReference: 'TR020002',
								displayNameEnglish: 'EIR Material AoCRs',
								parentFolderId: 27691140,
								caseStage: 'pre-application',
								children: []
							},
							{
								id: 27695674,
								caseReference: 'TR020002',
								displayNameEnglish: 'EIR Material Applicant Emails',
								parentFolderId: 27691140,
								caseStage: null,
								children: []
							},
							{
								id: 27707253,
								caseReference: 'TR020002',
								displayNameEnglish: 'EIR Material Third Party Emails',
								parentFolderId: 27691140,
								caseStage: 'pre-application',
								children: []
							}
						]
					}
				]
			},
			{
				id: 24605311,
				caseReference: 'TR020002',
				displayNameEnglish: '06 - Post-Submission Correspondence',
				parentFolderId: null,
				caseStage: null,
				children: [
					{
						id: 24600382,
						caseReference: 'TR020002',
						displayNameEnglish: '01 - Acceptance',
						parentFolderId: 24605311,
						caseStage: null,
						children: [
							{
								id: 24600163,
								caseReference: 'TR020002',
								displayNameEnglish: '01 - Internal',
								parentFolderId: 24600382,
								caseStage: null,
								children: []
							},
							{
								id: 24601600,
								caseReference: 'TR020002',
								displayNameEnglish: '02 - External',
								parentFolderId: 24600382,
								caseStage: null,
								children: []
							}
						]
					},
					{
						id: 24600044,
						caseReference: 'TR020002',
						displayNameEnglish: '02 - Pre-Exam and Exam',
						parentFolderId: 24605311,
						caseStage: null,
						children: [
							{
								id: 24601270,
								caseReference: 'TR020002',
								displayNameEnglish: '01 - Internal',
								parentFolderId: 24600044,
								caseStage: null,
								children: []
							},
							{
								id: 24600830,
								caseReference: 'TR020002',
								displayNameEnglish: '02 - External',
								parentFolderId: 24600044,
								caseStage: null,
								children: []
							}
						]
					},
					{
						id: 24600162,
						caseReference: 'TR020002',
						displayNameEnglish: '03 - Recommendation',
						parentFolderId: 24605311,
						caseStage: null,
						children: [
							{
								id: 24601476,
								caseReference: 'TR020002',
								displayNameEnglish: '01 - Internal',
								parentFolderId: 24600162,
								caseStage: null,
								children: []
							},
							{
								id: 24609692,
								caseReference: 'TR020002',
								displayNameEnglish: '02 - External',
								parentFolderId: 24600162,
								caseStage: null,
								children: []
							}
						]
					},
					{
						id: 24600385,
						caseReference: 'TR020002',
						displayNameEnglish: '04 - Decision',
						parentFolderId: 24605311,
						caseStage: null,
						children: [
							{
								id: 24605318,
								caseReference: 'TR020002',
								displayNameEnglish: '01 - Internal',
								parentFolderId: 24600385,
								caseStage: null,
								children: []
							},
							{
								id: 24605319,
								caseReference: 'TR020002',
								displayNameEnglish: '02 - External',
								parentFolderId: 24600385,
								caseStage: null,
								children: []
							}
						]
					},
					{
						id: 24608585,
						caseReference: 'TR020002',
						displayNameEnglish: '05 - Post Decision',
						parentFolderId: 24605311,
						caseStage: null,
						children: [
							{
								id: 24600386,
								caseReference: 'TR020002',
								displayNameEnglish: '01 - Internal',
								parentFolderId: 24608585,
								caseStage: null,
								children: []
							},
							{
								id: 24600164,
								caseReference: 'TR020002',
								displayNameEnglish: '02 - External',
								parentFolderId: 24608585,
								caseStage: null,
								children: []
							}
						]
					},
					{
						id: 24600931,
						caseReference: 'TR020002',
						displayNameEnglish: '06 - SoS',
						parentFolderId: 24605311,
						caseStage: null,
						children: [
							{
								id: 24608586,
								caseReference: 'TR020002',
								displayNameEnglish: '01 - Internal',
								parentFolderId: 24600931,
								caseStage: null,
								children: []
							},
							{
								id: 24609188,
								caseReference: 'TR020002',
								displayNameEnglish: '02 - External',
								parentFolderId: 24600931,
								caseStage: null,
								children: []
							}
						]
					}
				]
			},
			{
				id: 15360371,
				caseReference: 'TR020002',
				displayNameEnglish: '07 - Acceptance, Pre-Exam and Exam',
				parentFolderId: null,
				caseStage: null,
				children: [
					{
						id: 15360372,
						caseReference: 'TR020002',
						displayNameEnglish: '01 - Acceptance',
						parentFolderId: 15360371,
						caseStage: null,
						children: [
							{
								id: 24601048,
								caseReference: 'TR020002',
								displayNameEnglish: '01 - Application Documents',
								parentFolderId: 15360372,
								caseStage: null,
								children: [
									{
										id: 24834971,
										caseReference: 'TR020002',
										displayNameEnglish: '01 - Application Form',
										parentFolderId: 24601048,
										caseStage: null,
										children: []
									},
									{
										id: 24835052,
										caseReference: 'TR020002',
										displayNameEnglish: '02 - Compulsory Acquisition Information',
										parentFolderId: 24601048,
										caseStage: null,
										children: []
									},
									{
										id: 24836073,
										caseReference: 'TR020002',
										displayNameEnglish: '03 - DCO Documents',
										parentFolderId: 24601048,
										caseStage: null,
										children: []
									},
									{
										id: 24836830,
										caseReference: 'TR020002',
										displayNameEnglish: '04 - Environmental Statement',
										parentFolderId: 24601048,
										caseStage: null,
										children: []
									},
									{
										id: 24836613,
										caseReference: 'TR020002',
										displayNameEnglish: '05 - Other Documents',
										parentFolderId: 24601048,
										caseStage: null,
										children: []
									},
									{
										id: 24836452,
										caseReference: 'TR020002',
										displayNameEnglish: '06 - Plans',
										parentFolderId: 24601048,
										caseStage: null,
										children: []
									},
									{
										id: 24835833,
										caseReference: 'TR020002',
										displayNameEnglish: '07 - Reports',
										parentFolderId: 24601048,
										caseStage: null,
										children: []
									},
									{
										id: 24836614,
										caseReference: 'TR020002',
										displayNameEnglish: '08 - Additional Reg 6 Information',
										parentFolderId: 24601048,
										caseStage: null,
										children: []
									},
									{
										id: 27890793,
										caseReference: 'TR020002',
										displayNameEnglish: 'Superseded Application Documents',
										parentFolderId: 24601048,
										caseStage: null,
										children: [
											{
												id: 27890899,
												caseReference: 'TR020002',
												displayNameEnglish: '01 - Application Form Superseded',
												parentFolderId: 27890793,
												caseStage: null,
												children: []
											},
											{
												id: 27890916,
												caseReference: 'TR020002',
												displayNameEnglish: '02 - Compulsory Acquisition Information Superseded',
												parentFolderId: 27890793,
												caseStage: null,
												children: []
											},
											{
												id: 27890926,
												caseReference: 'TR020002',
												displayNameEnglish: '03 - DCO Documents Superseded',
												parentFolderId: 27890793,
												caseStage: null,
												children: []
											},
											{
												id: 27890933,
												caseReference: 'TR020002',
												displayNameEnglish: '04 - Environmental Statement Superseded',
												parentFolderId: 27890793,
												caseStage: null,
												children: []
											},
											{
												id: 27891681,
												caseReference: 'TR020002',
												displayNameEnglish: '05 - Other Documents Superseded',
												parentFolderId: 27890793,
												caseStage: null,
												children: []
											},
											{
												id: 27891688,
												caseReference: 'TR020002',
												displayNameEnglish: '06 - Plans Superseded',
												parentFolderId: 27890793,
												caseStage: null,
												children: []
											},
											{
												id: 27891745,
												caseReference: 'TR020002',
												displayNameEnglish: '07 - Reports Superseded',
												parentFolderId: 27890793,
												caseStage: null,
												children: []
											},
											{
												id: 27891791,
												caseReference: 'TR020002',
												displayNameEnglish: '08 - Additional Reg 6 Information Superseded',
												parentFolderId: 27890793,
												caseStage: null,
												children: []
											}
										]
									}
								]
							},
							{
								id: 24601049,
								caseReference: 'TR020002',
								displayNameEnglish: '02 - Adequacy of Consultation',
								parentFolderId: 15360372,
								caseStage: null,
								children: [
									{
										id: 27923594,
										caseReference: 'TR020002',
										displayNameEnglish: 'Emails',
										parentFolderId: 24601049,
										caseStage: null,
										children: []
									},
									{
										id: 27922530,
										caseReference: 'TR020002',
										displayNameEnglish: 'First submission',
										parentFolderId: 24601049,
										caseStage: null,
										children: [
											{
												id: 26743871,
												caseReference: 'TR020002',
												displayNameEnglish: 'Emails',
												parentFolderId: 27922530,
												caseStage: null,
												children: []
											}
										]
									}
								]
							},
							{
								id: 24600049,
								caseReference: 'TR020002',
								displayNameEnglish: '03 - Reg 5',
								parentFolderId: 15360372,
								caseStage: null,
								children: [
									{
										id: 26651612,
										caseReference: 'TR020002',
										displayNameEnglish: '2017 consultation',
										parentFolderId: 24600049,
										caseStage: null,
										children: [
											{
												id: 26655916,
												caseReference: 'TR020002',
												displayNameEnglish: 'PIL responses',
												parentFolderId: 26651612,
												caseStage: null,
												children: []
											},
											{
												id: 26651492,
												caseReference: 'TR020002',
												displayNameEnglish: 'Public responses',
												parentFolderId: 26651612,
												caseStage: null,
												children: [
													{
														id: 26655523,
														caseReference: 'TR020002',
														displayNameEnglish: 'Businesses',
														parentFolderId: 26651492,
														caseStage: null,
														children: []
													},
													{
														id: 26655527,
														caseReference: 'TR020002',
														displayNameEnglish: 'Community groups',
														parentFolderId: 26651492,
														caseStage: null,
														children: []
													},
													{
														id: 26649522,
														caseReference: 'TR020002',
														displayNameEnglish: 'Public feedback',
														parentFolderId: 26651492,
														caseStage: null,
														children: []
													}
												]
											},
											{
												id: 26656583,
												caseReference: 'TR020002',
												displayNameEnglish: 'Stats con responses',
												parentFolderId: 26651612,
												caseStage: null,
												children: [
													{
														id: 26657354,
														caseReference: 'TR020002',
														displayNameEnglish: 'Local authority responses',
														parentFolderId: 26656583,
														caseStage: null,
														children: [
															{
																id: 26657050,
																caseReference: 'TR020002',
																displayNameEnglish: 'Local authorities',
																parentFolderId: 26657354,
																caseStage: null,
																children: []
															},
															{
																id: 26657148,
																caseReference: 'TR020002',
																displayNameEnglish: 'Parish councils',
																parentFolderId: 26657354,
																caseStage: null,
																children: []
															}
														]
													},
													{
														id: 26657247,
														caseReference: 'TR020002',
														displayNameEnglish: 'Prescribed consultee responses',
														parentFolderId: 26656583,
														caseStage: null,
														children: []
													}
												]
											}
										]
									},
									{
										id: 26657360,
										caseReference: 'TR020002',
										displayNameEnglish: '2018 consultation',
										parentFolderId: 24600049,
										caseStage: null,
										children: [
											{
												id: 26656248,
												caseReference: 'TR020002',
												displayNameEnglish: 'PIL responses',
												parentFolderId: 26657360,
												caseStage: null,
												children: []
											},
											{
												id: 26656073,
												caseReference: 'TR020002',
												displayNameEnglish: 'Public responses',
												parentFolderId: 26657360,
												caseStage: null,
												children: []
											},
											{
												id: 26658146,
												caseReference: 'TR020002',
												displayNameEnglish: 'Stat consultee responses',
												parentFolderId: 26657360,
												caseStage: null,
												children: [
													{
														id: 26657289,
														caseReference: 'TR020002',
														displayNameEnglish: 'Local authority responses',
														parentFolderId: 26658146,
														caseStage: null,
														children: []
													},
													{
														id: 26657405,
														caseReference: 'TR020002',
														displayNameEnglish: 'Prescribed consultee responses',
														parentFolderId: 26658146,
														caseStage: null,
														children: []
													}
												]
											}
										]
									},
									{
										id: 26656010,
										caseReference: 'TR020002',
										displayNameEnglish: 'SoCC consultation',
										parentFolderId: 24600049,
										caseStage: null,
										children: [
											{
												id: 26656397,
												caseReference: 'TR020002',
												displayNameEnglish: '2017 draft SoCC consultation',
												parentFolderId: 26656010,
												caseStage: null,
												children: []
											},
											{
												id: 26657098,
												caseReference: 'TR020002',
												displayNameEnglish: '2018 draft SoCC consultation',
												parentFolderId: 26656010,
												caseStage: null,
												children: []
											}
										]
									}
								]
							},
							{
								id: 24607873,
								caseReference: 'TR020002',
								displayNameEnglish: '04 - EST',
								parentFolderId: 15360372,
								caseStage: null,
								children: [
									{
										id: 27944574,
										caseReference: 'TR020002',
										displayNameEnglish: 'Superceded forms',
										parentFolderId: 24607873,
										caseStage: null,
										children: []
									}
								]
							},
							{
								id: 24609693,
								caseReference: 'TR020002',
								displayNameEnglish: '05 - Drafting',
								parentFolderId: 15360372,
								caseStage: null,
								children: [
									{
										id: 27889961,
										caseReference: 'TR020002',
										displayNameEnglish: 'First submission',
										parentFolderId: 24609693,
										caseStage: null,
										children: []
									}
								]
							},
							{
								id: 24600050,
								caseReference: 'TR020002',
								displayNameEnglish: '06 - Decision',
								parentFolderId: 15360372,
								caseStage: null,
								children: []
							}
						]
					},
					{
						id: 15360373,
						caseReference: 'TR020002',
						displayNameEnglish: '02 - Post Submission Changes',
						parentFolderId: 15360371,
						caseStage: null,
						children: []
					},
					{
						id: 15360374,
						caseReference: 'TR020002',
						displayNameEnglish: '03 - Additional Submissions',
						parentFolderId: 15360371,
						caseStage: null,
						children: []
					},
					{
						id: 15360375,
						caseReference: 'TR020002',
						displayNameEnglish: '04 - Procedural Decisions',
						parentFolderId: 15360371,
						caseStage: null,
						children: [
							{
								id: 24600278,
								caseReference: 'TR020002',
								displayNameEnglish: '01 - Drafts',
								parentFolderId: 15360375,
								caseStage: null,
								children: []
							}
						]
					},
					{
						id: 15360376,
						caseReference: 'TR020002',
						displayNameEnglish: '05 - Exam Timetable',
						parentFolderId: 15360371,
						caseStage: 'examination',
						children: []
					},
					{
						id: 15360377,
						caseReference: 'TR020002',
						displayNameEnglish: '06 - EIA',
						parentFolderId: 15360371,
						caseStage: null,
						children: []
					},
					{
						id: 15360378,
						caseReference: 'TR020002',
						displayNameEnglish: '07 - Habitat Regulations',
						parentFolderId: 15360371,
						caseStage: null,
						children: []
					},
					{
						id: 15360379,
						caseReference: 'TR020002',
						displayNameEnglish: '08 - Legal Advice',
						parentFolderId: 15360371,
						caseStage: null,
						children: []
					},
					{
						id: 15360380,
						caseReference: 'TR020002',
						displayNameEnglish: '09 - Relevant Representation Attachments',
						parentFolderId: 15360371,
						caseStage: null,
						children: []
					},
					{
						id: 28661379,
						caseReference: 'TR020002',
						displayNameEnglish: '10 - Examining Authority',
						parentFolderId: 15360371,
						caseStage: null,
						children: []
					},
					{
						id: 28809091,
						caseReference: 'TR020002',
						displayNameEnglish: '11 - Paper RRs not on the prescribed form',
						parentFolderId: 15360371,
						caseStage: null,
						children: []
					},
					{
						id: 29216885,
						caseReference: 'TR020002',
						displayNameEnglish: '12 - Other',
						parentFolderId: 15360371,
						caseStage: null,
						children: [
							{
								id: 29279787,
								caseReference: 'TR020002',
								displayNameEnglish: 'Late submissions',
								parentFolderId: 29216885,
								caseStage: null,
								children: [
									{
										id: 29282660,
										caseReference: 'TR020002',
										displayNameEnglish: 'Corres',
										parentFolderId: 29279787,
										caseStage: null,
										children: []
									}
								]
							},
							{
								id: 29223738,
								caseReference: 'TR020002',
								displayNameEnglish: "SHP's RR attachments",
								parentFolderId: 29216885,
								caseStage: null,
								children: []
							}
						]
					}
				]
			},
			{
				id: 15360381,
				caseReference: 'TR020002',
				displayNameEnglish: '08 - Recommendation',
				parentFolderId: null,
				caseStage: 'recommendation',
				children: [
					{
						id: 15360382,
						caseReference: 'TR020002',
						displayNameEnglish: '01 - Documents Received',
						parentFolderId: 15360381,
						caseStage: 'recommendation',
						children: []
					},
					{
						id: 24609694,
						caseReference: 'TR020002',
						displayNameEnglish: '02 - Drafting',
						parentFolderId: 15360381,
						caseStage: 'recommendation',
						children: []
					},
					{
						id: 24601050,
						caseReference: 'TR020002',
						displayNameEnglish: '03 - Final Submitted Report',
						parentFolderId: 15360381,
						caseStage: 'recommendation',
						children: []
					}
				]
			},
			{
				id: 15360385,
				caseReference: 'TR020002',
				displayNameEnglish: '09 - Decision',
				parentFolderId: null,
				caseStage: 'decision',
				children: [
					{
						id: 24608591,
						caseReference: 'TR020002',
						displayNameEnglish: '01 - SoS Consultation',
						parentFolderId: 15360385,
						caseStage: 'decision',
						children: [
							{
								id: 24605322,
								caseReference: 'TR020002',
								displayNameEnglish: '01 - Consultation Docs',
								parentFolderId: 24608591,
								caseStage: 'decision',
								children: []
							},
							{
								id: 24605323,
								caseReference: 'TR020002',
								displayNameEnglish: '02 - Post Exam Submissions',
								parentFolderId: 24608591,
								caseStage: 'decision',
								children: []
							}
						]
					},
					{
						id: 24609190,
						caseReference: 'TR020002',
						displayNameEnglish: '02 - SoS Decision',
						parentFolderId: 15360385,
						caseStage: 'decision',
						children: []
					}
				]
			},
			{
				id: 15360386,
				caseReference: 'TR020002',
				displayNameEnglish: '10 - Post Decision',
				parentFolderId: null,
				caseStage: 'post_decision',
				children: [
					{
						id: 24605406,
						caseReference: 'TR020002',
						displayNameEnglish: '01 - Feedback',
						parentFolderId: 15360386,
						caseStage: 'post_decision',
						children: []
					},
					{
						id: 24610299,
						caseReference: 'TR020002',
						displayNameEnglish: '02 - JR',
						parentFolderId: 15360386,
						caseStage: 'post_decision',
						children: []
					},
					{
						id: 24610399,
						caseReference: 'TR020002',
						displayNameEnglish: '03 - Non-Material Change',
						parentFolderId: 15360386,
						caseStage: 'post_decision',
						children: [
							{
								id: 24601478,
								caseReference: 'TR020002',
								displayNameEnglish: '01 - Application Documents',
								parentFolderId: 24610399,
								caseStage: 'post_decision',
								children: []
							},
							{
								id: 24609696,
								caseReference: 'TR020002',
								displayNameEnglish: '02 - Consultation Responses',
								parentFolderId: 24610399,
								caseStage: 'post_decision',
								children: []
							},
							{
								id: 24608592,
								caseReference: 'TR020002',
								displayNameEnglish: '03 - Procedural Decisions',
								parentFolderId: 24610399,
								caseStage: 'post_decision',
								children: []
							}
						]
					},
					{
						id: 24610300,
						caseReference: 'TR020002',
						displayNameEnglish: '04 - Costs',
						parentFolderId: 15360386,
						caseStage: 'post_decision',
						children: []
					}
				]
			}
		];

		it('returns folders in hierarchy by parentFolderId', () => {
			const result = buildFolderHierarchy(horizonFolders);
			expect(result).toEqual(sortedFolders);
		});
	});
});
