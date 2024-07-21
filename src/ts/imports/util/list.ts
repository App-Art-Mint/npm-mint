/**
 * List functions for the util library
 */
export abstract class mintList {
	/**
	 * Returns a copy of the provided list with the items in random order
	 * @param list - the list to shuffle
	 * @returns - the shuffled list
	 */
	static shuffleCopy (list: any[]): any[] {
		let copy = [...list];
		for (let i = copy.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[copy[i], copy[j]] = [copy[j], copy[i]];
		}
		return copy;
	}

	/**
	 * Filters the array in place based on a test condition and returns the filtered array.
	 * This method modifies the original array by removing elements that do not pass the test implemented by the provided function.
	 *
	 * @template T The type of elements in the array.
	 * @param {T[]} list The array to filter, which will be modified in place.
	 * @param {(item: T) => boolean} test A function that tests each element of the array. Return `true` to keep the element, `false` otherwise.
	 * @returns {T[]} The original array with only the elements that passed the test.
	 */
	static filter<T> (list: T[], test: (item: T) => boolean): T[] {
		let newLength = 0;
		for (let i = 0; i < list.length; i++) {
			if (test(list[i])) {
				list[newLength++] = list[i];
			}
		}
		list.length = newLength;
		return list;
	}
};
export default mintList;
