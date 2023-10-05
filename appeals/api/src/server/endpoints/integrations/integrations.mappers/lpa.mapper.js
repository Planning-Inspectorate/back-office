// @ts-nocheck
// TODO: schemas (PINS data model)
// TODO: add local data model for LPA

export const mapLpaIn = (appeal) => {
	return {
		lpaCode: appeal.LPACode,
		name: appeal.LPAName
	};
};

export const mapLpaOut = (appeal) => {
	return {
		LPACode: appeal.lpa.lpaCode,
		LPAName: appeal.lpa.name
	};
};
