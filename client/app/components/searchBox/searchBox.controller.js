class searchBoxController {
	constructor() {
		this.name = 'searchBox';
	}

	search() {
		if (this.text === 'easter egg') {
			this.onSwitchPage('incident-form');
		} else {
			global.window.location.href = `https://www.google.co.uk/search?q=${ this.text || '' }`;
		}
	}
}


export default searchBoxController;