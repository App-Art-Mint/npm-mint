/**
 * Imports
 */

// Mint
import { MintAttachesEvents } from '../abstract';
import {
	MintDisplay,
	MintEvent,
	MintSelectors,
	MintSettings,
} from '../util';


/**
 * Menu settings
 */
export interface MintMenuSettings {
	wrapperId: string;
}


/**
 * Menu (dropdown) functionality
 * @public
 */
export class MintMenu extends MintAttachesEvents {

	/**
	 * Tray settings
	 */
	settings: Partial<MintMenuSettings> = {};

	/**
	 * Frequently-referenced elements
	 */
	el: Record<string, HTMLElement | null> = {};


	/**
	 * Initializes and closes the tray
	 */
	constructor(settings?: Partial<MintMenuSettings>) {
		super();
		this.settings = { ...this.settings, ...settings };

		if (!this.settings.wrapperId) {
			throw new Error('Wrapper ID is required');
		}

		this.attachElements();
		this.attachEvents();

		requestAnimationFrame(() => {
			this.closeAllMenus();
		});
	}

	/**
	 * Adds elements to {@link el | `this.el`}
	 */
	attachElements(): void {
		const { wrapperId } = this.settings;
		this.el.wrapper = wrapperId ? document.getElementById(wrapperId) : null;
	}

	/**
	 * Adds events to the dom
	 */
	attachEvents(): void {
		this.attachEvent(window, 'scroll', MintEvent.throttleEvent(this.eHandleScroll.bind(this), MintSettings.delay.default, { trailing: false }));

		const focusables = this.el.wrapper?.querySelectorAll(MintSelectors.focusable) as NodeListOf<HTMLElement> | null;
		focusables?.forEach((focusable) => {
			this.attachEvent(focusable, 'keydown', MintEvent.throttleEvent(this.eHandleKeypress.bind(this)));
		});

		const menuButtons = this.el.wrapper?.querySelectorAll(MintSelectors.controls()) as NodeListOf<HTMLElement> | null;
		menuButtons?.forEach((menuButton) => {
			this.attachEvent(menuButton, 'click', MintEvent.throttleEvent(this.eToggleMenu.bind(this), MintSettings.delay.slow, { trailing: false }));
		});
	}

	/**
	 * Sets the state of the provided button's menu
	 * @param button - Button element to set
	 * @param open - `true` to open the menu or `false` to close it
	 */
	setMenu(button?: HTMLElement | null,
		open = false): void {
		const ariaExpanded: string = open ? 'true' : 'false',
			menu: HTMLElement | null = button?.nextElementSibling as HTMLElement | null;
		if (button && menu) {
			button.setAttribute('aria-expanded', ariaExpanded);
			if (open) {
				MintDisplay.show(menu);
			} else {
				MintDisplay.hide(menu);
				this.closeSubMenus(button);
			}
		}
	}

	/**
	 * Toggles the state of the provided button's menu
	 * @param button - Button element to toggle
	 */
	toggleMenu(button?: HTMLElement | null): void {
		this.setMenu(button, button?.getAttribute('aria-expanded')?.toLowerCase() !== 'true');
	}

	/**
	 * Closes all submenus of the provided button's menu
	 * @param button - Button element of the parent menu
	 */
	closeSubMenus(button?: HTMLElement | null): void {
		const menu = button?.nextElementSibling as HTMLElement | null;
		if (!menu) {
			return;
		}
		const subMenus = menu.querySelectorAll<HTMLElement>(MintSelectors.subMenuButtons);
		subMenus.forEach((child: HTMLElement) => {
			// setMenu calls this function, so ignore subsub menus
			if (child.parentElement?.parentElement === menu) {
				this.setMenu(child);
			}
		});
	}

	/**
	 * Closes all sibling menus of the provided button's menu
	 * @param button - Button element of the sibling menus
	 */
	closeSiblingMenus(button?: HTMLElement | null): void {
		const menu = button?.parentElement;
		const siblingMenus = menu?.parentElement?.querySelectorAll<HTMLElement>(MintSelectors.subMenuButtons);
		siblingMenus?.forEach((child: HTMLElement) => {
			if (child !== button) {
				this.setMenu(child);
			}
		});
	}

