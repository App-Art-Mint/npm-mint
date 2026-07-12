/**
 * Handles asynchronous operations
 */
export const MintAsync = {
	/**
	 * Wait n milliseconds
	 */
	wait(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	},
};
export default MintAsync;
