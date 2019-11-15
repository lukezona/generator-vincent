var vincent = require('vincent');
var Types = vincent.Field.Types;

/**
 * <%= userModel %> Model
 * ==========
 */
var <%= userModel %> = new vincent.List('<%= userModel %>');

<%= userModel %>.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Vincent', index: true },
});

// Provide access to Keystone
<%= userModel %>.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});

<% if (includeBlog) { %>
/**
 * Relationships
 */
<%= userModel %>.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });

<% } %>
/**
 * Registration
 */
<%= userModel %>.defaultColumns = 'name, email, isAdmin';
<%= userModel %>.register();
