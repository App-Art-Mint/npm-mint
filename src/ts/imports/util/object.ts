/**
 * Object functions for the util library
 */
export const MintObject = {
	/**
	 * Returns true if the provided objects have the same entries
	 */
	isSimilar(obj1: Record<string, unknown>, obj2: Record<string, unknown>): boolean {
		const keys: string[] = Object.keys(obj1);
		if (keys.length !== Object.keys(obj2).length) {
			return false;
		}
		let similar = true;
		keys.forEach((key: string) => {
			if (obj1[key] !== obj2[key]) {
				similar = false;
			}
		});
		return similar;
	},

	/**
	 * Returns true if the first object has at least the same
	 * entries as the second object
	 * @param superset - the object to check
	 * @param subset - the object whose entries are required
	 * @returns - true if the first object is a superset of the second
	 */
	isSuperset(superset: unknown, subset: unknown): boolean {
		let result = true;

		// Base case - if the objects are equal, it is a superset
		if (superset === subset) {
			return result;
		}

		// If the subset isn't an object or array, and doesn't
		// satisfy the base case, it isn't a superset
		try {
			if (Object.keys(subset as object).length === 0) {
				return !result;
			}
		}
		// If the subset is null or undefined, and doesn't satisfy
		// the base case, it isn't a superset
		// TODO: Check if other exceptions could occur
		catch {
			return !result;
		}

		// If the children of the subset are subsets of the
		// respective children of the superset, it is a superset
		const subsetRecord = subset as Record<string, unknown>;
		const supersetRecord = (superset ?? {}) as Record<string, unknown>;
		Object.keys(subsetRecord).forEach((key: string) => {
			result = result && MintObject.isSuperset(supersetRecord[key], subsetRecord[key]);
		});
		return result;
	},

	/**
	 * Removes object entries by key
	 * @see mintObject.removeKeys
	 * @param object - the object to remove entries from
	 * @param keys - the keys to remove
	 */
	remove(object: Record<string, unknown>, keys: string[]): Record<string, unknown> {
		return MintObject.removeKeys(object, keys);
	},

	/**
	 * Removes object entries by key
	 * @param object - the object to remove entries from
	 * @param keys - the keys to remove
	 */
	removeKeys(object: Record<string, unknown>, keys: string[]): Record<string, unknown> {
		return Object.keys(object).reduce<Record<string, unknown>>((obj, key) => {
			if (!keys.includes(key)) {
				obj[key] = object[key];
			}
			return obj;
		}, {});
	},

	/**
	 * Removes object entries by value
	 */
	removeValues(object: Record<string, unknown>, values: unknown[]): Record<string, unknown> {
		return Object.keys(object).reduce<Record<string, unknown>>((obj, key) => {
			if (!values.includes(object[key])) {
				obj[key] = object[key];
			}
			return obj;
		}, {});
	},

	/**
	 * Sorts an object's entries alphabetically by key
	 */
	sort(object: Record<string, unknown>, compareFn?: (a: string, b: string) => number): Record<string, unknown> {
		return MintObject.sortKeys(object, compareFn);
	},

	/**
	 * Sorts an object's entries alphabetically by key
	 */
	sortKeys(object: Record<string, unknown>, compareFn?: (a: string, b: string) => number): Record<string, unknown> {
		return Object.keys(object).sort(compareFn).reduce<Record<string, unknown>>((obj, key) => {
			obj[key] = object[key];
			return obj;
		}, {});
	},

	/**
	 * Sorts an object's entries alphabetically by value
	 */
	sortValues(
		object: Record<string, unknown>,
		compareFn: (a: unknown, b: unknown) => number
	): Record<string, unknown> {
		return Object.keys(object)
			.sort((a: string, b: string) => compareFn(object[a], object[b]))
			.reduce<Record<string, unknown>>((obj, key) => {
				obj[key] = object[key];
				return obj;
			}, {});
	},

	/**
	 * @see mintObject.filterKeys
	 */
	filter(object: Record<string, unknown>, keys: string[]): Record<string, unknown> {
		return MintObject.filterKeys(object, keys);
	},

	/**
	 * Filters an object by its keys
	 * @param object - the object to filter
	 * @param keys - the keys to keep
	 * @returns - the filtered object
	 */
	filterKeys(object: Record<string, unknown>, keys: string[]): Record<string, unknown> {
		return keys.reduce<Record<string, unknown>>((obj, key) => {
			obj[key] = object[key];
			return obj;
		}, {});
	},

	/**
	 * Filters an object by its values
	 * @param object - the object to filter
	 * @param values - the values to keep
	 * @returns - the filtered object
	 */
	filterValues(object: Record<string, unknown>, values: unknown[]): Record<string, unknown> {
		return Object.keys(object).reduce<Record<string, unknown>>((obj, key) => {
			if (values.includes(object[key])) {
				obj[key] = object[key];
			}
			return obj;
		}, {});
	},

	/**
	 * Update two sets of objects
	 * @param original - the original object
	 * @param update - the object to update the original with
	 * @returns - the original objects with updated data from the update
	 */
	updateArray(original: Record<string, unknown>[], update?: Record<string, unknown>[], key = 'id'): void {
		const toKey = (value: unknown): string =>
			typeof value === 'string' || typeof value === 'number' ? String(value) : '';

		// If there are no updates, nothing to apply
		if (!update?.length) {
			return;
		}

		// Create a dictionary of the updated objects
		const updateObjects = update.reduce<Record<string, Record<string, unknown>>>((objects, object) => ({
			...objects,
			[toKey(object[key])]: object
		}), {});

		// Remove any objects that aren't in the updated objects
		const missingObjects = original.filter((object) => !(toKey(object[key]) in updateObjects));
		missingObjects.forEach((object) => {
			const index = original.indexOf(object);
			if (index !== -1) {
				original.splice(index, 1);
			}
		});

		// Update the existing objects with updates
		original.forEach((object) => {
			const id = toKey(object[key]);
			if (id in updateObjects) {
				Object.assign(object, updateObjects[id]);
			}
		});

		// Push any new objects
		const newObjects = update.filter((object) => !original.some((existingObject) => existingObject[key] === object[key]));
		newObjects.forEach(newObject => original.push(newObject));
	},

	/**
	 * Get an object's key by value
	 */
	getKeyByValue(object: Record<string, unknown>, value: unknown): string | undefined {
		return Object.keys(object).find((key) => object[key] === value);
	},

	/**
	 * Create a deep copy of an object
	 */
	deepClone<T>(object: T): T {

		// Only clone objects
		if (typeof object !== 'object' || object === null) {
			return object;
		}

		// Track object references to avoid circular references
		const seen = new WeakMap<object, object>();

		// Track clone tasks in a stack
		type CloneTask = [source: object, clone: Record<string | number, unknown>, key?: string | number];
		const stack: CloneTask[] = [[object, (Array.isArray(object) ? [] : {}) as Record<string | number, unknown>]];

		// Run clone tasks
		while (stack.length) {
			const task = stack.pop();
			if (!task) {
				break;
			}
			const [source, clone, key] = task;

			if (key !== undefined) {
				const value = (source as Record<string | number, unknown>)[key];

				// Bind functions
				if (typeof value === 'function') {
					clone[key] = value.bind(clone);
					continue;
				}

				// Primitives
				if (typeof value !== 'object' || value === null) {
					clone[key] = value;
					continue;
				}

				// Circular references
				if (seen.has(value)) {
					clone[key] = seen.get(value);
					continue;
				}

				// Object / Array
				clone[key] = Array.isArray(value) ? [] : {};
				seen.set(value, clone[key] as object);
				stack.push([value, clone[key] as Record<string | number, unknown>]);

			// No key, process full object
			} else {
				seen.set(source, clone);

				if (Array.isArray(source)) {
					source.forEach((_, index) => {
						stack.push([source, clone, index]);
					});
					continue;
				}

				Object.keys(source).forEach((sourceKey) => {
					stack.push([source, clone, sourceKey]);
				});
			}
		}

		return seen.get(object) as T;
	},
};
export default MintObject;