	/**
	 * Closes all submenus of the menu
	 */
	closeAllMenus(): void {
		const menuButtons: NodeListOf<HTMLElement> | undefined = this.el.wrapper?.querySelectorAll(MintSelectors.subMenuButtons);
		menuButtons?.forEach((menuButton: HTMLElement) => {
			this.setMenu(menuButton);
		});
	}

	/**
	 * Opens the menu closest to the document's focus
	 */
	openClosestMenu(): void {
		const activeButton = document.activeElement as HTMLElement | null;
		let activeMenu = activeButton?.nextElementSibling as HTMLElement | null;
		const showing = activeButton?.getAttribute('aria-expanded')?.toLowerCase() === 'true';
		if (activeButton?.getAttribute('aria-controls') === this.settings.wrapperId) {
			activeMenu = this.el.wrapper;
		}

		if (activeButton?.getAttribute('aria-controls') && activeMenu && !showing) {
			activeButton.click();
			const firstFocusable: HTMLElement | null = activeMenu.querySelector(MintSelectors.focusable);
			firstFocusable?.focus();
		}
	}

	/**
	 * Closes the menu closest to the document's focus
	 */
	closeClosestMenu(): void {
		const activeElement = document.activeElement as HTMLElement | null;
		const activeMenu = activeElement?.closest(MintSelectors.subMenu) as HTMLElement | null;
		let activeButton = activeMenu?.previousElementSibling as HTMLElement | null | undefined;
		if (activeElement?.getAttribute('aria-controls') && activeElement.getAttribute('aria-expanded')?.toLowerCase() === 'true') {
			activeButton = activeElement;
		}

		if (activeButton?.getAttribute('aria-expanded')?.toLowerCase() === 'true') {
			activeButton.click();
			activeButton.focus();
		}
	}

	/**
	 * Toggles the menu closest to the document's focus
	 */
	toggleClosestMenu(): void {
		if (document.activeElement?.getAttribute('aria-expanded')?.toLowerCase() === 'true') {
			this.closeClosestMenu();
		} else {
			this.openClosestMenu();
		}
	}

	/**
	 * Closes all submenus when the page is scrolled
	 */
	eHandleScroll(): void {
		this.closeAllMenus();
	}

	/**
	 * Handles keypresses on menu buttons
	 * @param e - Keyboard event
	 */
	eHandleButtonKeypress(e: KeyboardEvent): void {
		const target = e.target as HTMLElement | null,
			subMenu = target?.closest('li');
		switch (e.key.toLowerCase()) {
			case 'escape':
				if (subMenu?.classList.contains('mint-open')) {
					this.setMenu(subMenu);
				}
				break;
			case 'arrowleft':
				this.closeClosestMenu();
				break;
			case 'arrowright':
				this.openClosestMenu();
				break;
			case 'enter':
			case 'space':
				target?.click();
				break;
		}
	}

	/**
	 * Handles keypresses on menu links
	 * @param e - Keyboard event
	 */
	eHandleLinkKeypress(e: KeyboardEvent): void {
		const target = e.target as HTMLElement | null;
		switch (e.key.toLowerCase()) {
			case 'escape':
			case 'arrowleft':
				this.closeClosestMenu();
				break;
			case 'arrowright':
				this.openClosestMenu();
				break;
			case 'enter':
			case 'space':
				target?.click();
				break;
		}
	}

	/**
	 * Handles keypresses on the menu
	 * @param e - Keyboard event
	 */
	eHandleKeypress(e: Event): void {
		if (!(e instanceof KeyboardEvent)) {
			return;
		}

		if (e.key.toLowerCase() !== 'tab') {
			e.preventDefault();
		}
		const target = e.target as HTMLElement | null;
		switch (target?.tagName.toLowerCase()) {
			case 'a':
				this.eHandleLinkKeypress(e);
				break;
			case 'button':
				this.eHandleButtonKeypress(e);
				break;
		}
	}

	/**
	 * Toggles the clicked submenu
	 * @param e - Mouse event
	 */
	eToggleMenu(e: Event): void {
		if (!(e instanceof MouseEvent)) {
			return;
		}

		const target = e.target as HTMLElement | null;
		this.closeSiblingMenus(target);
		this.toggleMenu(target);
	}
};
