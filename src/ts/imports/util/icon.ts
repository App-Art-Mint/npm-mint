/**
 * Icon helper functions
 */
export const MintIcon = {
	/**
	 * Default icons
	 */
	icons: {
		'a[href^="mailto:"]': 'far fa-envelope',
		'a[href^="tel:"]': 'fas fa-phone-flip',
		'a[href^="sms:"]': 'far fa-message',
		'a[href^="https://maps"]': 'fas fa-map-location-dot',
		'a[href^="http"]': 'fas fa-up-right-from-square',
	} as Record<string, string>,

	/**
	 * Appends the given icon to the given selector if there is not already an icon appended
	 */
	append(icon: string, selector: string): void {
		const items: NodeListOf<HTMLElement> = document.querySelectorAll(selector);
		items.forEach((item: HTMLElement) => {
			const iconElement: HTMLElement = document.createElement('i');
			iconElement.classList.add(...icon.split(' '));
			if (!item.querySelector('i')) {
				item.appendChild(iconElement);
			}
			if (iconElement.classList.contains('fa-up-right-from-square')) {
				item.setAttribute('target', '_blank');
			}
		});
	},

	/**
	 * Updates the icons
	 * @param icons - the icons to update
	 */
	update(icons?: Record<string, string | false>): void {
		const merged: Record<string, string | false> = {
			...MintIcon.icons,
			...icons,
		};
		const activeIcons: Record<string, string> = Object.fromEntries(
			Object.entries(merged).filter((entry): entry is [string, string] => entry[1] !== false)
		);

		Object.keys(activeIcons).forEach((selector: string) => {
			MintIcon.append(activeIcons[selector], selector);
		});
	},

	/**
	 * Removes the icon from the given selector
	 */
	remove(selector: string): void {
		const items: NodeListOf<HTMLElement> = document.querySelectorAll(selector);
		items.forEach((item: HTMLElement) => {
			const iconElement: HTMLElement | null = item.querySelector('i');
			if (iconElement) {
				iconElement.remove();
			}
		});
	},
};
export default MintIcon;
