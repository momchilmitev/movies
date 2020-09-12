const elements = {
	info: document.getElementById('infoBox'),
	error: document.getElementById('errorBox'),
	loading: document.getElementById('loadingBox'),
};

elements.info.addEventListener('click', hideInfo);
elements.error.addEventListener('click', hideError);

export function showInfo(message) {
	elements.info.firstElementChild.textContent = message;
	elements.info.style.display = 'block';
	setTimeout(hideInfo, 3000);
}

export function showError(message) {
	elements.error.firstElementChild.textContent = message;
	elements.error.style.display = 'block';
}

let requests = 0;

export function showLoading() {
	requests++;
	elements.loading.style.display = 'block';
}

function hideInfo() {
	elements.info.style.display = 'none';
}

function hideError() {
	elements.error.style.display = 'none';
}

export function hideLoading() {
	requests--;
	if (requests === 0) {
		elements.loading.style.display = 'none';
	}
}
