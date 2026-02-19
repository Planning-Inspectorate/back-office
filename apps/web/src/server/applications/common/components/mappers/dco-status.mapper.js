import { DCO_STATUS } from '../../constants.js';

export const DCO_STATUS_VIEW = {
    [DCO_STATUS.GRANTED]: {
        displayNameEn: 'Granted',
        tagClasses: 'govuk-tag--green'
    },
    [DCO_STATUS.REFUSED]: {
        displayNameEn: 'Refused',
        tagClasses: 'govuk-tag--red'
    },
    [DCO_STATUS.PARTIALLY_CONSENTED]: {
        displayNameEn: 'Partially consented',
        tagClasses: 'govuk-tag--turquoise'
    },
    [DCO_STATUS.QUASHED]: {
        displayNameEn: 'Quashed',
        tagClasses: 'govuk-tag--pink'
    },
    [DCO_STATUS.REDETERMINATION]: {
        displayNameEn: 'Redetermination',
        tagClasses: 'govuk-tag--yellow'
    },
    [DCO_STATUS.WITHDRAWN]: {
        displayNameEn: 'Withdrawn',
        tagClasses: 'govuk-tag--orange'
    }
};

/**
 * View model to map DCO status to radio/button options.
 *
 * @returns {Array<{name: string, displayNameEn: string}>}
 */
export function getDcoStatusViewModel() {
    return Object.entries(DCO_STATUS_VIEW).map(([key, value]) => ({
        name: key,
        displayNameEn: value.displayNameEn
    }));
}

/**
 *
 * @param {string} dcoStatus
 * @returns {string}
 */
export const getDcoStatusDisplayName = (dcoStatus) => {
    if (!dcoStatus) {
        return '';
    }
    const statusEntry = DCO_STATUS_VIEW[dcoStatus];
    return statusEntry.displayNameEn;
};

/**
 * Get DCO status tag classes
 * @param {string} dcoStatus
 * @returns {string}
 */
export const getDcoStatusTagClasses = (dcoStatus) => {
    if (!dcoStatus) {
        return 'govuk-tag--grey';
    }
    const statusEntry = DCO_STATUS_VIEW[dcoStatus];
    return statusEntry?.tagClasses || 'govuk-tag--grey';
};

