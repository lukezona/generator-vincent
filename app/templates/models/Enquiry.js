var vincent = require('vincent');
var Types = vincent.Field.Types;

/**
 * Enquiry Model
 * =============
 */

var Enquiry = new vincent.List('Enquiry', {
	nocreate: true,
	noedit: true,
});

Enquiry.add({
	name: { type: Types.Name, required: true },
	email: { type: Types.Email, required: true },
	phone: { type: String },
	enquiryType: { type: Types.Select, options: [
		{ value: 'message', label: 'Just leaving a message' },
		{ value: 'question', label: 'I\'ve got a question' },
		{ value: 'other', label: 'Something else...' },
	] },
	message: { type: Types.Markdown, required: true },
});
<% if (includeEmail) { %>
Enquiry.schema.pre('save', function (next) {
	this.wasNew = this.isNew;
	next();
});

Enquiry.schema.post('save', function () {
	if (this.wasNew) {
		this.sendNotificationEmail();
	}
});

Enquiry.schema.methods.sendNotificationEmail = function (callback) {
	if (typeof callback !== 'function') {
		callback = function (err) {
			if (err) {
				console.error('There was an error sending the notification email:', err);
			}
		};
	}

	if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
		console.log('Unable to send email - no mailgun credentials provided');
		return callback(new Error('could not find mailgun credentials'));
	}

	var enquiry = this;
	var brand = vincent.get('brand');

	vincent.list('<%= userModel %>').model.find().where('isAdmin', true).exec(function (err, admins) {
		if (err) return callback(err);
		new vincent.Email({
			templateName: 'enquiry-notification',
			transport: 'mailgun',
		}).send({
			to: admins,
			from: {
				name: '<%= projectName %>',
				email: 'contact@<%= utils.slug(projectName) %>.com',
			},
			subject: 'New Enquiry for <%= projectName %>',
			enquiry: enquiry,
			brand: brand,<% if (viewEngine === 'hbs') { %>
			layout: false,<% } %>
		}, callback);
	});
};
<% } %>
Enquiry.defaultSort = '-createdAt';
Enquiry.defaultColumns = 'name, email, enquiryType, createdAt';
Enquiry.register();
