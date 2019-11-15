const colors = require('colors'); // eslint-disable-line
const util = require('util');
const path = require('path');
const _ = require('lodash');
const utils = require('keystone-utils');
const crypto = require('crypto');
const yeoman = require('yeoman-generator');
require('./includesPolyfill');

const KeystoneGenerator = module.exports = function KeystoneGenerator (args, options, config) {

	// Set utils for use in templates
	this.utils = utils;
	this.auto = args.includes('auto');
	this.skipInstall = args.includes('skipInstall');

	// Initialise default values
	this.cloudinaryURL = false;
	this.mailgunConfigured = false;
	this.mailgunAPI = false;
	this.mailgunDomain = false;

	// Apply the Base Generator
	yeoman.generators.Base.apply(this, arguments);

	// Welcome
	console.log('\nWelcome to VincentJS.\n');

	// This callback is fired when the generator has completed,
	// and includes instructions on what to do next.
	const done = _.bind(function done () {
		
		// Copy Util.js file from CodyHouse Framework to the public folder
		//this.copy(path.join(__dirname, '../node_modules/codyhouse-framework/main/assets/js/util.js'), 'public/js/util.js');
		
		const cmd = (this.newDirectory ? '"cd ' + utils.slug(this.projectName) + '" then ' : '') + '"' + 'npm start' + '"';
		console.log(
			'\n------------------------------------------------'
			+ '\n'
			+ '\nYour VincentJS project is ready to go!'
			+ '\n'
			+ '\nFor help getting started, visit https://vincentjs.com/getting-started/'

			+ ((this.includeEmail && !this.mailgunConfigured)
				? '\n'
				+ '\nWe\'ve included the setup for email in your project. When you'
				+ '\nwant to get this working, just create a mailgun account and put'
				+ '\nyour mailgun details into the .env file.'
				: '')

			+ ((this.usingDemoCloudinaryAccount)
				? '\n'
				+ '\nWe\'ve included a demo Cloudinary Account, which is reset daily.'
				+ '\nPlease configure your own account or use the LocalImage field instead'
				+ '\nbefore sending your site live.'
				: '')

			+ '\n\nTo start your new website, run ' + cmd + '.'
			+ '\n');

	}, this);

	// Install Dependencies when done
	this.on('end', function () {

		this.installDependencies({
			bower: false,
			skipMessage: true,
			skipInstall: options['skip-install'] || this.skipInstall,
			callback: done,
		});

	});

	// Import Package.json
	this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

};

// Extends the Base Generator
util.inherits(KeystoneGenerator, yeoman.generators.Base);

