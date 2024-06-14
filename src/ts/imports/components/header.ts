/**
 * Imports
 */
import { mintSide } from '../enum';
import mintUtil from '../../util';
import mintSelectors from '../util/selectors';
import mintSettings from '../util/settings';

/**
 * Main header functionality
 * @public
 */
export class mintHeader {
    /**
     * Last-logged window width
     */
    lastWidth: number = mintUtil.windowWidth();

    /**
     * Frequently-referenced elements
     */
    el: {[key: string]: HTMLElement | null} = {};

    /**
     * Initializes and closes the menu
     */
    constructor (settings?: {[key: string]: any}) {
        let defaultSettings: {[key: string]: any} = {
            from: mintSide.Top,
            fixed: true
        };
        mintSettings.set({ ...defaultSettings, ...settings });
        
        this.attachElements();
        this.attachEvents();
        this.addClasses();
        
        this.setMobileMenu();
    }

    /**
     * Adds elements to {@link el | `this.el`}
     */
    attachElements () : void {
        this.el.html = document.querySelector('html');
        this.el.body = document.querySelector('body');
        this.el.header = document.getElementById(mintSelectors.getId('header'));
        this.el.mobileButton = this.el.header?.querySelector(mintSelectors.controls(mintSelectors.getId('wrapper'))) || null;
        this.el.wrapper = document.getElementById(mintSelectors.getId('wrapper'));
    }

    /**
     * Adds events to the dom
     */
    attachEvents () : void {
        //window.addEventListener('resize', mintUtil.throttleEvent(this.eHandleResize.bind(this), mintSettings.delay.default, { trailing: false }));
        window.addEventListener('scroll', mintUtil.throttleEvent(this.eHandleScroll.bind(this), mintSettings.delay.default, { trailing: false }));

        let focusables: NodeListOf<HTMLElement> | undefined = this.el.header?.querySelectorAll(mintSelectors.focusable),
            lastFocusable: HTMLElement | undefined = focusables?.[focusables?.length - 1];
        lastFocusable?.addEventListener('keydown', mintUtil.throttleEvent(this.eWrapTab.bind(this)));
        focusables?.forEach((focusable: HTMLElement) => {
            focusable.addEventListener('keydown', mintUtil.throttleEvent(this.eHandleKeypress.bind(this)));
        });

        let menuButtons: NodeListOf<HTMLElement> | undefined = this.el.header?.querySelectorAll(mintSelectors.controls() + mintSelectors.neg(mintSelectors.controls(mintSelectors.ids.wrapper as string)));
        menuButtons?.forEach((menuButton: HTMLElement) => {
            menuButton.addEventListener('click', mintUtil.throttleEvent(this.eToggleMenu.bind(this), mintSettings.delay.slow, { trailing: false }));
        });

        this.el.mobileButton?.addEventListener('click', mintUtil.throttleEvent(this.eToggleMobileMenu.bind(this), mintSettings.delay.slow, { trailing: false }));
        this.el.wrapper?.addEventListener('transitionend', this.eTransitionEnd.bind(this));
    }

    /**
     * Adds classes that inform the styles 
     */
    addClasses () : void {
        if (mintSettings.fixed) {
            this.el.body?.classList.add(mintSelectors.getClass('fixed'));
        }
    }

    /**
     * Sets the state of the mobile menu
     * @param open - `true` to open the menu or `false` to close it
     */
    setMobileMenu (open: boolean = false) : void {
        let ariaExpanded: string = open ? 'true' : 'false',
            ariaLabel: string = open ? 'close menu' : 'open menu';

        this.el.mobileButton?.setAttribute('aria-expanded', ariaExpanded);
        setTimeout(() => {
            this.el.mobileButton?.setAttribute('aria-label', ariaLabel);
        }, mintSettings.delay.fast);

        if (open) {
            if (mintSettings.fixed !== true) {
                window.scroll({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                });
            }

            setTimeout(() => {
                if (this.el.html) {
                    this.el.html.style.overflow = 'hidden';
                }
            }, mintSettings.from === mintSide.Left ? mintSettings.delay.default : mintSettings.delay.instant);
            
            if (this.el.wrapper) {
                this.el.wrapper.style.display = 'flex';
            }

            requestAnimationFrame(() => {
                this.el.wrapper?.classList.add(mintSelectors.getClass('open'));
            });
        } else {
            if (this.el.html) {
                this.el.html.style.overflow = 'auto';
            }            
            
            requestAnimationFrame(() => {
                this.el.wrapper?.classList.remove(mintSelectors.getClass('open'));
            });

            this.closeAllMenus();
        }
    }

    /**
     * Toggles the state of the mobile menu
     */
    toggleMobileMenu () : void {
        this.setMobileMenu(this.el.mobileButton?.getAttribute('aria-expanded')?.toLowerCase() === 'false');
    }

    /**
     * Sets the state of the provided button's menu
     * @param button - Button element to set
     * @param open - `true` to open the menu or `false` to close it
     */
    setMenu (button?: HTMLElement | null,
             open: boolean = false) : void {
        let ariaExpanded: string = open ? 'true' : 'false',
            menu: HTMLElement | null = button?.nextElementSibling as HTMLElement | null;
        if (button && menu) {
            button.setAttribute('aria-expanded', ariaExpanded);
            if (open) {
                mintUtil.show(menu);
            } else {
                mintUtil.hide(menu);
                this.closeSubMenus(button);
            }
        }
    }

    /**
     * Toggles the state of the provided button's menu
     * @param button - Button element to toggle
     */
    toggleMenu (button?: HTMLElement | null) : void {
        this.setMenu(button, button?.getAttribute('aria-expanded')?.toLowerCase() !== 'true');
    }

