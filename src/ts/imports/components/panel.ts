/**
 * Imports
 */
import { EMintSide } from '../enums/side';
import { MintAttachesEvents } from '../abstract';
import {
	MintEvent,
	MintSelectors,
	MintSettings,
	MintWindow
} from '../util';


/**
 * Panel (sidebar) functionality
 * @public
 */
export class MintPanel extends MintAttachesEvents {

	/**
     * Panel settings
     */
     settings: Record<string, any> = {
		title: 'panel',
        from: EMintSide.Top,
        fixed: true
    };

    /**
     * Frequently-referenced elements
     */
    el: Record<string, HTMLElement | null> = {};


    /**
     * Initializes and closes the panel
     */
    constructor (settings?: Record<string, any>) {
        super();
        this.settings = {...this.settings, ...settings};

		if (!this.settings.id || !this.settings.wrapperId) {
			throw new Error('Panel ID and wrapper ID are required');
		}

        this.attachElements();
        this.attachEvents();
        this.addClasses();

		requestAnimationFrame(() => {
			this.setPanel();
		});
    }

    /**
     * Adds elements to {@link el | `this.el`}
     */
    attachElements () : void {
        this.el.html = document.querySelector('html');
		this.el.main = document.querySelector('main');
        this.el.panel = document.getElementById(this.settings.id);
        this.el.wrapper = document.getElementById(this.settings.wrapperId);
        this.el.toggleButton = this.el.panel?.querySelector(MintSelectors.controls(this.settings.wrapperId)) || null;
    }

    /**
     * Adds events to the dom
     */
    attachEvents () : void {
		this.attachEvent(window, 'resize', MintEvent.throttleEvent(this.eHandleResize.bind(this), MintSettings.delay.default));
		this.attachEvent(this.el.main, 'click', MintEvent.throttleEvent(this.eClose.bind(this), MintSettings.delay.default, { trailing: false }));
        this.attachEvent(this.el.wrapper, 'transitionend', this.eTransitionEnd.bind(this));

        const focusables = MintSelectors.getFocusables(this.el.panel);
        focusables?.forEach(focusable => {
            this.attachEvent(focusable, 'keydown', MintEvent.throttleEvent(this.eWrapTab.bind(this)));
        });

		const toggleButtons = this.el.panel?.querySelectorAll(MintSelectors.controls(this.settings.wrapperId)) as NodeListOf<HTMLElement>;
		toggleButtons?.forEach(toggleButton => {
			this.attachEvent(toggleButton, 'click', MintEvent.throttleEvent(this.eToggle.bind(this), MintSettings.delay.slow, { trailing: false }));
		});
    }

    /**
     * Adds classes that inform the styles based on settings
     */
    addClasses () : void {
		this.el.panel?.classList.add('mint-panel');
		this.el.wrapper?.classList.add('mint-panel-wrapper');
		this.el.toggleButton?.classList.add('mint-panel-toggle');

		if (this.settings.from) {
			this.el.panel?.classList.remove('mint-top', 'mint-right', 'mint-bottom', 'mint-left');
			this.el.panel?.classList.add(`mint-${EMintSide[this.settings.from].toLowerCase()}`);
		}

        if (this.settings.tray) {
            this.el.panel?.classList.add('mint-tray');
        }
    }

    /**
     * Sets the state of the panel
     * @param open - `true` to open the panel or `false` to close it
     */
    setPanel (open: boolean = false) : void {
        let ariaExpanded: string = open ? 'true' : 'false',
            ariaLabel: string = open ? `close ${this.settings.title}` : `open ${this.settings.title}`;

        this.el.toggleButton?.setAttribute('aria-expanded', ariaExpanded);
        setTimeout(() => {
            this.el.toggleButton?.setAttribute('aria-label', ariaLabel);
        }, MintSettings.delay.fast);

        if (open) {
			this.closeOtherPanels();
			
            if (this.settings.fixed !== true) {
                window.scroll({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                });
            }

            setTimeout(() => {
                if (this.el.html) {
                    let isMobile = MintWindow.width() <= MintSettings.break.sm,
                        overflow = 'auto';

                    if (this.settings.tray) {
                        if (isMobile) {
                            overflow = 'hidden';
                        }
                    } else {
                        overflow = 'hidden';
                    }
                    this.el.html.style.overflow = overflow;
                }
            }, this.settings.from === EMintSide.Left ? MintSettings.delay.default : MintSettings.delay.instant);
            
            if (this.el.wrapper) {
                this.el.wrapper.style.display = 'flex';
            }

            requestAnimationFrame(() => {
                this.el.wrapper?.classList.add('mint-open');
            });
        } else {
            if (this.el.html) {
                this.el.html.style.overflow = 'auto';
            }            
            
            requestAnimationFrame(() => {
                this.el.wrapper?.classList.remove('mint-open');
            });
        }
    }

    /**
     * Toggles the state of the panel
     */
    togglePanel () : void {
        this.setPanel(this.el.toggleButton?.getAttribute('aria-expanded')?.toLowerCase() === 'false');
    }

	/**
	 * Closes other panels
	 */
	closeOtherPanels () : void {
		const openPanelSelector = `.mint-panel-toggle[aria-expanded="true"]:not([aria-controls="${this.settings.wrapperId}"])`;
		const toggleBtn = document.querySelector(openPanelSelector) as HTMLButtonElement;
		toggleBtn?.click();
	}

    /**
     * Closes the panel when the window resizes
     */
    eHandleResize () : void {
		const isMobile = MintWindow.width() <= MintSettings.break.sm;
		let closeMenu = true;
		if (this.el.panel?.classList.contains('mint-tray')) {
			closeMenu = false;
		} else if (!this.el.panel?.classList.contains('mint-expand')) {
			closeMenu = false;
		}
		
		if (!isMobile && closeMenu) {
			this.setPanel(false);
		}

        const isOpen = this.el.toggleButton?.getAttribute('aria-expanded')?.toLowerCase() === 'true';
		let overflow = 'auto';
        
        if (isOpen) {
            if (this.settings.tray) {
                if (isMobile) {
                    overflow = 'hidden';
                }
            } else {
                overflow = 'hidden';
            }
        }

        if (this.el.html) {
            this.el.html.style.overflow = overflow;
        }
    }

    /**
     * Sends the focus to the toggle button after tabbing past the last focusable element
     * @param e - Keyboard event
     */
    eWrapTab (e: KeyboardEvent) : void {
		const
			focusables = MintSelectors.getFocusables(this.el.panel),
			lastFocusable = focusables?.[focusables?.length - 1],
			wrapTab = focusables?.length > 1 && document.activeElement === lastFocusable,
			isTab = e.key.toLowerCase() === 'tab' && !e.shiftKey;

        if (isTab && wrapTab) {
            this.el.toggleButton?.focus();
            if (document.activeElement === this.el.toggleButton) {
                e.preventDefault();
            }
        }
    }

    /**
     * Toggles the panel
     */
    eToggle () : void {
        this.togglePanel();
    }

	/**
	 * Closes the panel
	 */
	eClose () : void {
		this.setPanel(false);
	}

    /**
     * Runs after the panel transitions
     */
    eTransitionEnd () : void {
        if (this.el.wrapper?.classList.contains('mint-open') === false ) {
            this.el.wrapper.style.display = 'none';
        }
    }
}
