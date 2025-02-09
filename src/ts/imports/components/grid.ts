/**
 * Imports
 */
import { MintMath } from '../util/math';


/**
 * Grid Component
 */
export abstract class MintGrid {

	/**
	 * Get a valid grid number
	 */
	public static gridNum(num?: number): number {
		return MintMath.clamp(num, 1, 4);
	}
}
