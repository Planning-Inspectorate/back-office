import { getContactMethodOptions } from '../contact-method/contact-method.view-model.js';
import { getRepresentationEntityOptions } from '../representation-entity/entity.view-model.js';
import { getListOfOptions } from '../under-18/under-18.view-model.js';

/**
 *
 * @param {object|*} representation
 * @return string
 */
const getSelectedEntityOptionText = (representation) =>
	getRepresentationEntityOptions(representation).find((option) => option.checked)?.text;

/**
 *
 * @param {object|*} representation
 * @return {string|undefined}
 */
const getSelectedUnder18OptionText = (representation) =>
	getListOfOptions(representation.represented).find((option) => {
		return option.checked;
	})?.text;

/**
 *
 * @param {object|*} representation
 * @return {object|*}
 */
const getSelectedContactMethodOptionText = (representation) => ({
	represented: getContactMethodOptions(representation.represented).find((option) => option.checked)
		?.text,
	representative: getContactMethodOptions(representation.representative).find(
		(option) => option.checked
	)?.text
});

/**
 *
 * @param {object} representation
 * @return {object}
 */
export const getSelectedOptionsText = (representation) => {
	return {
		selectedEntityOptionText: getSelectedEntityOptionText(representation),
		selectedUnder18OptionText: getSelectedUnder18OptionText(representation),
		selectedContactMethodOptionText: getSelectedContactMethodOptionText(representation)
	};
};
