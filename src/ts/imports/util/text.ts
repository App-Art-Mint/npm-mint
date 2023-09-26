/**
 * Functions for analyzing and manipulating text.
 */
export abstract class mintText {
	/*static fitContainer () {
		console.log('hellooo');
		let $warning: JQuery<HTMLElement> = $(warningSelector);
		$warning.css({
			overflow: 'scroll',
			fontSize: ''
		});
		while (($warning?.[0].scrollHeight ?? Number.MIN_SAFE_INTEGER) > ($warning?.innerHeight() ?? Number.MAX_SAFE_INTEGER)) {
			let fontSize: number = parseInt($warning.css('font-size')) - 1;
			$warning.css('font-size', fontSize + 'px');
		}
	}*/

	/**
	 * Generate a slug from a string
	 * @param str - The string to slugify
	 * @returns The slugified string
	 */
	static slug (str: string): string {
		return str.toLowerCase().replace(/\W+/g, '-').replace(/^-+|-+$/g, '');
	}

	/**
	 * Pluralize the given word
	 */
	static pluralize (word: string): string {
		if (word.endsWith('ies') ||
			word.endsWith('es') ||
			(word.endsWith('s') && !word.endsWith('us') && !word.endsWith('is') && !word.endsWith('ss'))) {
			return word;
		}

		if (word.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(word.charAt(word.length - 2))) {
			return word.slice(0, -1) + 'ies';
		}

		if (word.endsWith('s') || word.endsWith('sh') || word.endsWith('ch') || word.endsWith('x') || word.endsWith('z')) {
			return word + 'es';
		}

		return word + 's';
	}
};
export default mintText;
