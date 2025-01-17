<% if (includeGuideComments) { %>/**
 * This file defines the email tests for your project.
 *
 * Each email test should provide the locals used to render the
 * email template for preview.
 *
 * Values can either be an object (for simple tests), or a
 * function that calls a callback(err, locals).
 *
 * Sample generated emails, based on the keys and methods below,
 * can be previewed at /keystone/test-email/{key}
 */

<% } %>const vincent = require('vincent');

module.exports = {
<% if (includeEnquiries) { %>
	/** New Enquiry Notifications */
	'enquiry-notification': function (req, res, callback) {<% if (includeGuideComments) { %>
		// To test enquiry notifications we create a dummy enquiry that
		// is not saved to the database, but passed to the template.
<% } %>
		const Enquiry = vincent.list('Enquiry');
		
		const newEnquiry = new Enquiry.model({
			name: { first: 'Test', last: 'User' },
			email: 'contact@<%= utils.slug(projectName) %>.com',
			phone: '+61 2 1234 5678',
			enquiryType: 'message',
			message: { md: 'Nice enquiry notification.' },
		});

		callback(null, {
			admin: 'Admin User',
			enquiry: newEnquiry,
			enquiry_url: '/keystone/enquiries/',
		});
	},
<% } %>
};
