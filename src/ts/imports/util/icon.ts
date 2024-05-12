/**
 * Imports
 */
import mintObject from "./object";

/**
 * Icon helper functions
 */
export abstract class mintIcon {
    /**
     * Default icons
     */
    static icons: {[key: string]: string} = {
        'a[href^="mailto:"]': 'far fa-envelope',
        'a[href^="tel:"]': 'fas fa-phone-flip',
        'a[href^="sms:"]': 'far fa-message',
        'a[href^="https://maps"]': 'fas fa-map-location-dot',
        'a[href^="http"]': 'fas fa-up-right-from-square'
    };

    /**
     * Appends the given icon to the given selector if there is not already an icon appended
     */
    static append (icon: string, selector: string): void {
        console.log('mintIcon.append', icon, selector);
        let items: NodeListOf<HTMLElement> = document.querySelectorAll(selector);
        items.forEach((item: HTMLElement) => {
            let iconElement: HTMLElement = document.createElement('i');
            iconElement.classList.add(...icon.split(' '));
            if (!item.querySelector('i')) {
                item.appendChild(iconElement);
            }
			if (iconElement.classList.contains('fa-up-right-from-square')) {
				item.setAttribute('target', '_blank');
			}
        });
    }

    /**
     * Updates the icons
     * @param icons - the icons to update
     */
    static update (icons?: {[key: string]: string | false}): void {
        let activeIcons: {[key: string]: string} = mintObject.removeValues({
            ...this.icons,
            ...icons
        }, [false]);

        console.log('mintIcon.update', activeIcons);

        Object.keys(activeIcons).forEach((selector: string) => {
            this.append(activeIcons[selector], selector);
        });
    }

    /**
     * Removes the given icon from the given selector
     * @param icon - the icon to remove
     */
    static remove (icon: string, selector: string): void {
        let items: NodeListOf<HTMLElement> = document.querySelectorAll(selector);
        items.forEach((item: HTMLElement) => {
            let iconElement: HTMLElement | null = item.querySelector('i');
            if (iconElement) {
                iconElement.remove();
            }
        });
    }
};
export default mintIcon;
