/**
 * Imports
 */

// Mint
import { MintModelEvent } from '../models';


/**
 * Attaches Events
 * @remarks Extended by classes that attach and detach events
 */
export abstract class MintAttachesEvents {

	/**
	 * Event handlers
	 */
	events: MintModelEvent[] = [];


	/**
	 * Attach event to the given element
	 * @param element - Element to attach event to
	 * @param event - Event to attach
	 * @param handler - Handler to attach
	 */
	attachEvent(element: HTMLElement | Window | null | undefined, event: string, handler: EventListener) : void {
		if (element) {
			let oldElement = this.events.find(e => e.el === element);
			if (oldElement) {
				oldElement.handlers.push(handler);
				oldElement.events.push(event);
			} else {
				this.events.push({
					el: element,
					handlers: [handler],
					events: [event]
				});
			}
			element.addEventListener(event, handler);
		}
	}

	/**
	 * Detach events
	 */
	detachEvents() {
		this.events.forEach(event => {
			event.handlers.forEach((handler, index) => {
				event.el?.removeEventListener(event.events[index], handler);
			});
		});
		this.events = [];
	}
}
