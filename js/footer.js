document.addEventListener('DOMContentLoaded', () => {
	const footerContainer = document.getElementById('footer');
	if (!footerContainer) {
		return;
	}

	fetch('./psevdocomponents/footer.html')
		.then((response) => response.text())
		.then((html) => {
			footerContainer.innerHTML = html;
		})
});
