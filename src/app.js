import home from './controllers/home.js';
import register, { registerPost } from './controllers/register.js';
import login, { loginPost } from './controllers/login.js';
import logout from './controllers/logout.js';
import catalog, {
	create,
	createPost,
	edit,
	details,
} from './controllers/movies.js';

window.addEventListener('load', () => {
	const app = Sammy('#container', function () {
		this.use('Handlebars', 'hbs');

		this.userData = {
			username: localStorage.getItem('username') || '',
			userId: localStorage.getItem('userId') || '',
		};

		this.get('/', home);
		this.get('index.html', home);
		this.get('#/home', home);

		this.get('#/register', register);
		this.post('#/register', (ctx) => {
			registerPost.call(ctx);
		});

		this.get('#/login', login);
		this.post('#/login', (ctx) => {
			loginPost.call(ctx);
		});

		this.get('#/logout', logout);
		this.get('#/catalog', catalog);

		this.get('#/create', create);
		this.post('#/create', (ctx) => {
			createPost.call(ctx);
		});

		this.get('#/edit/:id', edit);
		this.get('#/details/:id', details);
	});

	app.run();
});
