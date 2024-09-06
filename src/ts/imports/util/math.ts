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
};
export default MintMath;
