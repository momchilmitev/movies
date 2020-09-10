const appId = '5B384662-46D4-8185-FFB6-F6C6F22D9A00';
const restId = '45B450F3-02EC-4B59-B501-D264577DC88C';

function generateURL(endpoint) {
	return `https://api.backendless.com/${appId}/${restId}/${endpoint}`;
}

const endPoints = {
	REGISTER: 'users/register',
	LOGIN: 'users/login',
	LOGOUT: 'users/logout',
	MOVIES: 'data/movies',
	MOVIE_BY_ID: 'data/movies/',
};

export async function register(username, password) {
	const url = generateURL(endPoints.REGISTER);

	return (
		await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username,
				password,
			}),
		})
	).json();
}

export async function login(username, password) {
	const url = generateURL(endPoints.LOGIN);

	const result = await (
		await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				login: username,
				password,
			}),
		})
	).json();

	localStorage.setItem('userToken', result['user-token']);
	localStorage.setItem('username', result.username);
	localStorage.setItem('userId', result.objectId);

	return result;
}

export async function logout() {
	const url = generateURL(endPoints.LOGOUT);
	const token = localStorage.getItem('userToken');

	localStorage.removeItem('userToken');
	localStorage.removeItem('username');
	localStorage.removeItem('userId');

	return await fetch(url, {
		headers: {
			'user-token': token,
		},
	});
}

// get all movies
export async function getMovies() {
	const url = generateURL(endPoints.MOVIES);
	const token = localStorage.getItem('userToken');

	return (
		await fetch(url, {
			headers: {
				'user-token': token,
			},
		})
	).json();
}

// get movie by id
export async function getMovieById(id) {
	const url = generateURL(endPoints.MOVIE_BY_ID) + id;
	const token = localStorage.getItem('userToken');

	return (
		await fetch(url, {
			headers: {
				'user-token': token,
			},
		})
	).json();
}

// get movies by userId
export async function getMoviesByOwner(ownerId) {
	const url =
		generateURL(endPoints.MOVIES) + `?where=ownerId%3D%27${ownerId}%27`;
	const token = localStorage.getItem('userToken');
	return (
		await fetch(url, {
			headers: {
				'user-token': token,
			},
		})
	).json();
}

// create movie
export async function createMovie(movie) {
	const url = generateURL(endPoints.MOVIES);
	const token = localStorage.getItem('userToken');

	return (
		await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'user-token': token,
			},
			body: JSON.stringify(movie),
		})
	).json();
}

// edit movie
export async function updateMovie(id, updatedProps) {
	const url = generateURL(endPoints.MOVIE_BY_ID) + id;
	const token = localStorage.getItem('userToken');

	return (
		await fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'user-token': token,
			},
			body: JSON.stringify(updatedProps),
		})
	).json();
}

// delete movie
export async function deleteMovie(id) {
	const url = generateURL(endPoints.MOVIE_BY_ID) + id;
	const token = localStorage.getItem('userToken');

	return (
		await fetch(url, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'user-token': token,
			},
		})
	).json();
}

// buy ticket
export async function buyTicket(movie) {
	const newTickets = movie.tickets - 1;
	const movieId = movie.objectId;

	return updateMovie(movieId, { tickets: newTickets });
}
