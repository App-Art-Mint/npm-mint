/**
 * Imports
 */
import { mintSide } from './imports/enum';
import mintSettings from './imports/util/settings';

/**
 * Utility functions
 * @public
 */
export abstract class mintUtil {
    /**
     * Returns the width of the window, including fractional pixels
     * @returns the width of the window
     */
    static windowWidth () : number {
        const decimal: number = document.body.getBoundingClientRect().width % 1;
        return window.innerWidth + decimal;
    }

    /**
     * Ensures that a function `func` is run only after not being called for `wait` milliseconds
     * @param func - the function to debounce
     * @param wait - the amount of time to wait before running the function
     * @returns - the debounced function
     */
    static debounce (func: Function, wait: number = mintSettings.delay.default) : Function {
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
    static debounceEvent (func: Function, wait: number = mintSettings.delay.default) : EventListener {
        return mintUtil.debounce(func, wait) as EventListener;
    }

    /**
     * Ensures that a function `func` is called at most every `wait` milliseconds with optional leading and trailing calls
     * @param func - the function to throttle
     * @param wait - the amount of time between function calls
     * @param options - leading and trailing options: default = \{ leading: true, trailing, true \}
     * @returns - the throttled function
     */
    static throttle (func: Function,
                     wait: number = mintSettings.delay.default,
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
                          wait: number = mintSettings.delay.default,
                          options?: {[key: string]: boolean}) : EventListener {
        return mintUtil.throttle(func, wait, options) as EventListener;
    }

    /**
     * Sets the element's height to its `innerHeight`, then to `auto` after a delay
     * @param el - the element whose height will be set
     * @param delay - the amount of time in milliseconds that the show animation will be active
     * @param from - the side that the element is animating from
     */
    static show (el?: HTMLElement | null, delay: number = mintSettings.delay.default, from: mintSide = mintSide.Top) : void {
        if (el) {
            el.style.display = '';
            requestAnimationFrame(() => {
                if (from === mintSide.Top || from === mintSide.Bottom) {
                    el.style.height = `${el.scrollHeight}px`;
                } else {
                    el.style.width = `${el.scrollWidth}px`;
                }
                
                setTimeout(() => {
                    if (from === mintSide.Top || from === mintSide.Bottom) {
                        el.style.height = 'auto';
                    } else {
                        el.style.width = 'auto';
                    }
                }, delay);
            });
        }
    }

    /**
     * Sets the element's height to 0
     * @param el - the element whose height will be set
     * @param delay - the amount of time in milliseconds that the show animation will be active
     * @param from - the side that the element is animating from
     */
    static hide (el?: HTMLElement | null, delay: number = mintSettings.delay.default, from: mintSide = mintSide.Top) : void {
        if (el) {
            let height = el.scrollHeight,
                width = el.scrollWidth,
                transition = el.style.transition;
            el.style.transition = '';
            requestAnimationFrame(() => {
                if (from === mintSide.Top || from === mintSide.Bottom) {
                    el.style.height = `${height}px`;
                } else {
                    el.style.width = `${width}px`;
                }
                
                el.style.transition = transition;
                requestAnimationFrame(() => {
                    if (from === mintSide.Top || from === mintSide.Bottom) {
                        el.style.height = '0';
                    } else {
                        el.style.width = '0';
                    }
                });
            });
            setTimeout(() => {
                el.style.display = 'none';
            }, delay);
        }
    }

    /**
     * Copies the provided text to the clipboard
     * @param text - the text to copy
     * @returns - true if the text was successfully copied to the clipboard; else false
     */
    static copyText (text: string) : boolean {
        let textArea: HTMLTextAreaElement = document.createElement('textarea');

        if (!text || !textArea) {
            return false;
        }

        textArea.value = text;
        textArea.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            transform: translate(-100%, -100%);
            opacity: 0;
            z-index: -1;
        `;

        document.body.appendChild(textArea);
        textArea.select();
        textArea.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(textArea.value);
        document.body.removeChild(textArea);

        return true;
    }

    /**
     * Tests the validity of an email address
     * @see {@link https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression}
     * @param text - the string to test
     * @returns - true if the given string is an email address; false if not
     */
    static isEmail (text: string) : boolean {
        return null !== text.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/);
    }
}
export default mintUtil;
