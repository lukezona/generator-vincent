const vincent = require('vincent');
const Image = vincent.list('Image');

exports = module.exports = function (req, res) {
	
	const view = new vincent.View(req, res);
	let locals = res.locals;
	
	// locals.section is used to set the currently selected item in the header navigation.
	locals.section = 'home';
	
	locals.data = {
		images: []
	};
	
	view.on('init', async (next) => {
		
		try {
			locals.data.images = await Image.schema.statics.query.get('all_images') || {};
			console.log('Images: ', locals.data.images);
			next();
		}
		catch (e) {
			console.error('routes/index - Error loading the images: ', e);
			return res.show_error(e);
		}
		
	});

	

	// Render the view
	view.render('index');
};
