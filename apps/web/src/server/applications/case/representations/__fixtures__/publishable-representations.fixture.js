export const publishableRepresentationsFixture = {
	previouslyPublished: false,
	itemCount: 3,
	items: [
		{
			id: 1,
			reference: 'mock-reference-1',
			status: 'VALID',
			redacted: true,
			received: '2023-10-10T10:47:21.846Z',
			firstName: 'mock name',
			lastName: 'mock last name',
			organisationName: 'mock org'
		},
		{
			id: 2,
			reference: 'mock-reference-3',
			status: 'VALID',
			redacted: true,
			received: '2023-10-10T10:47:21.846Z',
			firstName: 'mock name',
			lastName: 'mock last name',
			organisationName: 'mock org'
		},
		{
			id: 3,
			reference: 'mock-reference-3',
			status: 'VALID',
			redacted: true,
			received: '2023-10-10T10:47:21.846Z',
			firstName: 'mock name',
			lastName: 'mock last name',
			organisationName: 'mock org'
		}
	]
};

/**
 * Used to generate large number of representation items
 *
 * @param {any} fixture
 * @param {number} count
 * @return {any}
 */
export function generateAdditionalItems(fixture, count) {
	const baseItems = fixture.items;
	const newItems = [...baseItems];

	let currentId = baseItems.length + 1;

	for (let i = 0; i < count; i++) {
		const baseItem = baseItems[i % baseItems.length];
		const newItem = { ...baseItem, id: currentId };
		newItems.push(newItem);
		currentId++;
	}

	return {
		...fixture,
		itemCount: newItems.length,
		items: newItems
	};
}
