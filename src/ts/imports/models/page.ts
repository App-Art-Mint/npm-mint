/**
 * Imports
 */
import MintItem from "./item";


/**
 * Page Interface
 */
export interface IMintPage {
	slug: string;
	title?: string;
	description?: string;
	image?: string;
	items?: MintItem[];
	createdAt?: string;
	updatedAt?: string;
}
export default IMintPage;
