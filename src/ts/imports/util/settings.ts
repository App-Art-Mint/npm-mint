/**
 * Settings management
 * @public
 */
export interface MintSettingsUpdate {
	delayBase?: number;
	delayStep?: number;
	delay?: Record<string, number>;
	break?: Record<string, number>;
}

export const MintSettings = {
	/**
	 * Value added to all delay variables
	 */
	delayBase: 0,

	/**
	 * Value multiplied by delay variable index
	 */
	delayStep: 100,

	/**
	 * Delay variables
	 */
	delay: {
		instant: 0,
		fast: 100,
		medFast: 200,
		default: 300,
		medSlow: 400,
		slow: 500,
	} as Record<string, number>,

	/**
	 * Breakpoint variables
	 */
	break: {
		z: 0,
		xs: 480,
		sm: 768,
		md: 1024,
		lg: 1200,
		xl: 1440,
	} as Record<string, number>,

	/**
	 * Update the provided settings variables
	 * @param settings - Object of settings variables to update
	 */
	set(settings: MintSettingsUpdate): void {
		let newDelay = false;
		if (typeof settings.delayBase === 'number') {
			MintSettings.delayBase = settings.delayBase;
			newDelay = true;
		}
		if (typeof settings.delayStep === 'number') {
			MintSettings.delayStep = settings.delayStep;
			newDelay = true;
		}
		if (newDelay) {
			MintSettings.setDelay();
		}

		if (settings.delay && Object.keys(settings.delay).length) {
			if (Object.values(settings.delay).every((value) => typeof value === 'number')) {
				MintSettings.delay = { ...MintSettings.delay, ...settings.delay };
			}
		}

		if (settings.break && Object.keys(settings.break).length) {
			if (Object.values(settings.break).every((value) => typeof value === 'number')) {
				MintSettings.break = { ...MintSettings.break, ...settings.break };
			}
		}
	},

	/**
	 * Updates the delay variables based on `delayBase` and `delayStep`
	 */
	setDelay(): void {
		MintSettings.delay = {
			instant: MintSettings.delayBase + MintSettings.delayStep * 0,
			fast: MintSettings.delayBase + MintSettings.delayStep * 1,
			medFast: MintSettings.delayBase + MintSettings.delayStep * 2,
			default: MintSettings.delayBase + MintSettings.delayStep * 3,
			medSlow: MintSettings.delayBase + MintSettings.delayStep * 4,
			slow: MintSettings.delayBase + MintSettings.delayStep * 5,
		};
	},
};
export default MintSettings;
