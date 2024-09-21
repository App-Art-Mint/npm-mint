/**
 * File model for Amplify Storage
 */
export interface IMintFile {
	path?: string;
	eTag?: string;
	lastModified?: string;
	size?: number;
	progress?: number;
	error?: boolean;
	fetched?: boolean;
	empty?: boolean;
	files?: { [key: string]: IMintFile }
	metadata?: { [key: string]: string }
}
export default IMintFile;
