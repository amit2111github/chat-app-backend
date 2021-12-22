var mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = mongoose;

const postSchema = new Schema(
	{
		description: {
			type: String,
			required: true,
		},
		postedBy: {
			type: ObjectId,
			ref: 'User',
			required: true,
		},
		links: [String],
		likes: ['User'],
		dislike: ['User'],
		totalLikes: {
			type: Number,
			default: 0,
		},
		totalDislike: {
			type: Number,
			default: 0,
		},
		comment: ['Comment'],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);

