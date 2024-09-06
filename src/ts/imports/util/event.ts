import MintSettings from "./settings";

/**
 * Event helper functions
 */
export abstract class MintEvent {
	/**
     * Ensures that a function `func` is run only after not being called for `wait` milliseconds
     * @param func - the function to debounce
     * @param wait - the amount of time to wait before running the function
     * @returns - the debounced function
     */
    static debounce (func: Function, wait: number = MintSettings.delay.default) : Function {
        let timer: number;
        return function (e: any) {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(func, wait, e);
        }
    }

    /**
     * Ensures that a function `func` is run only after not being called for `wait` milliseconds
     * @param func - the function to debounce
     * @param wait - the amount of time to wait before running the function
     * @returns - the debounced function as an EventListener
     */
    static debounceEvent (func: Function, wait: number = MintSettings.delay.default) : EventListener {
        return MintEvent.debounce(func, wait) as EventListener;
    }

    /**
     * Ensures that a function `func` is called at most every `wait` milliseconds with optional leading and trailing calls
     * @param func - the function to throttle
     * @param wait - the amount of time between function calls
     * @param options - leading and trailing options: default = \{ leading: true, trailing, true \}
     * @returns - the throttled function
     */
    static throttle (func: Function,
                     wait: number = MintSettings.delay.default,
                     options?: {[key: string]: boolean}) : Function {
        let context: any, args: any, result: any,
            timeout: number, previous: number = 0,
            later: Function = function () {
                previous = options?.leading === false ? 0 : new Date().getTime();
                timeout = 0;
                result = func.apply(context, args);
                if (!timeout) {
                    context = args = null;
                }
            },
            throttled: Function = function (this: any): any {
                let now: number = new Date().getTime();
                if (!previous && options?.leading === false) {
                    previous = now;
                }
                let remaining: number = wait - now + previous;
                context = this;
                args = arguments;
                if (remaining <= 0 || remaining > wait) {
                    if (timeout) {
                        clearTimeout(timeout);
                        timeout = 0;
                    }
                    previous = now;
                    result = func.apply(context, args);
                    if (!timeout) {
                        context = args = null;
                    }
                } else if (!timeout && options?.trailing !== false) {
                    timeout = window.setTimeout(later, remaining);
                }
                return result;
            };

        return throttled;
    }

    /**
     * Ensures that a function `func` is called at most every `wait` milliseconds with optional leading and trailing calls
     * @param func - the function to throttle
     * @param wait - the amount of time between function calls
     * @param options - leading and trailing options: default = \{ leading: true, trailing, true \}
     * @returns - the throttled function as an EventListener
     */
    static throttleEvent (func: Function,
                          wait: number = MintSettings.delay.default,
                          options?: {[key: string]: boolean}) : EventListener {
        return MintEvent.throttle(func, wait, options) as EventListener;
    }
};
export default MintEvent;
