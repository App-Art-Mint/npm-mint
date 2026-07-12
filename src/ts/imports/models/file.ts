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
	files?: Record<string, IMintFile>
	metadata?: Record<string, string>
}
export default IMintFile;
