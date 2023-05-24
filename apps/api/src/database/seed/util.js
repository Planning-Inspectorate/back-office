/**
 * Generate one date per month this year.
 *
 * @returns {Date[]}
 */
export function oneDatePerMonth() {
	const year = new Date().getFullYear();
	const days = Array.from({ length: 28 }, (_, i) => i + 1);
	const dates = [];
	for (let i = 0; i < 12; i++) {
		const month = i.toString().padStart(2, '0');
		const day = pickRandom(days);
		dates.push(new Date(`${year}-${month}-${day}T09:00:00Z`));
	}
	return dates;
}

/**
 *
 * @param {T[]} list
 * @returns {T}
 * @template T
 */
export function pickRandom(list) {
	return list[Math.floor(Math.random() * list.length)];
}

/**
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function pseudoRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
