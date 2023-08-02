/**
 * ProjectUpdate represents some content in relation to a case (application/nsip) that may be of interest to
 * members of the public and those with an interest in that case. These updates are ultimate sent out to email
 * subscribers, and published to the front office.
 * Otherwise known as Banners or Latest Updates.
 */
export class ProjectUpdate {
	/**
	 * Project update status options
	 * @type {Object<string, import("@pins/applications/types/project-update.js").ProjectUpdateStatus>}
	 */
	static get Status() {
		return Object.freeze({
			draft: 'draft',
			readyToPublish: 'ready-to-publish',
			published: 'published',
			readyToUnpublish: 'ready-to-unpublish',
			unpublished: 'unpublished',
			archived: 'archived'
		});
	}

	/**
	 * Array of project update statuses, useful for validation.
	 */
	static get StatusList() {
		return Object.freeze(Object.values(ProjectUpdate.Status));
	}

	/**
	 * A map of status to allowed statuses
	 */
	static get AllowedStatuses() {
		const status = ProjectUpdate.Status;
		return Object.freeze({
			[status.draft]: [status.readyToPublish],
			[status.readyToPublish]: [status.draft, status.published],
			[status.published]: [status.readyToUnpublish],
			[status.archived]: [],
			[status.readyToUnpublish]: [status.unpublished, status.published],
			[status.unpublished]: [status.archived]
		});
	}

	/**
	 * Project update type options
	 * @type {Object<string, import("@pins/applications/types/project-update.js").ProjectUpdateType>}
	 */
	static get Type() {
		return Object.freeze({
			general: 'general',
			applicationSubmitted: 'applicationSubmitted',
			applicationDecided: 'applicationDecided',
			registrationOpen: 'registrationOpen'
		});
	}

	/**
	 * A list of allowed types for a project update
	 */
	static get TypesList() {
		return Object.freeze(Object.values(ProjectUpdate.Type));
	}

	/**
	 * Can a project update with the given status be edited?
	 *
	 * @param {string} status
	 * @returns {boolean}
	 */
	static isEditable(status) {
		return status !== ProjectUpdate.Status.archived;
	}

	/**
	 * Can a project update with the given status be deleted?
	 *
	 * @param {string} status
	 * @returns {boolean}
	 */
	static isDeleteable(status) {
		return status === ProjectUpdate.Status.draft;
	}
}
