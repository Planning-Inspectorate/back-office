/**
 * ProjectUpdate represents some content in relation to a case (application/nsip) that may be of interest to
 * members of the public and those with an interest in that case. These updates are ultimate sent out to email
 * subscribers, and published to the front office.
 * Otherwise known as Banners or Latest Updates.
 */
export class ProjectUpdate {
	/**
	 * Project update status options
	 */
	static get Status() {
		return Object.freeze({
			draft: 'draft',
			readyToPublish: 'ready-to-publish',
			published: 'published',
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
}
