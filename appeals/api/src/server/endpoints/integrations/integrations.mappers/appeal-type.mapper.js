// @ts-nocheck
import { APPEAL_TYPE_SHORTHAND_HAS } from '#endpoints/constants.js';

//TODO: add more types
const appealTypeMap = {
	[APPEAL_TYPE_SHORTHAND_HAS]: 'Householder (HAS) Appeal'
};

export const mapAppealTypeIn = (appealType) => {
	switch (appealType) {
		case appealTypeMap.APPEAL_TYPE_SHORTHAND_HAS:
		default:
			return APPEAL_TYPE_SHORTHAND_HAS;
	}
};

export const mapAppealTypeOut = (appealType) => appealTypeMap[appealType];
