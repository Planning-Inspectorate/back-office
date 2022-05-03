import { createDocument } from '../factory/document.js';

export const documents = [
	createDocument({ type: 'planning application form' }),
	createDocument({ type: 'decision letter' }),
	createDocument({ type: 'supporting document' }),
	createDocument({ type: 'planning officers report' }),
	createDocument({ type: 'plans used to reach decision' }),
	createDocument({ type: 'statutory development plan policy' }),
	createDocument({ type: 'other relevant policy' }),
	createDocument({ type: 'conservation area guidance' }),
	createDocument({ type: 'appeal notification' }),
	createDocument({ type: 'application notification' }),
	createDocument({ type: 'application publicity' }),
	createDocument({ type: 'representation' })
];
