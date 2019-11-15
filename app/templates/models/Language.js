const vincent = require('vincent');
const Types = vincent.Field.Types;

/**
 * Language Model
 * ==========
 */
const Language = new vincent.List('Language', {
	label: 'Language',
	singular: 'Language',
	plural: 'Languages',
	path: 'language',
	schema: { collection: 'languages' },
	map: { name: 'name' },
	defaultSort: 'name',
	track: true,
});

Language.add({
	name: { type: String, required: true, initial: true, index: true },
	slug: { type: String, required: true, initial: true, index: true },
	path: { type: String, required: true, initial: true, index: true },
	active: { type: Boolean, label: 'Enabled', initial: true, index: true },
	default: { type: Boolean, label: 'Default', initial: true, index: true },
});

/**
 * Registration
 */
Language.defaultColumns = 'name, slug, path, active, default';
Language.register();
