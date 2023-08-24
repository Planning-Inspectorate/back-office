// @ts-nocheck
const CLASSES = {
	removeButton: 'pins-add-another__remove-button'
};

const SELECTORS = {
	container: '.pins-add-another',
	item: '.pins-add-another__item',
	itemInput: '.pins-add-another__item-input',
	addButton: '.pins-add-another__button',
	removeButton: `.${CLASSES.removeButton}`
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
	removeButton.classList.add(CLASSES.removeButton);

	element.appendChild(removeButton);
}

function removeRemoveButtons(element) {
	element.querySelectorAll(SELECTORS.removeButton).forEach((button) => button.remove());
}

function bindItemEvents(item) {
	item.querySelector(SELECTORS.removeButton).addEventListener('click', (event) => {
		event.target?.closest(SELECTORS.item)?.remove();
	});
}

function getItems(componentInstance) {
	return componentInstance.querySelectorAll(SELECTORS.item);
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

	bindItemEvents(items[items.length - 1]);
}

function initItems(componentInstance) {
	let items = getItems(componentInstance);
	items.forEach((item, index) => {
		if (index > 0) {
			removeRemoveButtons(item);
			addRemoveButton(item);
			bindItemEvents(item);
		}
	});
}

function initEvents(componentInstance) {
	const addButton = componentInstance.querySelector(SELECTORS.addButton);

	if (!addButton) {
		return;
	}

	addButton.addEventListener('click', () => {
		addAnotherItem(componentInstance);
	});
}

const initAddAnother = () => {
	/** @type {NodeListOf<HTMLElement>} */
	const componentInstances = document.querySelectorAll(SELECTORS.container);

	if (componentInstances.length === 0) {
		return;
	}

	componentInstances.forEach((componentInstance) => {
		initItems(componentInstance);
		initEvents(componentInstance);
	});
};

export default initAddAnother;
