const Message = require('../model/message');
const User = require('../model/user');
exports.sendMessage = async (req, res, next) => {
	try {
		let message = new Message(req.body);
		message = await message.save();
		return res.json(message);
	} catch (err) {
		console.log(err);
		return res.status(400).json({ err: 'Failed to send Message' });
	}
};
// get All message of a user to seconde user
exports.getAllMessageOfUserOneToSecondUser = async (req, res, next) => {
	const { to } = req.params;
	try {
		const messages = await Message.find({
			$or: [
				{ sender: req.auth._id, receiver: to },
				{ sender: to, receiver: req.auth._id },
			],
		}).sort({
			createdAt: 'asc',
		});
		return res.json(messages);
	} catch (err) {
		console.log(err);
		return res.status(400).json({ err: 'Failed to fetch result' });
	}
};

exports.createContactForSecondUserIfnot = async (req, res, next) => {
	try {
		const { to } = req.params;
		const secondUser = await User.findById(to);
		let contactList = secondUser.contacts;
		let alreadyHasInList = false;
		contactList.map((user) => {
			if (user._id.toString() == req.auth._id) alreadyHasInList = true;
		});
		if (alreadyHasInList) next();
		else {
			const updateduser = await User.findOneAndUpdate({ _id: to }, { $push: { contacts: req.profile } });
			next();
		}
	} catch (err) {
		console.log(err);
		return res.status(400).json('Failed to add for second user in contact list');
	}
};

exports.deleteMessage = async (req, res, next) => {
	try {
		const { messageId } = req.params;
		const newmessages = await Message.findByIdAndDelete(messageId);
		return res.json(newmessages);
	} catch (err) {
		console.log(err);
		return res.status(400).json({ error: 'Failed to delete Message' });
	}
};
