var jwt = require('jsonwebtoken');
const User = require('../model/user');
const { secret } = require('../config/var');
const { body, validationResult } = require('express-validator');

exports.signIn = async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		// Email is not in DB
		if (!user || user === null) return res.status(400).json({ error: 'Email not exist' });
		// Wrong password
		if (!user.authenticate(password)) return res.status(400).json({ error: 'Wrong Password' });
		user.encry_password = undefined;
		user.salt = undefined;
		const token = jwt.sign({ _id: user._id }, secret);
		res.cookie('token', token, { expire: new Date() + 9999 });
		return res.json({ user, token });
	} catch (err) {
		return res.status(400).json({ error: 'Failed to Signin' });
	}
};

exports.signUp = async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const user = new User(req.body);
		user.save((err, data) => {
			if (err) return res.status(400).json({ error: 'Failed to save user in DB' });
			return res.json({ _id: data._id, email: data.email, name: data.name });
		});
	} catch (err) {
		console.log(err);
		return res.json({ error: 'Failed to Signup' });
	}
};

exports.signOut = (req, res, next) => {
	res.clearCookie('token');
	return res.status(200).json({ msg: 'User Sign out successfully' });
};
