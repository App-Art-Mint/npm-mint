/**
 * Functions for analyzing and manipulating text.
 */
export abstract class mintText {

	/**
	 * Generate a slug from a string
	 * @param text - The string to slugify
	 * @returns The slugified string
	 */
	static slug (text?: string): string {
		return text?.toLowerCase().replace(/\W+/g, '-').replace(/^-+|-+$/g, '') ?? '';
	}

	/**
	 * Format a phone number
	 * @param phone - The phone number to format
	 * @returns The formatted phone number
	 */
	static phone (phone?: string | number): string {
		const given = phone?.toString().trim() ?? '';
		if (given === '(' || given === '') {
			console.log(given);
			return given;
		}

		let numbers = given.replace(/\D/g, '') ?? '',
			formatted = '';

		if (numbers.length > 10) {
			formatted += `+${numbers.slice(0, numbers.length - 10)} `;
			numbers = numbers.slice(numbers.length - 10);
		}

		for (var i = 0; i < numbers.length; i++) {
			switch (i) {
				case 0:
					formatted += '(';
					break;
				case 3:
					formatted += ') ';
					break;
				case 6:
					formatted += '-';
					break;
			}
			formatted += numbers[i];
		}

		switch (given[given.length - 1]) {
			case ')':
				if (i === 3) {
					formatted += ') ';
				}
				break;
			case '-':
				if (i === 6) {
					formatted += '-';
				}
				break;
		}

		return formatted;
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

	/**
	 * Capitalize the first letter of the given word
	 */
	static titleCase (text: string): string {
		return text
			.toLowerCase()
			.replace(/(?:^|\s)\S/g, a => a.toUpperCase());
	}
};
export default mintText;
