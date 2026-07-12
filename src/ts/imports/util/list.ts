/**
 * List functions for the util library
 */
export const MintList = {
	/**
	 * Returns a copy of the provided list with the items in random order
	 * @param list - the list to shuffle
	 * @returns - the shuffled list
	 */
	shuffleCopy<T>(list: T[]): T[] {
		const copy = [...list];
		for (let i = copy.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[copy[i], copy[j]] = [copy[j], copy[i]];
		}
		return copy;
	},

	/**
	 * Filters the array in place based on a test condition and returns the filtered array.
	 * This method modifies the original array by removing elements that do not pass the test implemented by the provided function.
	 *
	 * @template T The type of elements in the array.
	 * @param {T[]} list The array to filter, which will be modified in place.
	 * @param {(item: T) => boolean} test A function that tests each element of the array. Return `true` to keep the element, `false` otherwise.
	 * @returns {T[]} The original array with only the elements that passed the test.
	 */
	filter<T>(list: T[], test: (item: T) => boolean): T[] {
		let writeIndex = 0;
		for (const item of list.slice()) {
			if (test(item)) {
				list[writeIndex++] = item;
			}
		}
		list.length = writeIndex;
		return list;
	},

	/**
	 * Returns a copy of the provided list with unique items
	 * @param list - the list to unique
	 * @returns - the unique list
	 */
	unique<T>(list: T[]): T[] {
		return [...new Set(list)];
	},
};
export default MintList;
