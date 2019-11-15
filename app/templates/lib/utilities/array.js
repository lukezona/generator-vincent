module.exports = {
	array_exclude_id: array_exclude_id,
	array_include_id: array_include_id,
	findBy: findBy,
	paginate: paginate,
	prepend: prepend,
	sortByDate: sortByDate,
	sortByKey: sortByKey,
};

/**
 *  Filtro array per escludere elementi in base all'_id
 *  Se gli _id sono uguali l'elemento viene escluso
 *
 *  @param source - l'elemento dell'array da confrontare
 *  @returns {boolean} - true se deve essere incluso nel nuovo array, false se deve essere escluso
 */
function array_exclude_id (source) {
	return source._id.toString() !== this._id.toString();
}

/**
 *  Filtro array per includere elementi in base all'_id
 *  Se gli _id sono uguali l'elemento viene incluso
 *
 *  @param source - l'elemento dell'array da confrontare
 *  @returns {boolean} - true se deve essere incluso nel nuovo array, false se deve essere escluso
 */
function array_include_id (source) {
	if (!this._id) return false;
	return source._id.toString() === this._id.toString();
}

/**
 *  Funzione per paginare un array
 *
 *  @param source - l'array sorgente su cui effettuare la paginazione
 *  @param pagination - la configurazione per la paginazione: oggetto contenente la pagina corrente (page) e il numero di elementi per pagina (perPage)
 *  @returns {{content: [], currentPage: number, totalPages: number}} - restituisco l'array con i post per la pagina corrente, il numero della pagina corrente ed il numero totale di pagine (arrotondato per eccesso)
 */
function paginate (source, pagination) {
	let data = {
		content: source.slice(pagination.page * pagination.perPage - pagination.perPage, pagination.page * pagination.perPage),
		currentPage: pagination.page,
		totalPages: source.length % pagination.perPage === 0 ? source.length / pagination.perPage : Math.ceil(source.length / pagination.perPage),
	};
	return data;
}

/**
 *  Funzione per ordinare un array per data
 *
 *  @param a - campo da confrontare
 *  @param b - campo da confrontare
 */
function sortByDate (a, b) {
	a = new Date(a.data);
	b = new Date(b.data);
	return a > b ? -1 : a < b ? 1 : 0;
}

/**
 *  Funzione per ordinare un array per il valore di una chiave
 *
 *  @param array - l'array da ordinare
 *  @param key - la chiave su cui ordinare
 */
function sortByKey(array, key) {
	return array.sort(function(a, b) {
		let x = a[key];
		let y = b[key];
		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	});
}

function findBy (array, campo, valore) {
	return array.find(function (el) {
		if(campo === '_id') return el[campo].toString() === valore;
		return el[campo] === valore;
	});
}

function findAllBy (array, campo, valore) {
	let res = [];
	array.find(function (el) {
		if(campo === '_id') { el[campo].toString() === valore ? res.push(el) : null }
		else { el[campo] === valore ? res.push(el) : null; }
	});
	return res;
}

/**
 *  Funziona per aggiungere un elemento in cima all'array
 *  @param value - valore da inserire
 *  @param array - array in cui inserire il valore
 *  @returns {[]} - array con il valore in input all'inizio
 */
function prepend(value, array) {
	let newArray = array.slice();
	newArray.unshift(value);
	return newArray;
}