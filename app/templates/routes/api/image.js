const	vincent = require('vincent');
const Image = vincent.list('Image');
const array_utils = require(`${global.basePath}/lib/utilities/array`);

/**
 * GET
 *
 * Find all images
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.list = async (req, res) => {
	
	try {
		const images = await Image.schema.statics.query.get('all_images');
		if (!images || images.length === 0) return res.apiNotFound('images not found');
		return res.apiResponse({ data: images });
	}
	catch (e) {
		console.error('/api/images/list - Error loading images: ', e);
		res.apiError(e, { err: '/api/images/list - Error loading images' });
	}
	
};

/**
 * GET
 *
 * Find image by ID
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.getById = async (req, res) => {
	
	try {
		const images = await Image.schema.statics.query.get('all_images');
		const image = array_utils.findBy(images, '_id', req.params.id);
		if (!image) return res.apiNotFound('images not found');
		return res.apiResponse({ data: image });
	}
	catch (e) {
		console.error('/api/images/getById - Error loading image: ', e);
		res.apiError(e, { err: '/api/images/getById - Error loading image' });
	}
	
};

/**
 * POST
 *
 * Create an image
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.create = async (req, res) => {
	
	const item = new Image.model();
	const data = (req.method === 'POST') ? req.body : req.query;
	
	try {
		item.getUpdateHandler(req).process(data, function (err) {
			if (err) throw err;
			if (!item) return res.apiNotFound('/api/images/create - image not found');
			res.apiResponse({ data: item });
		});
	}
	catch (e) {
		console.error('/api/images/create - Error creating image', e);
		res.apiError(e, { err: '/api/images/create - Error creating image' });
	}
	
};

/**
 * UPDATE
 *
 * Update image by ID
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.update = async (req, res) => {
	
	const data = (req.method === 'POST') ? req.body : req.query;
	const _id = data._id;
	delete data._id;
	
	try {
		const images = await Image.schema.statics.query.get('all_images');
		const image = array_utils.findBy(images, '_id', _id);
		if (!image) return res.apiNotFound('/api/images/update - image not found');
		const updated_image = await image.getUpdateHandler(req).process(data);
		res.apiResponse({ data: updated_image });
	}
	catch (e) {
		console.error('/api/images/update - Error updating image', e);
		res.apiError(e, { err: '/api/images/update - Error updating image' });
	}
	
};

/**
 * DELETE
 *
 * Remove image by ID
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.remove = async (req, res) => {
	
	const data = (req.method === 'POST') ? req.body : req.query;
	
	try {
		const images = await Image.schema.statics.query.get('all_images');
		const image = array_utils.findBy(image, '_id', data.id);
		if (!image) return res.apiNotFound('/api/images/remove - image not found');
		await image.remove();
		const updated_image = await image.getUpdateHandler(req).process(data);
		res.apiResponse({ success: true, data: updated_image });
	}
	catch (e) {
		console.error('/api/images/remove - Error deleting image', e);
		res.apiError(e, { err: '/api/images/remove - Error deleting image' });
	}
	
};