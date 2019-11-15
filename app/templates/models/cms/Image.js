/**
 * Created by luca on 06/03/2019.
 */
const vincent = require('vincent');
const Types = vincent.Field.Types;
/*const idioTools = require('IdioTools');
const idio_conf = idioTools.config;
const i18n_conf = idioTools.i18n.get_conf();
const utils = require(`${global.basePath}/lib/utilities/models`);*/

const Image = new vincent.List('Image', {
	label: 'Image',
	singular: 'Image',
	plural: 'Images',
	path: 'image',
	schema: { collection: 'images' },
	map: { name: 'i18n.title' },
	defaultSort: 'i18n.title',
	track: true,
});

Image.add({
	// TODO: Change Cloudinary folder based on settings
	image: { type: Types.CloudinaryImage, filenameAsPublicID: true, folder: `test/images`, initial: true, required: true, label: 'Image' },
	i18n: {
		title: { type: String, initial: true, required: true, label: 'Title' },
		alt_text: { type: String, initial: true, required: false, label: 'Alternative text' },
		caption: { type: String, initial: true, required: true, label: 'Caption' },
		description: { type: Types.Textarea, initial: true, label: 'SEO Description' },
	}
});

Image.defaultColumns = 'i18n.title';

Image.register();

const query_images = require(`${global.basePath}/lib/queries/cms/image`);
Image.schema.statics.query.set('all_images', query_images.all);

// idioTools.model_queries.init(Image);
// const query_images = require(`${global.basePath}/lib/queries/cms/image`);
// Image.schema.statics.query.set('all_images', query_images.all);
