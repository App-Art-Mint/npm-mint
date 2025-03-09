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
 * Tray (sidebar) functionality
 * @public
 */
export class MintTray extends MintAttachesEvents {

	/**
     * Tray settings
     */
     settings: Record<string, any> = {
		title: 'tray',
        from: EMintSide.Top,
        fixed: true
    };

    /**
     * Frequently-referenced elements
     */
    el: Record<string, HTMLElement | null> = {};


    /**
     * Initializes and closes the tray
     */
    constructor (settings?: Record<string, any>) {
        super();
        this.settings = {...this.settings, ...settings};

		if (!this.settings.id || !this.settings.wrapperId) {
			throw new Error('Tray ID and wrapper ID are required');
		}

        this.attachElements();
        this.attachEvents();
        this.addClasses();

		requestAnimationFrame(() => {
			this.setTray();
		});
    }

    /**
     * Adds elements to {@link el | `this.el`}
     */
    attachElements () : void {
        this.el.html = document.querySelector('html');
		this.el.main = document.querySelector('main');
        this.el.tray = document.getElementById(this.settings.id);
        this.el.wrapper = document.getElementById(this.settings.wrapperId);
        this.el.toggleButton = this.el.tray?.querySelector(MintSelectors.controls(this.settings.wrapperId)) || null;
    }

    /**
     * Adds events to the dom
     */
    attachEvents () : void {
		this.attachEvent(window, 'resize', MintEvent.throttleEvent(this.eHandleResize.bind(this), MintSettings.delay.default));
		this.attachEvent(this.el.main, 'click', MintEvent.throttleEvent(this.eClose.bind(this), MintSettings.delay.default, { trailing: false }));

        const focusables = MintSelectors.getFocusables(this.el.tray);
        focusables?.forEach(focusable => {
            this.attachEvent(focusable, 'keydown', MintEvent.throttleEvent(this.eWrapTab.bind(this)));
        });

        this.attachEvent(this.el.toggleButton, 'click', MintEvent.throttleEvent(this.eToggle.bind(this), MintSettings.delay.slow, { trailing: false }));
        this.attachEvent(this.el.wrapper, 'transitionend', this.eTransitionEnd.bind(this));
    }

    /**
     * Adds classes that inform the styles based on settings
     */
    addClasses () : void {
		if (this.settings.from) {
			this.el.tray?.classList.remove('mint-top', 'mint-right', 'mint-bottom', 'mint-left');
			this.el.tray?.classList.add(`mint-${EMintSide[this.settings.from].toLowerCase()}`);
		} else {
			if (!this.el.tray?.classList.contains('mint-top')
				&& !this.el.tray?.classList.contains('mint-bottom')
				&& !this.el.tray?.classList.contains('mint-left')
				&& !this.el.tray?.classList.contains('mint-right')) {
				this.el.tray?.classList.add('mint-top');
			}
		}

        if (this.settings.tray) {
            this.el.tray?.classList.add('mint-tray');
        }
    }

    /**
     * Sets the state of the tray
     * @param open - `true` to open the tray or `false` to close it
     */
    setTray (open: boolean = false) : void {
        let ariaExpanded: string = open ? 'true' : 'false',
            ariaLabel: string = open ? `close ${this.settings.title}` : `open ${this.settings.title}`;

        this.el.toggleButton?.setAttribute('aria-expanded', ariaExpanded);
        setTimeout(() => {
            this.el.toggleButton?.setAttribute('aria-label', ariaLabel);
        }, MintSettings.delay.fast);

        if (open) {
			// Close other trays
			
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
     * Toggles the state of the tray
     */
    toggleTray () : void {
        this.setTray(this.el.toggleButton?.getAttribute('aria-expanded')?.toLowerCase() === 'false');
    }

    /**
     * Closes the tray when the window resizes
     */
    eHandleResize () : void {
		
		const isMobile = MintWindow.width() <= MintSettings.break.sm;
		let closeMenu = true;
		if (this.el.tray?.classList.contains('mint-tray')) {
			closeMenu = false;
		} else if (!this.el.tray?.classList.contains('mint-expand')) {
			closeMenu = false;
		}
		
		if (!isMobile && closeMenu) {
			this.setTray(false);
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
			focusables = MintSelectors.getFocusables(this.el.tray),
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
     * Toggles the tray
     */
    eToggle () : void {
        this.toggleTray();
    }

	/**
	 * Closes the tray
	 */
	eClose () : void {
		this.setTray(false);
	}

    /**
     * Runs after the tray transitions
     */
    eTransitionEnd () : void {
        if (this.el.wrapper?.classList.contains('mint-open') === false ) {
            this.el.wrapper.style.display = 'none';
        }
    }
}
