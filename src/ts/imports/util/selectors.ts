/**
 * CSS-selector helpers
 * @public
 */
const lib = 'mint';
const pre = `${lib}-`;
const disabled = '[disabled]';
const hasControls = '[aria-controls]';
const hasExpanded = '[aria-expanded]';
const hasLink = '[href]';
const hasRouterLink = '[routerLink]';
const hasId = '[id]';
const notTabbable = '[tabindex^="-"]';

function neg(base: string): string {
	return `:not(${base})`;
}

const tabbable = `[tabindex]${neg(notTabbable)}`;
const focusable: string = `input${neg(disabled)}${neg(notTabbable)},
							select${neg(disabled)}${neg(notTabbable)},
							textarea${neg(disabled)}${neg(notTabbable)},
							button${neg(disabled)}${neg(notTabbable)},
							object${neg(disabled)}${neg(notTabbable)},
							a${hasLink}, a${hasRouterLink},
							area${hasLink},
							${tabbable}`.replace(/\s/g, '');
const subMenuButtons = `button${hasControls}`;
const subMenu = `${subMenuButtons} + ul${hasId}`;

export const MintSelectors = {
	lib,
	pre,
	disabled,
	hasControls,
	hasExpanded,
	hasLink,
	hasRouterLink,
	hasId,
	notTabbable,
	tabbable,
	focusable,
	subMenuButtons,
	subMenu,

	/**
	 * Adds the library prefix to the beginning of the provided string
	 * @param base - the string to be prefixed
	 * @returns - the provided string prefixed with the library name
	 */
	prefix(base: string): string {
		base = base.toLowerCase();
		return base.startsWith(pre) ? base : `${pre}${base}`;
	},

	/**
	 * Adds two dashes to the beginning of the provided string
	 * @param base - the string to be prefixed
	 * @returns - the provided string prefixed with two dashes
	 */
	cssPrefix(base: string): string {
		return `--${MintSelectors.prefix(base.replace(/^-+/, ''))}`;
	},

	/**
	 * Turns the provided string into a CSS variable call
	 * @param base - the name of the CSS variable to call
	 * @returns - the CSS variable call for the provided string
	 */
	cssVar(base: string): string {
		return `var(${MintSelectors.cssPrefix(base)})`;
	},

	/**
	 * Negates the provided CSS selector
	 * @param base - the CSS selector to negate
	 * @returns - the negated CSS selector
	 */
	neg,

	/**
	 * Generates a class CSS selector
	 * @param base - the name of the class to generate
	 * @returns - the generated CSS selector
	 */
	class(base: string): string {
		return `.${MintSelectors.prefix(base)}`;
	},

	/**
	 * Generates an id CSS selector
	 * @param base - the name of the id to generate
	 * @returns - the generated CSS selector
	 */
	id(base: string): string {
		return `#${MintSelectors.prefix(base)}`;
	},

	/**
	 * Generates an aria-controls CSS selector
	 * @param id - the id of the controlled element
	 * @returns - the generated CSS selector
	 */
	controls(id?: string | null): string {
		return id ? `[aria-controls="${MintSelectors.prefix(id)}"]` : hasControls;
	},

	/**
	 * Generates an aria-expanded CSS selector
	 * @param bool - whether the element is expanded or not
	 * @returns - the generated CSS selector
	 */
	expanded(bool?: boolean | null): string {
		return typeof bool === 'boolean' ? `[aria-expanded="${String(bool)}"]` : hasExpanded;
	},

	/**
	 * Returns a NodeList of HTMLElements within the given element that are focusable
	 * @param el - the element whose focusable children will be returned
	 * @returns - the elements within the given element that are focusable
	 */
	getFocusables(el?: HTMLElement | null): HTMLElement[] {
		let focusables: HTMLElement[];
		if (el) {
			focusables = Array.from(el.querySelectorAll<HTMLElement>(focusable));
		} else {
			focusables = Array.from(document.querySelectorAll<HTMLElement>(focusable));
		}
		return focusables.filter((child: HTMLElement) => MintSelectors.isFocusable(child));
	},

	/**
	 * Returns true if an element is focusable and false if not,
	 * based on styles (i.e. a parent has display: none;)
	 * NOTE: Still need to determine what other styles may make an element un-focusable
	 * @param el - the element
	 * @returns - true if the element is focusable; false if not
	 */
	isFocusable(el: HTMLElement): boolean {
		let current: HTMLElement | null = el;

		do {
			if (window.getComputedStyle(current).getPropertyValue('display').toLowerCase() === 'none') {
				return false;
			}
			current = current.parentElement;
		} while (current);
		return true;
	},
};
export default MintSelectors;