KeystoneGenerator.prototype.prompts = function prompts () {

	const cb = this.async();

	if (this.auto) {
		this._projectName = 'Vincent Starter';
		this.projectName = 'vincent-starter';
		this.adminLogin = 'user@vincentjs.com';
		this.adminPassword = 'admin';
		this.viewEngine = 'pug';
		this.preprocessor = 'sass';
		this.userModel = 'User';
		this.userModelPath = utils.keyToPath(this.userModel, true);
		this.destinationRoot(utils.slug(this.projectName));
		this.includeEmail = true;
		this.includeBlog = true;
		this.includeGallery = true;
		this.usingDemoCloudinaryAccount = true;
		this.cloudinaryURL = 'cloudinary://333779167276662:_8jbSi9FB3sWYrfimcl8VKh34rI@keystone-demo';
		this.includeGuideComments = false;
		this.includeEnquiries = true;
		this.newDirectory = true;
		return cb();
	}

	const prompts = {

		project: [
			{
				name: 'projectName',
				message: 'What is the name of your project?',
				default: 'My Site',
			}, {
				type: 'confirm',
				name: 'includeBlog',
				message: 'Would you like to include a Blog?',
				default: true,
			}, {
				type: 'confirm',
				name: 'includeGallery',
				message: 'Would you like to include an Image Gallery?',
				default: false,
			}, {
				name: 'adminLogin',
				message: 'Enter an email address for the first Admin user:',
				default: 'user@vincentjs.com',
			}, {
				name: 'adminPassword',
				message: 'Enter a password for the first Admin user:'
					+ '\n Please use a temporary password as it will be saved in plain text and change it after the first login.',
				default: 'admin',
			}, {
				type: 'confirm',
				name: 'newDirectory',
				message: 'Would you like to create a new directory for your project?',
				default: true,
			}
		],

		config: [],

	};

	this.prompt(prompts.project, function (props) {

		_.assign(this, props);

		// Keep an unescaped version of the project name
		this._projectName = this.projectName;
		// ... then escape it for use in strings (most cases)
		this.projectName = utils.escapeString(this.projectName);
		// Escape other inputs
		this.adminLogin = utils.escapeString(this.adminLogin);
		this.adminPassword = utils.escapeString(this.adminPassword);
		
		this.viewEngine = 'pug';
		this.preprocessor = 'sass';

		// Clean the userModel name
		this.userModel = utils.camelcase(this.userModel || 'User', false);
		this.userModelPath = utils.keyToPath(this.userModel, true);
		
		// Forcing the email and enquiries
		this.includeEmail = true;
		this.includeEnquiries = true;

		// Create the directory if required
		if (this.newDirectory) {
			this.destinationRoot(utils.slug(this.projectName));
		}

		// Additional prompts may be required, based on selections
		if (this.includeBlog || this.includeGallery || this.includeEmail) {

			if (this.includeEmail) {
				prompts.config.push({
					name: 'mailgunAPI',
					message: '------------------------------------------------'
						+ '\n    If you want to set up mailgun now, you can provide'
						+ '\n    your mailgun credentials, otherwise, you will'
						+ '\n    want to add these to your .env later.'
						+ '\n    mailgun API key:',
				});
				prompts.config.push({
					name: 'mailgunDomain',
					message: '------------------------------------------------'
					+ '\n    mailgun domain:',
				});
			}
			
			prompts.config.push({
				name: 'cloudinaryURL',
				message: '------------------------------------------------'
				+ '\n    VincentJS uses KeystoneJS that integrates with Cloudinary for image upload, resizing and'
				+ '\n    hosting. See https://keystonejs.com/api/field/cloudinaryimage for more info.'
				+ '\n    '
				+ '\n    CloudinaryImage fields are used by the whole project for every image.'
				+ '\n    '
				+ '\n    You can skip this for now (we\'ll include demo account details)'
				+ '\n    '
				+ '\n    Please enter your Cloudinary URL:',
			});

		}

		if (!prompts.config.length) {
			return cb();
		}

		this.prompt(prompts.config, function (props) {

			_.each(props, function (val, key) {
				this[key] = val;
			}, this);

			if (this.includeEmail && (this.mailgunAPI && this.mailgunDomain)) {
				this.mailgunConfigured = true;
			}

			if (!this.cloudinaryURL && (this.includeBlog || this.includeGallery)) {
				this.usingDemoCloudinaryAccount = true;
				this.cloudinaryURL = 'cloudinary://333779167276662:_8jbSi9FB3sWYrfimcl8VKh34rI@keystone-demo';
			}

			cb();

		}.bind(this));

	}.bind(this));

};

KeystoneGenerator.prototype.guideComments = function () {

	const cb = this.async();
	if (this.auto) {
		return cb();
	}


	this.prompt([
		{
			type: 'confirm',
			name: 'includeGuideComments',
			message: '------------------------------------------------'
				+ '\n    Finally, would you like to include extra code comments in'
				+ '\n    your project? If you\'re new to Keystone, these may be helpful.',
			default: true,
		},
	], function (props) {

		this.includeGuideComments = props.includeGuideComments;
		cb();

	}.bind(this));

};

KeystoneGenerator.prototype.keys = function keys () {

	this.cookieSecret = crypto.randomBytes(64).toString('hex');

};

