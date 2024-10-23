/**
 * A generic item
 * @note - this class must be convertable with JSON
 *       - only add strings, numbers, booleans, arrays, and objects
 */
export class MintItem {
	/**
	 * Item settings
	 */
	version?: number = 0;
	priority?: number = 0;
	price?: number = 0;
	level?: number = 0;
	size?: number = 0;
	num?: number = 0;
	width?: number = 0;
	height?: number = 0;

	active?: boolean = false;
	centered?: boolean = false;
	disabled?: boolean = false;
	private?: boolean = false;

	/**
	 * Item properties
	 */
	id?: string;
	slug?: string;
	name?: string;
	title?: string;
	subtitle?: string;
	description?: string;
	category?: string;
	type?: string;
	unit?: string;
	logo?: MintItem;
	icon?: string;
	position?: string;
	transform?: string;
	date?: string;

	/**
	 * Item links
	 */
	src?: string;
	href?: string;
	target?: string;
	routerLink?: string[];

	/**
	 * Item data
	 */
	attr?: { [key: string]: string } = {};
	params?: { [key: string]: string } = {};
	options?: { [key: string]: string } = {};
	lists?: { [key: string]: string[] } = {};

	/**
	 * Item lists
	 */
	paragraphs?: string[] = [];
	classes?: string[] = [];
	items?: MintItem[] = [];
	images?: MintItem[] = [];
	buttons?: MintItem[] = [];
};
export default MintItem;
