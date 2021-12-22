const mongoose = require('mongoose');
const { ObjectId } = mongoose;

const { Schema } = mongoose;

const messageSchema = new Schema(
	{
		description: {
            type: String,
            required : true,
		},
		sender: {
			type: ObjectId,
            ref: 'User',
            required : true,
		},
		receiver: {
			type: ObjectId,
            ref: 'User',
            required : true,
        },
        isdeleted : {
            type : Boolean,
            default : false,
        }
	},
	{ timestamps: true }
);
module.exports = mongoose.model('Message', messageSchema);
