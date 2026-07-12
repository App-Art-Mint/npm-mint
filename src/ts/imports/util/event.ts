import MintSettings from "./settings";

/** Accepts any function; `never[]` is the safe "any callback" parameter type. */
export type Callback = (...args: never[]) => unknown;

/**
 * Event helper functions
 */
export const MintEvent = {
	/**
	 * Ensures that a function `func` is run only after not being called for `wait` milliseconds
	 * @param func - the function to debounce
	 * @param wait - the amount of time to wait before running the function
	 * @returns - the debounced function
	 */
	debounce(func: Callback, wait: number = MintSettings.delay.default): Callback {
		let timer = 0;
		return (...args: never[]) => {
			if (timer) {
				clearTimeout(timer);
			}
			timer = window.setTimeout(() => {
				func(...args);
			}, wait);
		};
	},

	/**
	 * Ensures that a function `func` is run only after not being called for `wait` milliseconds
	 * @param func - the function to debounce
	 * @param wait - the amount of time to wait before running the function
	 * @returns - the debounced function as an EventListener
	 */
	debounceEvent(func: Callback, wait: number = MintSettings.delay.default): EventListener {
		return MintEvent.debounce(func, wait) as EventListener;
	},

	/**
	 * Ensures that a function `func` is called at most every `wait` milliseconds with optional leading and trailing calls
	 * @param func - the function to throttle
	 * @param wait - the amount of time between function calls
	 * @param options - leading and trailing options: default = \{ leading: true, trailing, true \}
	 * @returns - the throttled function
	 */
	throttle(
		func: Callback,
		wait: number = MintSettings.delay.default,
		options?: Record<string, boolean>
	): Callback {
		let args: never[] | undefined;
		let result: unknown;
		let timeout = 0;
		let previous = 0;

		const later = () => {
			previous = options?.leading === false ? 0 : new Date().getTime();
			timeout = 0;
			if (args) {
				result = func(...args);
			}
			if (!timeout) {
				args = undefined;
			}
		};

		const throttled = (...throttleArgs: never[]): unknown => {
			const now: number = new Date().getTime();
			if (!previous && options?.leading === false) {
				previous = now;
			}
			const remaining: number = wait - now + previous;
			args = throttleArgs;
			if (remaining <= 0 || remaining > wait) {
				if (timeout) {
					clearTimeout(timeout);
					timeout = 0;
				}
				previous = now;
				result = func(...args);
				if (!timeout) {
					args = undefined;
				}
			} else if (!timeout && options?.trailing !== false) {
				timeout = window.setTimeout(later, remaining);
			}
			return result;
		};

		return throttled;
	},

	/**
	 * Ensures that a function `func` is called at most every `wait` milliseconds with optional leading and trailing calls
	 * @param func - the function to throttle
	 * @param wait - the amount of time between function calls
	 * @param options - leading and trailing options: default = \{ leading: true, trailing, true \}
	 * @returns - the throttled function as an EventListener
	 */
	throttleEvent(
		func: Callback,
		wait: number = MintSettings.delay.default,
		options?: Record<string, boolean>
	): EventListener {
		return MintEvent.throttle(func, wait, options) as EventListener;
	},
};
export default MintEvent;
