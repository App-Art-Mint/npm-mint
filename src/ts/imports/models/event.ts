/**
 * Event data
 */
export interface MintModelEvent {
	el: HTMLElement | Window | null,
	handlers: EventListener[],
	events: string[]
}
