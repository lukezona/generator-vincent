const vincent = require('vincent');

exports = module.exports = function (req, res) {
	
	const view = new vincent.View(req, res);
	let locals = res.locals;

	// Set locals
	locals.section = 'gallery';

	// Load the galleries by sortOrder
	view.query('galleries', vincent.list('Gallery').model.find().sort('-publishedDate'));

	// Render the view
	view.render('gallery');

};
