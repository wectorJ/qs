document.addEventListener('DOMContentLoaded', () => {
	const button = document.getElementById('menu-button');
	const menu = document.getElementById('menu-container');

	if (!button || !menu) {
		return;
	}

	button.addEventListener('click', (event) => {
		event.stopPropagation();
		menu.hidden = !menu.hidden;
	});

	menu.addEventListener('click', (event) => {
		event.stopPropagation();
	});

	document.addEventListener('click', () => {
		if (!menu.hidden) {
			menu.hidden = true;
		}
	});
});
