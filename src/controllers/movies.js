import { showInfo, showError } from '../notification.js';
import { createMovie, getMovies, buyTicket, getMovieById } from '../data.js';

export default async function catalog() {
	this.partials = {
		header: await this.load('../templates/common/header.hbs'),
		footer: await this.load('../templates/common/footer.hbs'),
		movie: await this.load('../templates/movie/movie.hbs'),
	};

	const movies = await getMovies();
	const context = Object.assign({ movies }, this.app.userData);

	this.partial('../templates/movie/catalog.hbs', context);
}

export async function create() {
	this.partials = {
		header: await this.load('../templates/common/header.hbs'),
		footer: await this.load('../templates/common/footer.hbs'),
	};

	this.partial('../templates/movie/create.hbs', this.app.userData);
}

export async function createPost() {
	try {
		if (this.params.title.length === 0) {
			throw new Error('Title is required!');
		}

		const movie = {
			title: this.params.title,
			image: this.params.image,
			description: this.params.description,
			genres: this.params.genres,
			tickets: Number(this.params.tickets),
		};

		const result = await createMovie(movie);
		if (result.hasOwnProperty('errorData')) {
			const error = new Error();
			Object.assign(error, result);
			throw error;
		}

		showInfo('Movie created!');
		this.redirect('#/details/' + result.objectId);
	} catch (e) {
		console.log(e);
		showError(e.message);
	}
}

export async function details() {
	this.partials = {
		header: await this.load('../templates/common/header.hbs'),
		footer: await this.load('../templates/common/footer.hbs'),
	};

	this.partial('../templates/movie/details.hbs', this.app.userData);
}

export async function edit() {
	this.partials = {
		header: await this.load('../templates/common/header.hbs'),
		footer: await this.load('../templates/common/footer.hbs'),
	};

	this.partial('../templates/movie/edit.hbs', this.app.userData);
}

export async function buyMovieTicket() {
	const movieId = this.params.id;
	const movie = await getMovieById(movieId);

	try {
		const result = await buyTicket(movie);

		if (result.hasOwnProperty('errorData')) {
			const error = new Error();
			Object.assign(error, result);
			throw error;
		}

		showInfo(`You bought ticket for ${movie.title}!`);
		this.redirect('#/catalog');
	} catch (e) {
		console.log(e);
		showError(e.message);
	}
}
