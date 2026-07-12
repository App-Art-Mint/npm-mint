/**
 * Imports
 */
import { MintMath } from '../util/math';


/**
 * Grid Component
 */
export const MintGrid = {
	/**
	 * Get a valid grid number
	 */
	gridNum(num?: number): number {
		return MintMath.clamp(num, 1, 4);
	},
};
