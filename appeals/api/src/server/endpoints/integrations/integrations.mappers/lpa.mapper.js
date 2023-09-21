// @ts-nocheck
// TODO: schemas (PINS data model)
// TODO: add local data model for LPA

export const mapLpaIn = (appeal) => `[${appeal.LPACode}] ${appeal.LPAName}`;

export const mapLpaOut = (appeal) => {
	return {
		LPACode: appeal.localPlanningDepartment.replace(/\[(.*)\] (.*)/gm, '$1'),
		LPAName: appeal.localPlanningDepartment.replace(/\[(.*)\] (.*)/gm, '$2')
	};
};
