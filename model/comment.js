var mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = mongoose;
const commentSchema = new Schema(
	{
		description: {
			type: String,
			required: true,
		},
		commentBy: {
			type: ObjectId,
			ref: 'User',
			required: true,
		},
		commentTo: {
			type: ObjectId,
			ref: 'Post',
			required: true,
		},
		like: [
			{
				type: ObjectId,
				ref: 'User',
			},
		],
	},
	{ timestamps: true }
);
module.exports = mongoose.model('Comment', commentSchema);
