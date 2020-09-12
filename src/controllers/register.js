import { register as registerUser } from '../data.js';
import { showInfo, showError } from '../notification.js';

export default async function register() {
	this.partials = {
		header: await this.load('../templates/common/header.hbs'),
		footer: await this.load('../templates/common/footer.hbs'),
		registerForm: await this.load('../templates/user/registerForm.hbs'),
	};

	this.partial('../templates/user/register.hbs', this.app.userData);
}

export async function registerPost() {
	if (this.params.username.length < 3) {
		alert('Username must be at least 3 characters long!');
		return;
	}

	if (this.params.password.length < 6) {
		alert('Password must be at least 6 characters long!');
		return;
	}

	if (this.params.password !== this.params.repeatPassword) {
		alert("Passwords don't match");
		return;
	}

	try {
		const result = await registerUser(
			this.params.username,
			this.params.password
		);
		if (result.hasOwnProperty('errorData')) {
			const error = new Error();
			Object.assign(error, result);
			throw error;
		}

		showInfo('Successfully registered!');
		this.redirect('#/login');
	} catch (e) {
		console.log(e);
		showError(e.message);
	}
}
