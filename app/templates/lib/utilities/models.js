/**
 *  Slug generator
 *  ==============
 *
 *  Genera uno slug a partire dal testo passato
 *  TODO: Potenzialmente aggiungere opzioni per avere anche le date dei post?
 *
 *  @param source: String - Testo da rendere slug
 */
const slug_generator = function(source) {
	return source.toString().toLowerCase()
		.replace(/\s+/g, '-')           // Replace spaces with -
		.replace(/[^\w\-]+/g, '')       // Remove all non-word chars
		.replace(/\-\-+/g, '-')         // Replace multiple - with single -
		.replace(/^-+/, '')             // Trim - from start of text
		.replace(/-+$/, '');            // Trim - from end of text)
};

/**
 *  Preview generator
 *  ==============
 *
 *  Genera un estratto di un determinato numero di caratteri a partire dal testo passato
 *
 *  @param source: String - Sorgente del testo da troncare
 *  @param length: Number - Numero di caratteri dell'estratto
 */
const preview_generator = function (source, length) {
	
	if (source) {
		return keystone.utils.cropString(source, length, null, true);
	}
	
};

module.exports = {
	preview_generator: preview_generator,
	slug_generator: slug_generator,
};