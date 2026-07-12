/**
 * Imports
 */
import MintEvent from './event';

/**
 * Scroll functions
 */
export const MintScroll = {
	/**
	 * Scroll to the top of the page
	 */
	toTop(): void {
		window.scrollTo(0, 0);
	},

	/**
	 * Scroll to the bottom of the page
	 */
	toBottom(): void {
		window.scrollTo(0, document.body.scrollHeight);
	},

	/**
	 * Show visible elements
	 */
	showElements(): void {
		requestAnimationFrame(() => {
			const elements = document.querySelectorAll('.mint-fall-in:not(.mint-show)'),
				elementsToShow: Element[] = [];
			for (const element of elements) {
				if (element.getBoundingClientRect().top < 0) {
					element.classList.add('mint-show');
				} else if (element.getBoundingClientRect().top < window.innerHeight * 3 / 4) {
					elementsToShow.push(element);
				}
			}
			for (let i = 0; i < elementsToShow.length; i++) {
				setTimeout(() => {
					elementsToShow[i].classList.add('mint-show');
				}, i * 100);
			}
		});
	},

	/**
	 * Show visible elements on scroll
	 */
	showElementsOnScroll(): void {
		window.addEventListener('scroll', MintEvent.throttleEvent(() => {
			MintScroll.showElements();
		}, 200));
	},
};
export default MintScroll;
