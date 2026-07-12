/**
 * Imports
 */

// Mint
import { MintPanel } from "./panel";
import { MintMenu } from "./menu";


/**
 * Header settings
 */
export interface MintHeaderSettings {
	id: string;
	wrapperId: string;
	title: string;
	fixed: boolean;
}


/**
 * Main header functionality
 * @public
 */
export class MintHeader {

	/**
	 * Navbar settings
	 */
	settings: MintHeaderSettings = {
		id: 'mint-menu',
		wrapperId: 'mint-wrapper',
		title: 'menu',
		fixed: true
	};

	/**
	 * Frequently-referenced elements
	 */
	el: Record<string, HTMLElement | null> = {};

	/**
	 * Navigation functionality
	 */
	panel?: MintPanel;
	menu?: MintMenu;


	/**
	 * Initializes and closes the menu
	 */
	constructor(settings?: Partial<MintHeaderSettings>) {
		this.settings = { ...this.settings, ...settings };

		this.panel = new MintPanel(this.settings);
		this.menu = new MintMenu(this.settings);

		this.attachElements();
		this.addClasses();
	}

	/**
	 * Detach events
	 */
	detachEvents(): void {
		this.panel?.detachEvents();
		this.menu?.detachEvents();
	}

	/**
	 * Adds elements to {@link el | `this.el`}
	 */
	attachElements(): void {
		this.el.body = document.querySelector('body');
	}

	/**
	 * Adds classes that inform the styles based on settings
	 */
	addClasses(): void {
		if (this.settings.fixed) {
			this.el.body?.classList.add('mint-fixed');
		}
	}
}
