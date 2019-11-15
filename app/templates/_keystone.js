// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

const vincent = require('vincent');
global.basePath = __dirname;

// Initialise Vincent with your project's configuration.
// See https://vincentjs.com/documentation/configuration/ for available options
// and documentation.
vincent.init({
	'name': '<%= projectName %>',
	'brand': '<%= projectName %>',
	'sass': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': '<%= viewEngine %>',
	'emails': 'templates/emails',
	'auto update': true,
	'session': true,
	'auth': true,
	'user model': '<%= userModel %>',
});

// Load project's Models
vincent.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
vincent.set('locals', {
	_: require('lodash'),
	env: vincent.get('env'),
	utils: vincent.utils,
	editable: vincent.content.editable,
});

// Load project's Routes
vincent.set('routes', require('./routes'));

// Configure the navigation bar in Keystone's Admin UI
vincent.set('nav', {
	// blog: ['blogPosts', 'blogCategories', 'blogConfiguration'],
	media: 'image',
	languages: 'language',
	enquiries: 'enquiries',
	users: '<%= userModelPath %>',
});

<% if (includeEmail) { %>
if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
	console.log('----------------------------------------'
	+ '\nWARNING: MISSING MAILGUN CREDENTIALS'
	+ '\n----------------------------------------'
	+ '\nYou have opted into email sending but have not provided'
	+ '\nmailgun credentials. Attempts to send will fail.'
	+ '\n\nCreate a mailgun account and add the credentials to the .env file to'
	+ '\nset up your mailgun integration');
}
<% } %>

vincent.start();
