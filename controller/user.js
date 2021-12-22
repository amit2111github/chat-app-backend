const User = require('../model/user');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
const nodemailer = require('nodemailer');
const { secret } = require('../config/var');

// get User from id
exports.getUserById = async (req, res, next, id) => {
	try {
		const user = await User.findById(id);
		req.profile = user;
		next();
	} catch (err) {
		return res.status(400).json({ error: 'No Such user exist form give Id' });
	}
};
const sendMail = async (email, link, name) => {
	try {
		var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'amit.dev.nit@gmail.com',
				pass: 'amitmandal@2111',
			},
		});
		var info = {
			from: '"Eflyer 👻" <amit.dev.nit@gmail.com>',
			to: email,
			subject: 'Link for password reset',
			html: `<h3>Hi ${name},</h3> <p>As you have requested for reset password instructions, here they are, please follow the URL:</p2> </br> <a href  = ${link}>Reset Password</a>`,
		};
		const response = await transporter.sendMail(info);
		return response;
	} catch (err) {
		console.log(err);
		return err;
	}
};
//foret paassword
exports.forgetPassword = async (req, res) => {
	try {
		const { email } = req.body;
		const user = await User.findOne({ email: email });
		if (!user) {
			return res.status(400).json({ error: 'No such mail id exists' });
		}
		var token = jwt.sign({ _id: user._id }, secret, { expiresIn: '24h' });
		const data = await sendMail(email, `http://localhost:3001/user/password-reset?token=${token}`, user.name);
		user.forget_password_token = token;
		await user.save();
		return res.json(token);
	} catch (err) {
		console.log(err);
		return res.status(400).json({ error: 'Failed to Reset Password' });
	}
};

// creating contact list
exports.createContact = async (req, res, next) => {
	try {
		const newuser = await User.findOne({ email: req.body.email });
		if (!newuser) return res.json({ error: 'No such user exist' });
		let alreadyInList = false;
		req.profile.contacts.map((user) => {
			if (user._id.toString() == newuser._id) alreadyInList = true;
		});
		if (alreadyInList) return res.json({ error: 'User Already exist in Contact list' });

		const updateduser = await User.findOneAndUpdate({ _id: req.auth._id }, { $push: { contacts: newuser } });
		return res.json(updateduser);
	} catch (err) {
		console.log(err);
		return res.json({ error: 'Failed to add user in contact list' });
	}
};
exports.resetPassword = async (req, res) => {
	try {
		const { token } = req.query;
		const data = jwt.verify(token, secret, {
			expiresIn: '24h',
		});
		const seconds = data.exp - new Date().getTime() / 1000;
		if (seconds < 0) {
			return res.status(400).json({ error: 'Link expired' });
		}
		const user = await User.findById(data._id);
		if (user.forget_password_token !== token) {
			return res.status(400).json({ error: 'Link expired' });
		}
		return res.status(200).json(data);
	} catch (err) {
		console.log(err);
		return res.status(400).json({ error: 'Link has been compromised' });
	}
};

exports.updatePassword = async (req, res) => {
	try {
		const { token, password } = req.body;
		const data = jwt.verify(token, secret, {
			expiresIn: '24h',
		});
		const userId = data._id;
		let user = await User.findById(userId);
		user.encry_password = user.securePassword(password);
		user.forget_password_token = '';
		user = await user.save();
		return res.json(user);
	} catch (err) {
		console.log(err);
		return res.json({ error: 'Faile to update password' });
	}
};
// All contacts list
exports.getAllContact = async (req, res, next) => {
	try {
		const user = await User.findById(req.auth._id).populate('contacts');
		return res.json(user.contacts);
	} catch (err) {
		console.log(err);
		res.status(400).json({ error: 'Failed to get All Contacts' });
	}
};
// isSignedIn
exports.isSignedIn = expressJwt({
	secret,
	userProperty: 'auth',
	algorithms: ['HS256'],
});

// removing contactItem
exports.removeContactPersonFromContacList = async (req, res, next) => {
	try {
		const userToRemove = await User.findOne({ email: req.body.email });
		let contactList = req.profile.contacts;
		let newContactList = [];
		contactList.map((item) => {
			if (item._id.toString() != userToRemove._id) newContactList.push(item);
		});
		const updateduser = await User.findOneAndUpdate({ _id: req.auth._id }, { $set: { contacts: newContactList } });
		return res.json(updateduser);
	} catch (err) {
		console.log(err);
		return res.status(400).json({ error: 'Failed to remove person from list' });
	}
};
// is isAuthenticated
exports.isAuthenticated = (req, res, next) => {
	let checker = req.auth && req.profile && req.profile._id == req.auth._id;
	if (!checker) {
		return res.status(403).json({ error: 'Authorization failed' });
	}
	next();
};
