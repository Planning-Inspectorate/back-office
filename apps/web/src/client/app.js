// Import default components for all pages
//* This will be updated based ona router -> loader flow.

import './pages/default';

const x = 1;

console.log(x);

const y = (args) => {
	return {
		...args,
		b: 2
	}
}

y();
