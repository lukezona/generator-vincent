const vincent = require('vincent');

/**
 *  Genero un array con le categorie e le sottocategorie
 *
 *  Il risultato è simile a questo:
 *  [
 *    {
 *      oggetto_categoria
 *      children: [ { categoria_secondaria_1 }, { categoria_secondaria_2 }, ... , { categoria_secondaria_n } ]
 *    }
 *  ]
 *
 */
module.exports = vincent.list('BlogCategory').model.aggregate(
	[
		{
			$match: {
				isChild: false
			}
		},
		{
			$lookup: {
				from: 'blogCategory',
				localField: '_id',
				foreignField: 'parent',
				as: 'children'
			}
		},
		{ $unwind: { path: '$children', preserveNullAndEmptyArrays: true } },
		{ $sort: { 'children.order': -1 } },
		{
			$group: {
				_id: '$$ROOT._id',
				parent: { $first: '$$ROOT' },
				childreno: { $addToSet: '$children' }
			}
		},
		{ $addFields: { 'parent.children': '$childreno' } },
		{ $replaceRoot: { newRoot: '$parent' } },
		{ $sort: { order: 1 } }
	]
);
