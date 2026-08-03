/**
 * Parse a reference code (e.g. 'REP-001a', 'RR10-001a', 'AP-032') into its component parts.
 * The prefix is everything before the dash (letters optionally followed by digits).
 * The number follows the dash and is 3+ digits.
 * An optional lowercase letter suffix may follow the number.
 *
 * @param {string} ref - Reference code in the format PREFIX-NNN[suffix]
 * @returns {{ prefixLetters: string, prefixNumbers: number, number: number, suffix: string }}
 */
function parseRefCode(ref) {
	const match = ref.match(/^([A-Za-z]+)(\d*)-(\d{3,})([a-z]?)$/);
	if (!match) {
		throw new Error(`Invalid reference code format: "${ref}"`);
	}
	return {
		prefixLetters: match[1].toUpperCase(),
		prefixNumbers: match[2] ? parseInt(match[2], 10) : -1, // -1 so no-number sorts before any number
		number: parseInt(match[3], 10),
		suffix: match[4] // '' if no suffix
	};
}

/**
 * Compare two reference codes for sorting.
 *
 * Sorts by:
 *  1. Prefix letters alphabetically (e.g. AP < REP < RR)
 *  2. Prefix number numerically — no number before any number (e.g. AP < AP1 < AP2 < AP10)
 *  3. Numeric part (e.g. 001 < 002)
 *  4. Suffix — no suffix comes before any suffix, then alphabetically (a < b < c …)
 *
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
function compareRefCodes(a, b) {
	const parsedA = parseRefCode(a);
	const parsedB = parseRefCode(b);

	// 1. Compare prefix letters
	if (parsedA.prefixLetters < parsedB.prefixLetters) return -1;
	if (parsedA.prefixLetters > parsedB.prefixLetters) return 1;

	// 2. Compare prefix number (numerically)
	if (parsedA.prefixNumbers < parsedB.prefixNumbers) return -1;
	if (parsedA.prefixNumbers > parsedB.prefixNumbers) return 1;

	// 3. Compare number
	if (parsedA.number < parsedB.number) return -1;
	if (parsedA.number > parsedB.number) return 1;

	// 4. Compare suffix (empty string sorts before any letter)
	if (parsedA.suffix < parsedB.suffix) return -1;
	if (parsedA.suffix > parsedB.suffix) return 1;

	return 0;
}

/**
 * Sort an array of reference codes.
 *
 * @param {string[]} refCodes
 * @param {'asc' | 'desc'} [order='asc']
 * @returns {string[]} A new sorted array
 */
function sortRefCodes(refCodes, order = 'asc') {
	//spread to crfeate a copy rather than mutate original array
	const sorted = [...refCodes].sort(compareRefCodes);
	return order === 'desc' ? sorted.reverse() : sorted;
}

const generateSampleData = (count = 100, prefixes = ['REP']) => {
	const codes = [];
	//ensure prefixes ar always an array
	prefixes = Array.isArray(prefixes) ? prefixes : [prefixes];

	for (const prefix of prefixes) {
		//base codes {PREFIX}-001 to {PREFIX}-{count}
		for (let i = 1; i <= count; i++) {
			const num = String(i).padStart(3, '0');
			codes.push(`${prefix}-${num}`);
		}

		// Randomly pick up to half of the codes to get an 'a' suffix override
		const overrideCount = Math.floor(Math.random() * (count / 2)) + 1;
		const allIndices = Array.from({ length: count }, (_, i) => i + 1);
		const shuffledIndices = allIndices.sort(() => Math.random() - 0.5);
		const overrideIndices = shuffledIndices.slice(0, overrideCount);

		for (const idx of overrideIndices) {
			const num = String(idx).padStart(3, '0');
			codes.push(`${prefix}-${num}a`);
		}

		// Of those, pick roughly a third to also get a random [b-z] suffix override
		const extraCount = Math.max(1, Math.floor(overrideIndices.length / 3));
		const extraIndices = overrideIndices.slice(0, extraCount);
		const randomSuffix = () => String.fromCharCode(98 + Math.floor(Math.random() * 25)); // b-z

		for (const idx of extraIndices) {
			const num = String(idx).padStart(3, '0');
			codes.push(`${prefix}-${num}${randomSuffix()}`);
		}
	}

	//shuffle the array to make the sorting non-trivial and simulate real data that might not be ordered when we pull from API
	for (let i = codes.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[codes[i], codes[j]] = [codes[j], codes[i]];
	}

	return codes;
};

const sampleData = generateSampleData(5, ['REP', 'DOC', 'EXM']);

// console.log('\nUnsorted:', sampleData);
// console.log('\nAscending:', sortRefCodes(sampleData, 'asc'));
// console.log('\nDescending:', sortRefCodes(sampleData, 'desc'));

export { parseRefCode, compareRefCodes, sortRefCodes, generateSampleData };
