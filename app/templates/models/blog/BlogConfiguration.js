/**
 * Created by luca on 04/07/2018.
 */
const keystone = require('keystone');
const idioTools = require('IdioTools');
const Types = keystone.Field.Types;

const BlogConfiguration = new keystone.List('BlogConfiguration', {
	label: 'Blog Configuration',
	singular: 'Blog Configuration',
	plural: 'Blog Configurations',
	path: 'blogConfiguration',
	schema: { collection: 'blogConfiguration' },
	map: { name: 'title' },
	defaultSort: 'title',
	nocreate: true,
	nodelete: true,
	track: true,
});

BlogConfiguration.add({
	title: { type: String },
	posts_per_page: { type: Number, label: 'Articoli per pagina', default: '5', note: 'Numero di articoli per pagina. Default: 5 post per pagina' },
	related_posts_per_page: { type: Number, label: 'Articoli correlati', default: 6, note: 'Numero di articoli correlati per post. Default 6 per post' },
	max_pages: { type: Number, label: 'Pagine da mostrare', default: 15, note: 'Numero di pagine da mostrare' }
});

const campi = {};

idioTools.seo.add(campi);

idioTools.i18n.models.create_fields(BlogConfiguration, campi, true);

BlogConfiguration.defaultColumns = 'title, posts_per_page';

//	Valori di default
BlogConfiguration.schema.pre('save', function (next) {
	
	if (!this.paginazione || isNaN(this.paginazione)) {
		this.paginazione = BlogConfiguration.fields.paginazione.options.default;
	}
	
	if (!this.correlati || isNaN(this.correlati)) {
		this.correlati = BlogConfiguration.fields.correlati.options.default;
	}
	
	next();
});

BlogConfiguration.register();

idioTools.model_queries.init(BlogConfiguration);
BlogConfiguration.schema.statics.query.set('config', keystone.list('BlogConfiguration').model.findOne());
