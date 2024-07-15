/**
 * Scroll functions
 */
export abstract class mintScroll {
	/**
	 * Scroll to the top of the page
	 */
	static toTop(): void {
		window.scrollTo(0, 0);
	};

	/**
	 * Scroll to the bottom of the page
	 */
	static toBottom(): void {
		window.scrollTo(0, document.body.scrollHeight);
	};

	/**
	 * Show visible elements
	 */
	static showElements(): void {
		requestAnimationFrame(() => {
			let elements = document.querySelectorAll('.mint-fall-in:not(.mint-show)'),
				elementsToShow: Element[] = [];
			for (let i = 0; i < elements.length; i++) {
				if (elements[i].getBoundingClientRect().top < 0) {
					elements[i].classList.add('mint-show');
				} else if (elements[i].getBoundingClientRect().top < window.innerHeight * 3 / 4) {
					elementsToShow.push(elements[i]);
				}
			}
			for (let i = 0; i < elementsToShow.length; i++) {
				setTimeout(() => {
					elementsToShow[i].classList.add('mint-show');
				}, i * 200 + i * i * 20);
			}
		});
	}
};
export default mintScroll;