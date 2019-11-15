module.exports = [
	{ label: 'Superuser', value: 'superuser', enum: 0 },  // Può fare tutto, l'unico che può accedere a Keystone
	{ label: 'Administrator', value: 'admin', enum: 1 },  // Può fare quasi tutto ma non modificare i permessi di un Superuser o accedere a Keystone
	{ label: 'Editor', value: 'editor', enum: 2 },        // Può gestire i contenuti ma non gli utenti o le configurazioni avanzate del sito
	{ label: 'Author', value: 'author', enum: 3 },        // Può solo pubblicare articoli
];