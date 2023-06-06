/**
 * Initialise the excerpt module, used in conjuction with excerpt.component.njk
 *
 * Fallbacks to using govukDetails in the template if there is no JS enabled.
 */
function initExcerpt() {
	/**
	 * Toggle the excerpt or full content display.
	 *
	 * @param {MouseEvent|Event} event
	 */
	function handleClick(event) {
		// the instanceof check is just to make typescript happy, but it's good to be sure we've got what we expect
		if (!event.target || !(event.target instanceof HTMLElement)) {
			return;
		}
		const parent = event.target.closest('.excerpt');
		if (!parent) {
			return;
		}
		/** @type {HTMLElement|null} */
		const summary = parent.querySelector('.excerpt-summary');
		/** @type {HTMLElement|null} */
		const full = parent.querySelector('.excerpt-full');
		if (!summary || !full) {
			return;
		}

		event.preventDefault();

		const summaryVisibile = summary.style.display !== 'none';
		if (summaryVisibile) {
			summary.style.setProperty('display', 'none', 'important');
			full.style.setProperty('display', 'block', 'important');
		} else {
			full.style.setProperty('display', 'none', 'important');
			summary.style.setProperty('display', 'block', 'important');
		}
	}

	// find all the links on the page, and register the handlers
	const links = document.getElementsByClassName('excerpt-link');
	for (const link of links) {
		link.addEventListener('click', handleClick);
	}
}

export default initExcerpt;
