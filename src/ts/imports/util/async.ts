/**
 * Handles asynchronous operations
 */
export abstract class MintAsync {
	/**
	 * Wait n milliseconds
	 */
	static wait(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
};
export default MintAsync;
