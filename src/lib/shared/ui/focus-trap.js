const focusableSelector = [
	'a[href]',
	'button:not([disabled])',
	'input:not([disabled])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'[tabindex]:not([tabindex="-1"])'
].join(',');

function getFocusableElements(node) {
	return Array.from(node.querySelectorAll(focusableSelector)).filter(
		(element) =>
			typeof element.focus === 'function' &&
			typeof element.getClientRects === 'function' &&
			!element.hasAttribute('aria-hidden') &&
			element.getAttribute('tabindex') !== '-1' &&
			element.getClientRects().length > 0
	);
}

function focusInitialElement(node) {
	const initialElement =
		node.querySelector('[data-autofocus]') || getFocusableElements(node)[0] || node;

	if (typeof initialElement.focus === 'function') {
		initialElement.focus({ preventScroll: true });
	}
}

export function focusTrap(node, options = {}) {
	let previousActiveElement =
		typeof document.activeElement?.focus === 'function' ? document.activeElement : null;
	let onEscape = options.onEscape;

	const handleKeydown = (event) => {
		if (event.key === 'Escape') {
			event.preventDefault();
			event.stopPropagation();
			onEscape?.(event);
			return;
		}

		if (event.key !== 'Tab') return;

		const focusableElements = getFocusableElements(node);
		if (focusableElements.length === 0) {
			event.preventDefault();
			node.focus({ preventScroll: true });
			return;
		}

		const firstElement = focusableElements[0];
		const lastElement = focusableElements[focusableElements.length - 1];

		if (event.shiftKey && document.activeElement === firstElement) {
			event.preventDefault();
			lastElement.focus();
		} else if (!event.shiftKey && document.activeElement === lastElement) {
			event.preventDefault();
			firstElement.focus();
		}
	};

	node.addEventListener('keydown', handleKeydown);
	Promise.resolve().then(() => focusInitialElement(node));

	return {
		update(nextOptions = {}) {
			onEscape = nextOptions.onEscape;
		},
		destroy() {
			node.removeEventListener('keydown', handleKeydown);

			Promise.resolve().then(() => {
				if (previousActiveElement?.isConnected) {
					previousActiveElement.focus({ preventScroll: true });
				}
			});
		}
	};
}
