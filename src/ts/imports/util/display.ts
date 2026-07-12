/**
 * Imports
 */
import { EMintSide } from '../enums/side';
import { MintSettings } from './settings';

/**
 * Handles the display of elements
 */
export const MintDisplay = {
	/**
	 * Sets the element's height to its `innerHeight`, then to `auto` after a delay
	 * @param el - the element whose height will be set
	 * @param delay - the amount of time in milliseconds that the show animation will be active
	 * @param from - the side that the element is animating from
	 */
	show(el?: HTMLElement | null, delay: number = MintSettings.delay.default, from: EMintSide = EMintSide.Top): void {
		if (el) {
			el.style.display = '';
			requestAnimationFrame(() => {
				if (from === EMintSide.Top || from === EMintSide.Bottom) {
					el.style.height = `${String(el.scrollHeight)}px`;
				} else {
					el.style.width = `${String(el.scrollWidth)}px`;
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
	},

	/**
	 * Sets the element's height to 0
	 * @param el - the element whose height will be set
	 * @param delay - the amount of time in milliseconds that the show animation will be active
	 * @param from - the side that the element is animating from
	 */
	hide(el?: HTMLElement | null, delay: number = MintSettings.delay.default, from: EMintSide = EMintSide.Top): void {
		if (el) {
			const height = el.scrollHeight,
				width = el.scrollWidth,
				transition = el.style.transition;
			el.style.transition = '';
			requestAnimationFrame(() => {
				if (from === EMintSide.Top || from === EMintSide.Bottom) {
					el.style.height = `${String(height)}px`;
				} else {
					el.style.width = `${String(width)}px`;
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
	},
};
export default MintDisplay;
