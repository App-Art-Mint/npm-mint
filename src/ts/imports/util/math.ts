/**
 * Math functions for the util library
 */
export abstract class MintMath {
    /**
     * Get a random integer between min and max
     * @param max Maximum value to return
     * @param min Minimum value to return (default is 0)
     * @returns a random integer between min and max
     */
    static randomInt (max: number, min: number = 0): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

	/**
	 * Return a number between min and max
	 * @param num - the number to clamp
	 * @param min - the minimum value
	 * @param max - the maximum value
	 * @returns a number between min and max
	 */
	public static clamp(num: number | undefined | null, min: number, max: number): number {
		return Math.max(Math.min(num ?? min, max), min);
	}

	/**
	 * Return a valid header number
	 * @param num - the number to validate
	 * @returns a valid header number
	 */
	private static readonly headerMin = 1;
	private static readonly headerMax = 6;
	public static headerLevel(num?: number | null): number {
		return this.clamp(num, this.headerMin, this.headerMax);
	}
}
