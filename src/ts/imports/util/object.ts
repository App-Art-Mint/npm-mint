/**
 * Object functions for the util library
 */
export abstract class mintObject {
    /**
     * Returns true if the provided objects have the same entries
     */
     static isSimilar (obj1: any, obj2: any) : boolean {
        let keys: string[] = Object.keys(obj1);
        if (keys.length !== Object.keys(obj2).length) {
            return false;
        }
        let isSimilar: boolean = true;
        keys.forEach((key: string) => {
            if (obj1[key] !== obj2[key]) {
                isSimilar = false;
            }
        });
        return isSimilar;
    };

    /**
     * Returns true if the first object has at least the same
     * entries as the second object
     * @param superset - the object to check
     * @param subset - the object whose entries are required
     * @returns - true if the first object is a superset of the second
     * @recursive
     */
    static isSuperset (superset: any, subset: any) : boolean {
        let isSuperset: boolean = true;
        
        // Base case - if the objects are equal, it is a superset
        if (superset === subset) {
            return isSuperset;
        }

        // If the subset isn't an object or array, and doesn't
        // satisfy the base case, it isn't a superset
        try {
            if (Object.keys(subset).length === 0) {
                return !isSuperset;
            }
        }
        // If the subset is null or undefined, and doesn't satisfy
        // the base case, it isn't a superset
        // TODO: Check if other exceptions could occur
        catch (e) {
            return !isSuperset;
        }

        // If the children of the subset are subsets of the
        // respective children of the superset, it is a superset
        Object.keys(subset).forEach((key: string) => {
            isSuperset = isSuperset && mintObject.isSuperset(superset[key], subset[key]);
        });
        return isSuperset;
    };

    /**
     * Removes object entries by key
     * @alias mintObject.removeKeys
     * @param object - the object to remove entries from
     * @param keys - the keys to remove
     */
    static remove (object: any, keys: string[]) : Object {
        return this.removeKeys(object, keys);
    };

    /**
     * Removes object entries by key
     * @param object - the object to remove entries from
     * @param keys - the keys to remove
     */
    static removeKeys (object: any, keys: string[]) : any {
        return Object.keys(object).reduce((obj: any, key: string) => {
            if (!keys.includes(key)) {
                obj[key] = object[key];
            }
            return obj;
        }, {});
    };

    /**
     * Removes object entries by value
     */
    static removeValues (object: any, values: any[]) : any {
        return Object.keys(object).reduce((obj: any, key: string) => {
            if (!values.includes(object[key])) {
                obj[key] = object[key];
            }
            return obj;
        }, {});
    };
    
    /**
     * Sorts an object's entries alphabetically by key
     */
    static sort (object: any) : Object {
        return Object.keys(object).sort().reduce((obj: any, key: string) => {
            obj[key] = object[key];
            return obj;
        }, {});
    };

    /**
     * @alias mintObject.filterKeys
     */
    static filter (object: any, keys: string[]) : Object {
        return this.filterKeys(object, keys);
    };

    /**
     * Filters an object by its keys
     * @param object - the object to filter
     * @param keys - the keys to keep
     * @returns - the filtered object
     */
    static filterKeys (object: any, keys: string[]) : Object {
        return keys.reduce((obj: any, key: string) => {
            obj[key] = object[key];
            return obj;
        }, {});
    };

    /**
     * Filters an object by its values
     * @param object - the object to filter
     * @param values - the values to keep
     * @returns - the filtered object
     */
    static filterValues (object: any, values: any[]) : Object {
        return Object.keys(object).reduce((obj: any, key: string) => {
            if (values.includes(object[key])) {
                obj[key] = object[key];
            }
            return obj;
        }, {});
    };
};
export default mintObject;
