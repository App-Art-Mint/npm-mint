/**
 * A generic item
 */
export class mintItem {
    /**
     * Item settings
     */
    version?: number = 0;
    priority?: number = 0;
	price?: number = 0;
	level?: number = 0;
	size?: number = 0;
	num?: number = 0;
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
    logo?: mintItem;
    icon?: string;
    position?: string;
    transform?: string;
    date?: Date;

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
    attr?: {[key: string]: string} = {};
    params?: {[key: string]: string} = {};
    options?: {[key: string]: string} = {};
	lists?: {[key: string]: string[]} = {};

    /**
     * Item lists
     */
    paragraphs?: string[] = [];
    classes?: string[] = [];
    items?: mintItem[] = [];
    images?: mintItem[] = [];
    buttons?: mintItem[] = [];
};
export default mintItem;
