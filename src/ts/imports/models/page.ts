/**
 * Page Interface
 */
export interface IMintPage {
	id: string;
	slug: string;
	title?: string;
	description?: string;
	image?: string;
	items?: any[];
	createdAt?: string;
	updatedAt?: string;
}
export default IMintPage;
