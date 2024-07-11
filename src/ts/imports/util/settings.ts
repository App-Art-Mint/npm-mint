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
     * Breakpoint variables
     */
    static break: {[key: string]: number} = {
        z: 0,
        xs: 480,
        sm: 768,
        md: 1024,
        lg: 1200,
        xl: 1440
    };

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

        if (settings.break && Object.keys(settings.break).length) {
            if (Object.values(settings.break).reduce((prev: any, next: any) => prev && typeof next === 'number', true)) {
                this.break = {...this.break, ...settings.break};
            }
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
};

export default mintSettings;
