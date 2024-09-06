/**
 * Imports
 */
import { EMintSide } from '../enums';
import { MintSettings } from './settings';

/**
 * Handles the display of elements
 */
export abstract class MintDisplay {
	/**
     * Sets the element's height to its `innerHeight`, then to `auto` after a delay
     * @param el - the element whose height will be set
     * @param delay - the amount of time in milliseconds that the show animation will be active
     * @param from - the side that the element is animating from
     */
    static show (el?: HTMLElement | null, delay: number = MintSettings.delay.default, from: EMintSide = EMintSide.Top) : void {
        if (el) {
            el.style.display = '';
            requestAnimationFrame(() => {
                if (from === EMintSide.Top || from === EMintSide.Bottom) {
                    el.style.height = `${el.scrollHeight}px`;
                } else {
                    el.style.width = `${el.scrollWidth}px`;
                }
                
                setTimeout(() => {
                    if (from === EMintSide.Top || from === EMintSide.Bottom) {
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
    static hide (el?: HTMLElement | null, delay: number = MintSettings.delay.default, from: EMintSide = EMintSide.Top) : void {
        if (el) {
            let height = el.scrollHeight,
                width = el.scrollWidth,
                transition = el.style.transition;
            el.style.transition = '';
            requestAnimationFrame(() => {
                if (from === EMintSide.Top || from === EMintSide.Bottom) {
                    el.style.height = `${height}px`;
                } else {
                    el.style.width = `${width}px`;
                }
                
                el.style.transition = transition;
                requestAnimationFrame(() => {
                    if (from === EMintSide.Top || from === EMintSide.Bottom) {
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
};
export default MintDisplay;
