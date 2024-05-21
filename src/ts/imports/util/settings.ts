/**
 * Imports
 */
import { mintSide } from '../enum';
import { mintSelectors } from './selectors';

/**
 * Settings management
 * @public
 */
export abstract class mintSettings {
    /**
     * Value added to all delay variables
     */
    static delayBase: number = 0;

    /**
     * Value multiplied by delay variable index
     */
    static delayStep: number = 100;

    /**
     * Delay variables
     */
    static delay: {[key: string]: number} = {
        instant: this.delayBase + this.delayStep * 0,
        fast: this.delayBase + this.delayStep * 1,
        medFast: this.delayBase + this.delayStep * 2,
        default: this.delayBase + this.delayStep * 3,
        medSlow: this.delayBase + this.delayStep * 4,
        slow: this.delayBase + this.delayStep * 5
    };

    /**
     * Side of the window the mobile navbar enters from
     */
    static from?: mintSide;

    /**
    * Whether the navbar is fixed or not
    */
    static fixed?: boolean;

    /**
     * Update the provided settings variables
     * @param settings - Object of settings variables to update
     */
    static set (settings: {[key: string]: any}) : void {
        let newDelay: boolean = false;
        if (typeof settings.delayBase === 'number') {
            this.delayBase = settings.delayBase;
            newDelay = true;
        }
        if (typeof settings.delayStep === 'number') {
            this.delayStep = settings.delayStep;
            newDelay = true;
        }
        if (newDelay) {
            this.setDelay();
        }

        if (settings.delay && Object.keys(settings.delay).length) {
            if (Object.values(settings.delay).reduce((prev: any, next: any) => prev && typeof next === 'number', true)) {
                this.delay = {...this.delay, ...settings.delay};
            }
        }

        if (typeof settings.from === 'number') {
            this.setFrom(settings.from);
        }

        if (typeof settings.fixed === 'boolean') {
            this.setFixed(settings.fixed);
        }
    }

    /**
     * Updates the delay variables based on `this.delayBase` and `this.delayStep`
     */
    protected static setDelay () : void {
        this.delay = {
            instant: this.delayBase + this.delayStep * 0,
            fast: this.delayBase + this.delayStep * 1,
            medFast: this.delayBase + this.delayStep * 2,
            default: this.delayBase + this.delayStep * 3,
            medSlow: this.delayBase + this.delayStep * 4,
            slow: this.delayBase + this.delayStep * 5
        };
    }

    /**
     * Updates the direction the navbar enters from
     */
    protected static setFrom (from: mintSide) : void {
        if (this.from !== from) {
            this.from = from;
            let header: HTMLElement | null = document.getElementById(mintSelectors.getId('header'));
            header?.classList.remove(...Object.values(mintSelectors.classes.sides));
            header?.classList.add(mintSelectors.getClass(mintSide[this.from].toLowerCase(), 'sides'));
        }
    }

    /**
     * Updates whether or not the navbar is fixed
     */
    protected static setFixed (fixed: boolean) : void {
        if (this.fixed !== fixed) {
            this.fixed = fixed;
            let header: HTMLElement | null = document.getElementById(mintSelectors.getId('header')),
                fixedClass: string = mintSelectors.getClass('fixed');
            if (this.fixed) {
                header?.classList.add(fixedClass);
            } else {
                header?.classList.remove(fixedClass);
            }
        }
    }
};

export default mintSettings;