KeystoneGenerator.prototype.project = function project () {

	this.template('_package.json', 'package.json');
	this.template('_env', '.env');

	this.template('_eslintrc', '.eslintrc');
	this.template('_eslintignore', '.eslintignore');
	this.template('_keystone.js', 'keystone.js');
	
	this.directory('lib');

	this.copy('editorconfig', '.editorconfig');
	this.copy('gitignore', '.gitignore');
	this.copy('Procfile');
	this.copy('gulpfile.js');

};

KeystoneGenerator.prototype.models = function models () {

	let modelFiles = [];
	
	modelFiles.push('Language');
	modelFiles.push('cms/Image');

	// TODO: Add blog models
	/*if (this.includeBlog) {
		modelFiles.push('blog/BlogPost');
		modelFiles.push('blog/BlogCategory');
		modelFiles.push('blog/BlogConfiguration');
	}*/

	if (this.includeEnquiries) {
		modelFiles.push('Enquiry');
	}

	this.mkdir('models');

	this.template('models/_User.js', 'models/' + this.userModel + '.js');

	modelFiles.forEach(function (i) {
		this.template('models/' + i + '.js');
	}, this);

};

KeystoneGenerator.prototype.routes = function routes () {

	this.directory('routes/api');
	// this.mkdir('routes');
	this.mkdir('routes/views');

	this.template('routes/_index.js', 'routes/index.js');
	this.template('routes/_middleware.js', 'routes/middleware.js');

	if (this.includeEmail) {
		this.template('routes/_emails.js', 'routes/emails.js');
	}

	this.copy('routes/views/index.js');

	if (this.includeBlog) {
		this.copy('routes/views/blog.js');
		this.copy('routes/views/post.js');
	}

	if (this.includeGallery) {
		this.copy('routes/views/gallery.js');
	}

	if (this.includeEnquiries) {
		this.copy('routes/views/contact.js');
	}

};

KeystoneGenerator.prototype.templates = function templates () {

	this.mkdir('templates');
	this.mkdir('templates/views');

	this.directory('templates/default-' + this.viewEngine + '/codyhouse-components', 'templates/codyhouse-components');
	
	this.directory('templates/default-' + this.viewEngine + '/layouts', 'templates/layouts');
	this.directory('templates/default-' + this.viewEngine + '/mixins', 'templates/mixins');
	this.directory('templates/default-' + this.viewEngine + '/views/errors', 'templates/views/errors');

	this.template('templates/default-' + this.viewEngine + '/views/index.' + this.viewEngine, 'templates/views/index.' + this.viewEngine);

	if (this.includeBlog) {
		this.copy('templates/default-' + this.viewEngine + '/views/blog.' + this.viewEngine, 'templates/views/blog.' + this.viewEngine);
		this.copy('templates/default-' + this.viewEngine + '/views/post.' + this.viewEngine, 'templates/views/post.' + this.viewEngine);
	}

	if (this.includeGallery) {
		this.copy('templates/default-' + this.viewEngine + '/views/gallery.' + this.viewEngine, 'templates/views/gallery.' + this.viewEngine);
	}

	if (this.includeEnquiries) {
		this.copy('templates/default-' + this.viewEngine + '/views/contact.' + this.viewEngine, 'templates/views/contact.' + this.viewEngine);
		if (this.includeEmail) {
			this.copy('templates/default-' + this.viewEngine + '/emails/enquiry-notification.' + this.viewEngine, 'templates/emails/enquiry-notification.' + this.viewEngine);
		}
	}

};

KeystoneGenerator.prototype.updates = function routes () {

	this.directory('updates');

};

KeystoneGenerator.prototype.files = function files () {
	this.directory('public/images');
	this.directory('public/js');
	this.copy('public/favicon.ico');
	this.directory('public/fonts', 'public/fonts/bootstrap');
	this.directory('public/styles-sass', 'public/styles');
};
