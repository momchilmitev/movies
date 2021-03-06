import { showInfo, showError } from '../notification.js';
import {
	createMovie,
	getMovies,
	buyTicket,
	getMovieById,
	getMoviesByOwner,
	updateMovie,
	deleteMovie,
} from '../data.js';

export default async function catalog() {
	const search = this.params.search || '';

	this.partials = {
		header: await this.load('../templates/common/header.hbs'),
		footer: await this.load('../templates/common/footer.hbs'),
		movie: await this.load('../templates/movie/movie.hbs'),
	};

	const movies = await getMovies(search);
	this.app.userData.movies = movies;
	const context = Object.assign(
		{ origin: encodeURIComponent('#/catalog'), search },
		this.app.userData
	);

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
	const movieId = this.params.id;
	const movie = await getMovieById(movieId);
	this.partials = {
		header: await this.load('../templates/common/header.hbs'),
		footer: await this.load('../templates/common/footer.hbs'),
	};

	const context = Object.assign(
		{ movie, origin: encodeURIComponent('#/details/' + movieId) },
		this.app.userData
	);

	this.partial('../templates/movie/details.hbs', context);
}

export async function edit() {
	const movieId = this.params.id;
	const movie = await getMovieById(movieId);

	this.partials = {
		header: await this.load('../templates/common/header.hbs'),
		footer: await this.load('../templates/common/footer.hbs'),
	};

	const context = Object.assign({ movie }, this.app.userData);

	this.partial('../templates/movie/edit.hbs', context);
}

export async function editPost() {
	const movieId = this.params.id;

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

		const result = await updateMovie(movieId, movie);
		if (result.hasOwnProperty('errorData')) {
			const error = new Error();
			Object.assign(error, result);
			throw error;
		}

		showInfo('Movie updated!');
		this.redirect('#/details/' + result.objectId);
	} catch (e) {
		console.log(e);
		showError(e.message);
	}
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
		this.redirect(this.params.origin);
	} catch (e) {
		console.log(e);
		showError(e.message);
	}
}

export async function getMyMovies() {
	this.partials = {
		header: await this.load('../templates/common/header.hbs'),
		footer: await this.load('../templates/common/footer.hbs'),
		movie: await this.load('../templates/movie/movie.hbs'),
		ownMovie: await this.load('../templates/movie/ownMovie.hbs'),
	};

	const movies = await getMoviesByOwner();
	this.app.userData.movies = movies;
	const context = Object.assign(
		{ myMovies: true, origin: encodeURIComponent('#/my_movies') },
		this.app.userData
	);

	this.partial('../templates/movie/catalog.hbs', context);
}

export async function removeMovie() {
	if (confirm('Are you sure?') === false) {
		return this.redirect('#/my_movies');
	}

	const movieId = this.params.id;

	try {
		const result = await deleteMovie(movieId);

		if (result.hasOwnProperty('errorData')) {
			const error = new Error();
			Object.assign(error, result);
			throw error;
		}

		showInfo('Movie deleted!');
		this.redirect('#/my_movies');
	} catch (e) {
		console.log(e);
		showError(e.message);
	}
}
