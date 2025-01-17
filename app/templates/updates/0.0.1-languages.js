/**
 * This script automatically creates a default Admin user when an
 * empty database is used for the first time. You can use this
 * technique to insert data into any List you have defined.
 *
 * Alternatively, you can export a custom function for the update:
 * module.exports = function(done) { ... }
 */

exports.create = {
	Language: [
		{ 'name': 'English', 'slug': 'english', 'path': 'en', 'active': true, 'default': true },
		{ 'name': 'Italian', 'slug': 'italian', 'path': 'it', 'active': true, 'default': false },
		{ 'name': 'Spanish', 'slug': 'spanish', 'path': 'es', 'active': false, 'default': false },
		{ 'name': 'German', 'slug': 'german', 'path': 'de', 'active': false, 'default': false },
		{ 'name': 'French', 'slug': 'french', 'path': 'fr', 'active': false, 'default': false },
	],
};

/*

// This is the long-hand version of the functionality above:

var keystone = require('keystone');
var async = require('async');
var User = keystone.list('User');

var admins = [
	{ email: 'user@keystonejs.com', password: 'admin', name: { first: 'Admin', last: 'User' } }
];

function createAdmin (admin, done) {

	var newAdmin = new User.model(admin);

	newAdmin.isAdmin = true;
	newAdmin.save(function (err) {
		if (err) {
			console.error('Error adding admin ' + admin.email + ' to the database:');
			console.error(err);
		} else {
			console.log('Added admin ' + admin.email + ' to the database.');
		}
		done(err);
	});

}

exports = module.exports = function (done) {
	async.forEach(admins, createAdmin, done);
};

*/
