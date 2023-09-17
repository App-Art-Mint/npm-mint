/**
 * List functions for the util library
 */
export abstract class mintList {
	/**
	 * Returns a copy of the provided list with the items in random order
	 * @param list - the list to shuffle
	 * @returns - the shuffled list
	 */
	static shuffle (list: any[]): any[] {
		let copy = [...list];
		for (let i = copy.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[copy[i], copy[j]] = [copy[j], copy[i]];
		}
		return copy;
	}
};
export default mintList;
