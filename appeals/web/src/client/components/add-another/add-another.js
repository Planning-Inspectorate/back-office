// @ts-nocheck
const CLASSES = {
	removeButton: {
		base: 'pins-add-another__remove-button',
		additional: 'govuk-!-margin-bottom-1'
	},
	addButtonHidden: 'pins-add-another__add-button--hidden'
};

const SELECTORS = {
	container: '.pins-add-another',
	item: '.pins-add-another__item',
	itemInput: '.pins-add-another__item-input',
	addButton: '.pins-add-another__add-button',
	removeButton: `.${CLASSES.removeButton.base}`,
	removeButtonContainer: '.pins-add-another__remove-button-container'
};

const ATTRIBUTES = {
	maximumNumberOfItems: 'data-max-item-count'
};

const DEFAULT_OPTIONS = {
	maximumNumberOfItems: 10
};

function resetElement(element) {
	if (element.type === 'checkbox' || element.type === 'radio') {
		element.checked = false;
	} else {
		element.value = '';
	}
}

function resetItem(element) {
	resetElement(element);

	element
		.querySelectorAll(SELECTORS.itemInput)
		.forEach((childElement) => resetElement(childElement));
}

function addRemoveButton(element) {
	const removeButton = document.createElement('button');

	removeButton.setAttribute('type', 'button');
	removeButton.innerText = 'Remove';
	removeButton.classList.add('govuk-button');
	removeButton.classList.add('govuk-button--secondary');
	removeButton.classList.add(CLASSES.removeButton.base);
	removeButton.classList.add(CLASSES.removeButton.additional);

	const buttonContainer = element.querySelector(SELECTORS.removeButtonContainer) || element;

	buttonContainer.appendChild(removeButton);
}

function removeRemoveButtons(element) {
	element.querySelectorAll(SELECTORS.removeButton).forEach((button) => button.remove());
}

function bindItemEvents(componentInstance, item) {
	item.querySelector(SELECTORS.removeButton).addEventListener('click', (event) => {
		event.target?.closest(SELECTORS.item)?.remove();
		updateAddButtonState(componentInstance);
	});
}

function getItems(componentInstance) {
	return componentInstance.elements.root?.querySelectorAll(SELECTORS.item);
}

function showOrHideAddButton(componentInstance, hide = false) {
	const addButton = componentInstance.elements.root?.querySelector(SELECTORS.addButton);

	if (!addButton) {
		return;
	}

	if (hide) {
		addButton.classList.add(CLASSES.addButtonHidden);
	} else {
		addButton.classList.remove(CLASSES.addButtonHidden);
	}
}

function updateAddButtonState(componentInstance) {
	const items = getItems(componentInstance);

	if (items.length >= componentInstance.options.maximumNumberOfItems) {
		showOrHideAddButton(componentInstance, true);
	} else {
		showOrHideAddButton(componentInstance);
	}
}

function addAnotherItem(componentInstance) {
	let items = getItems(componentInstance);

	if (items.length === 0) {
		return;
	}

	const newItem = items[0].cloneNode(true);

	addRemoveButton(newItem);
	resetItem(newItem);

	items[items.length - 1].after(newItem);

	items = getItems(componentInstance);

	bindItemEvents(componentInstance, items[items.length - 1]);
	updateAddButtonState(componentInstance);
}

function initOptions(componentInstance) {
	const maximumNumberOfItemsAttributeValue = componentInstance.elements.root?.getAttribute(
		ATTRIBUTES.maximumNumberOfItems
	);

	componentInstance.options.maximumNumberOfItems =
		(maximumNumberOfItemsAttributeValue && parseInt(maximumNumberOfItemsAttributeValue, 10)) ||
		DEFAULT_OPTIONS.maximumNumberOfItems;
}

function initItems(componentInstance) {
	let items = getItems(componentInstance);
	items.forEach((item, index) => {
		if (index > 0) {
			removeRemoveButtons(item);
			addRemoveButton(item);
			bindItemEvents(componentInstance, item);
		}
	});
}

function initEvents(componentInstance) {
	const addButton = componentInstance.elements.root?.querySelector(SELECTORS.addButton);

	if (!addButton) {
		return;
	}

	addButton.addEventListener('click', () => {
		addAnotherItem(componentInstance);
	});
}

const initAddAnother = () => {
	/** @type {NodeListOf<HTMLElement>} */
	const componentElementInstances = document.querySelectorAll(SELECTORS.container);

	componentElementInstances.forEach((componentElementInstance) => {
		const componentInstance = {
			elements: {
				root: componentElementInstance
			},
			options: {}
		};
		initOptions(componentInstance);
		initItems(componentInstance);
		initEvents(componentInstance);
	});
};

export default initAddAnother;
