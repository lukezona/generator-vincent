const vincent = require('vincent');

/**
 *  Genero un array con tutti i post
 */
const all = vincent.list('Post').model.find({ status: 1 }).sort('-publishedDate').populate([{ path: 'author' }, { path: 'category', populate: { path: 'parent' } }]);

/**
 *  Genero un array con i post suddivisi per categoria
 *
 *  Il risultato è simile a questo:
 *  [
 *    {
 *      _id: *id della categoria*,
 *      post: [ { post_1 }, { post_2 }, ... , { post_n } ]
 *    }
 *  ]
 *
 */
const categorie = vincent.list('Post').model.aggregate(
	[
		{
			$lookup: {
				from: 'blogCategory',
				localField: 'category',
				foreignField: '_id',
				as: 'category'
			}
		},
		{
			$lookup: {
				from: 'blogCategory',
				localField: 'category.parent',
				foreignField: '_id',
				as: 'temp_parent'
			}
		},
		{
			$unwind: {
				path: '$temp_parent',
				preserveNullAndEmptyArrays: true
			}
		},
		{
			$addFields: {
				'category.parent': '$temp_parent'
			}
		},
		{
			$unwind: { path: '$category' }
		},
		{
			$lookup: {
				from: 'users',
				localField: 'author',
				foreignField: '_id',
				as: 'author'
			}
		},
		{
			$sort: {
				publishedDate: -1
			}
		},
		{
			$group: {
				_id: '$category',
				posts: { $push: '$$ROOT' }
			}
		},
		{
			$addFields: {
				_id: '$_id._id'
			}
		},
		{
			$project: {
				_id: 1,
				posts: 1,
				category: 1
			}
		}
	]
);

module.exports = {
	all: all,
	categorie: categorie
};
