const vincent = require('vincent');

/**
 *  Images array with only the useful fields for the CMS
 */
const all = vincent.list('Image').model.aggregate(
	[
		{
			$lookup: {
				from: 'users',
				localField: 'createdBy',
				foreignField: '_id',
				as: 'createdBy'
			}
		},
		{
			$unwind: '$createdBy'
		},
		{
			$lookup: {
				from: 'users',
				localField: 'updatedBy',
				foreignField: '_id',
				as: 'updatedBy'
			}
		},
		{
			$unwind: '$updatedBy'
		},
		{
			$project: {
				//createdAt: 0,
				createdBy: {
					_id: 0,
					password: 0,
					email: 0,
					isAdmin: 0,
					__v: 0,
				},
				//updatedAt: 0,
				updatedBy: {
					_id: 0,
						password: 0,
						email: 0,
						isAdmin: 0,
						__v: 0,
				},
				__v: 0,
				sceltaLingua: 0,
				image: {
					public_id: 0,
					version: 0,
					signature: 0,
					//width: 0,
					//height: 0,
					//format: 0,
					//resource_type: 0
				}
			}
		}
	]
);

module.exports = {
	all: all
};