/**
 * Created by luca on 06/03/2019.
 */
const keystone = require('keystone');
const idioTools = require('IdioTools');
const Types = keystone.Field.Types;

const utils = require(`${global.basePath}/lib/utilities/models`);

//const scss_utils = require(`${global.basePath}/lib/scss`);

const BlogCategory = new keystone.List('BlogCategory', {
	label: 'Blog Category',
	singular: 'Blog Category',
	plural: 'Blog Categories',
	path: 'blogCategory',
	schema: { collection: 'blogCategories' },
	map: { name: 'title_i18n_it' },
	defaultSort: 'order, isChild',
	track: true,
});

BlogCategory.add({
	order: { type: Number, initial: true, label: 'Ordine' },
	isChild: { type: Boolean, initial: true, label: 'È di secondo livello' },
	parent: { type: Types.Relationship, initial: true, dependsOn: { secondaria: true }, ref: 'BlogCategory', filters: { secondaria: false }, label: 'Categoria padre' },
	image: {
		thumbnail: { type: Types.Relationship, ref: 'Image', initial: false, required: false, label: 'Copertina' },
		background: { type: Types.Relationship, ref: 'Image', initial: false, required: false, label: 'Copertina' },
	},
	color: { type: Types.Color, initial: true },
});

/**
 * Campi internazionali
 */
const campi = {
	title: { type: String, initial: true, required: true, label: 'Titolo' },
	slug: { type: String, label: 'Slug' },
	description: { type: Types.Html, initial: true, wysiwyg: true, required: true, label: 'Testo' },
	mailchimp_list_id: { type: String, initial: false, required: false, label: 'ID Lista distribuzione MailChimp' },
};

idioTools.seo.add(campi);

idioTools.i18n.models.create_fields(BlogCategory, campi, true);

BlogCategory.defaultColumns = 'title_i18n_it, order, isChild, parent, colour';
BlogCategory.relationship({ path: 'post_collegati', ref: 'Post', refPath: 'categoria' });
BlogCategory.register();

// TODO Aggiungere metodo che modifica la categoria delle figlie se da primaria diventa secondaria?

let ex_padre = false;
let ex_figlie = [];

/**
 *  Pre save
 *  =========
 *  Creo lo slug se non è stato già creato
 */
BlogCategory.schema.pre('save', function (next) {
	
	// Generazione slug
	i18n_conf.locales.forEach(l => { this[`slug_i18n_${l}`] = utils.slug_generator(this[`title_i18n_${l}`] || '') });
	
	next();
	
});

/**
 *  Pre save
 *  =========
 *  Appiattimento categorie
 *  Se una categoria primaria (che ha delle sottocategorie) diventa secondaria allora tutte le sue "figlie" diventeranno al suo stesso livello
 */
BlogCategory.schema.pre('save', function (next) {
	
	const _this = this;
	const query_sottocategorie = keystone.list('BlogCategory').model.find({ padre: _this._id });
	
	/*
	 *  Se secondaria allora eseguo:
	 *  1 - Cerco le sue sottocategorie
	 *  2 - Se possiede delle sottocategorie procedo
	 *  3 - Per ogni categoria ottengo i suoi dati e la aggiorno modificandone il padre
	 */
	if (_this.isChild) {
		
		query_sottocategorie.exec(function (err, sottocategorie) {
			if (sottocategorie.length > 0) {
				ex_padre = true;
				ex_figlie = sottocategorie;
				sottocategorie.forEach(function (categoria) {
					keystone.list('BlogCategory').model.findOneAndUpdate({ _id: categoria._id }, { parent: _this.parent }, function (err) {
						if (err) console.error('models/blog/categorie - Appiattimento categorie, cambio padre: ', err); next(err);
						next();
					});
				});
			} else {
				next();
			}
		});
	} else {
		next();
	}
	
});

/**
 * 	Pre save
 * 	========
 * 	Imposto il colore del padre se è una categoria secondaria
 * 	Se non è presente imposto anche l'immagine in base a quella del padre
 * 	Se sto aggiornando una categoria appena diventata secondaria allora aggiorno tutte le sue ex sottocategorie
 */
BlogCategory.schema.pre('save', function (next) {
	
	const _this = this;
	let exec = false;
	const padre = keystone.list('BlogCategory').model.findById(_this.padre);
	
	if (_this.secondaria) {
		if (!_this.colore || !_this.immagine) exec = true;
		if (_this.immagine && !_this.immagine.secure_url) exec = true;
		if (_this.immagine && _this.immagine.secure_url === '') exec = true;
		if (ex_padre) exec = true;
		if (exec) {
			padre.exec(function (err, doc) {
				if (err) {
					console.log('models/blog/categorie - Errore pre-save: ', err);
					next(err);
				}
				if (ex_padre) {
					_this.colore = doc.colore;
					ex_figlie.forEach(function (categoria) {
						keystone.list('BlogCategory').model.findOneAndUpdate({ _id: categoria._id }, { colore: doc.colore }, function (err) {
							if (err) console.error('models/blog/categorie - Appiattimento categorie, cambio colore: ', err); next(err);
							next();
						});
					});
				}
				if (!_this.colore) _this.colore = doc.colore;
				if (_this.immagine && !_this.immagine.secure_url) _this.immagine = doc.immagine;
				if (_this.immagine && _this.immagine.secure_url === '') _this.immagine = doc.immagine;
				if (!_this.immagine) _this.immagine = doc.immagine;
				next();
			});
		} else {
			next();
		}
		
	} else {
		next();
	}
	
});

/**
 *  Post save
 *  =========
 *  Autocompilazione SCSS
 *  Aggiunge le variabili dei colori delle categorie
 */
idioTools.theme.set(BlogCategory, [{ field: 'color', prop: 'color' }]);

/**
 *  Imposto le query con cache
 */
const query_categorie = require(`${global.basePath}/lib/queries/blog/category`);
idioTools.model_queries.init(BlogCategory);
BlogCategory.schema.statics.query.set('group_by_subcategory', query_categorie);
BlogCategory.schema.statics.query.set('all_categories', keystone.list('BlogCategory').model.find({}).populate('parent').sort('order'));