    /**
     * Closes all submenus of the provided button's menu
     * @param button - Button element of the parent menu
     */
    closeSubMenus (button?: HTMLElement | null) : void {
        let menu: HTMLElement | null | undefined = button?.nextElementSibling as HTMLElement,
            subMenus: NodeListOf<HTMLElement> = menu?.querySelectorAll(mintSelectors.subMenuButtons) as NodeListOf<HTMLElement>;
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
    closeSiblingMenus (button?: HTMLElement | null) : void {
        let menu: HTMLElement | null | undefined = button?.parentElement as HTMLElement,
            siblingMenus: NodeListOf<HTMLElement> = menu?.parentElement?.querySelectorAll(mintSelectors.subMenuButtons) as NodeListOf<HTMLElement>;
        siblingMenus.forEach((child: HTMLElement) => {
            if (child !== button) {
                this.setMenu(child);
            }
        });
    }

    /**
     * Closes all submenus of the n4vbar
     */
    closeAllMenus () : void {
        let menuButtons: NodeListOf<HTMLElement> | undefined = this.el.wrapper?.querySelectorAll(mintSelectors.subMenuButtons);
        menuButtons?.forEach((menuButton: HTMLElement) => {
            this.setMenu(menuButton);
        });
    }

    /**
     * Opens the menu closest to the document's focus
     */
    openClosestMenu () : void {
        let activeButton: HTMLElement | null = document.activeElement as HTMLElement | null,
            activeMenu: HTMLElement | null = activeButton?.nextElementSibling as HTMLElement | null,
            showing: boolean = activeButton?.getAttribute('aria-expanded')?.toLowerCase() === 'true';
        if (activeButton?.getAttribute('aria-controls') === mintSelectors.ids.wrapper) {
            activeMenu = this.el.wrapper;
        }

        if (activeButton?.getAttribute('aria-controls') && activeMenu && !showing) {
            activeButton.click();
            let firstFocusable: HTMLElement | null = activeMenu.querySelector(mintSelectors.focusable);
            firstFocusable?.focus();
        }
    }

    /**
     * Closes the menu closest to the document's focus
     */
    closeClosestMenu () : void {
        let activeElement: HTMLElement | null = document.activeElement as HTMLElement | null,
            activeMenu: HTMLElement | null = activeElement?.closest(mintSelectors.subMenu) as HTMLElement | null,
            activeButton: HTMLElement | null = activeMenu?.previousElementSibling ? activeMenu.previousElementSibling as HTMLElement : this.el.mobileButton;
        if (activeElement?.getAttribute('aria-controls') && activeElement?.getAttribute('aria-expanded')?.toLowerCase() === 'true') {
            activeButton = activeElement;
        }

        if (activeButton?.getAttribute('aria-expanded')?.toLowerCase() === 'true') {
            activeButton?.click();
            activeButton?.focus();
        }
    }

    /**
     * Toggles the menu closest to the document's focus
     */
    toggleClosestMenu () : void {
        if (document.activeElement?.getAttribute('aria-expanded')?.toLowerCase() === 'true') {
            this.closeClosestMenu();
        } else {
            this.openClosestMenu();
        }
    }

    /**
     * Closes the mobile menu when the window resizes
     */
    eHandleResize (e: Event) : void {
        // Also check if resized from mobile to desktop
        if (mintUtil.windowWidth() !== this.lastWidth) {
            this.setMobileMenu();
        }
        this.lastWidth = mintUtil.windowWidth();
    }

    /**
     * Closes all submenus when the page is scrolled
     */
    eHandleScroll () : void {
        this.closeAllMenus();
    }

    /**
     * Sends the focus to the menu button after tabbing past the last menu item
     * @param e - Keyboard event
     */
    eWrapTab (e: KeyboardEvent) : void {
        if (e.key.toLowerCase() === 'tab' && !e.shiftKey) {
            this.el.mobileButton?.focus();
            if (document.activeElement === this.el.mobileButton) {
                e.preventDefault();
            }
        }
    }

    /**
     * Handles keypresses on n4vbar buttons
     * @param e - Keyboard event
     */
    eHandleButtonKeypress (e: KeyboardEvent) : void {
        let target = e.target as HTMLElement | null,
            subMenu = target?.closest('li');
        switch (e.key.toLowerCase()) {
            case 'escape':
                if (subMenu?.classList.contains(mintSelectors.classes.open as string)) {
                    this.setMenu(subMenu);
                } else {
                    this.setMobileMenu();
                    this.el.menuButton?.focus();
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
     * Handles keypresses on n4vbar links
     * @param e - Keyboard event
     */
    eHandleLinkKeypress (e: KeyboardEvent) : void {
        let target = e.target as HTMLElement | null;
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
     * Handles keypresses on the n4vbar
     * @param e - Keyboard event
     */
    eHandleKeypress (e: KeyboardEvent) : void {
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
     * Toggles the mobile menu
     */
    eToggleMobileMenu () : void {
        this.toggleMobileMenu();
    }

    /**
     * Toggles the clicked submenu
     * @param e - Mouse event
     */
    eToggleMenu (e: MouseEvent) : void {
        let target = e.target as HTMLElement | null;
        this.closeSiblingMenus(target);
        this.toggleMenu(target);
    }

    /**
     * Runs after the mobile menu transitions
     */
    eTransitionEnd () : void {
        if (this.el.wrapper?.classList.contains(mintSelectors.getClass('open')) === false ) {
            this.el.wrapper.style.display = 'none';
        }
    };
}
export default mintHeader;
