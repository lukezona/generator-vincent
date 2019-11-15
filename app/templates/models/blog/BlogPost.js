/**
 * Created by luca on 06/03/2019.
 */
const keystone = require('keystone');
const idioTools = require('IdioTools');
const Types = keystone.Field.Types;

const utils = require(`${global.basePath}/lib/utilities/models`);
const stato_options = require(`${global.basePath}/lib/models/blog/post-status`);

const Post = new keystone.List('Post', {
	label: 'Blog Post',
	singular: 'Blog Post',
	plural: 'Blog Posts',
	path: 'blogPost',
	schema: { collection: 'blogPosts' },
	map: { name: 'titolo_i18n_it' },
	defaultSort: '-data',
	track: true,
});

Post.add({
	publishedDate: { type: Types.Date, initial: true, required: true, default: Date.now(), label: 'Data pubblicazione' },
	status: { type: Types.Select, numeric: true, options: stato_options, default: 0, initial: true, required: true, note: '', label: 'Stato' },
	author: { type: Types.Relationship, initial: true, ref: 'User', many: true, label: 'Autore' },
	category: { type: Types.Relationship, initial: true, ref: 'BlogCategory', label: 'Categoria' },
	image: {
		thumbnail: { type: Types.Relationship, ref: 'Image', initial: false, required: false, label: 'Copertina' },
		background: { type: Types.Relationship, ref: 'Image', initial: false, required: false, label: 'Sfondo' },
	},
});

// TODO Gestire un numero qualsiasi di paragrafi: usare un array e un contatore
const campi = {
	title: { type: String, initial: true, required: true, label: 'Titolo' },
	slug: { type: String, label: 'Slug' },
	preview: { type: Types.Html, wysiwyg: true, initial: false, required: false, label: 'Estratto' },
	titolo_paragrafo_1: { heading: 'Paragrafo 1' },
	paragraph_1: {
		text: { type: Types.Html, wysiwyg: true, initial: false, required: false, label: 'Testo' },
		image: { type: Types.Relationship, ref: 'Image', initial: false, required: false, label: 'Immagine' },
	},
	titolo_paragrafo_2: { heading: 'Paragrafo 2' },
	paragraph_2: {
		text: { type: Types.Html, wysiwyg: true, initial: false, required: false, label: 'Testo' },
		image: { type: Types.Relationship, ref: 'Image', initial: false, required: false, label: 'Immagine' },
	},
};

idioTools.seo.add(campi);

idioTools.i18n.models.create_fields(Post, campi, true);

/**
 *  Pre save
 *  =========
 *  Genero lo slug a partire dal titolo.
 *  Genero l'estratto automaticamente a partire dal primo paragrafo.
 */
const i18n_conf = idioTools.i18n.get_conf();
Post.schema.pre('save', function (next) {
	
	// Generazione slug
	i18n_conf.locales.forEach(l => { this[`slug_i18n_${l}`] = utils.slug_generator(this[`title_i18n_${l}`] || '') });
	
	//	Generazione estratti
	i18n_conf.locales.forEach(l => { this[`preview_i18n_${l}`] = utils.preview_generator(this[`paragraph_1_i18n_${l}`], 300) });
	
	next();
	
});

// idioTools.theme.set(Post, [{ field: 'immagine', prop: 'background-image' }]);
Post.defaultColumns = 'title_i18n_it, category, status, publishedDate';

Post.register();

const query_posts = require(`${global.basePath}/lib/queries/blog/post`);
idioTools.model_queries.init(Post);
Post.schema.statics.query.set('all_posts', query_posts.all);
Post.schema.statics.query.set('posts_per_category', query_posts.categorie);


