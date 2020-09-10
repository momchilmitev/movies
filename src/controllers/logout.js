import { logout as logoutUser } from '../data.js';

export default async function logout() {
	try {
		const result = await logoutUser();

		if (result.hasOwnProperty('errorData')) {
			const error = new Error();
			Object.assign(error, result);
			throw error;
		}

		this.app.userData.username = '';
		this.app.userData.userId = '';
		this.redirect('#/home');
	} catch (e) {
		console.log(e);
		alert(e.message);
	}
}
