const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { signIn, signUp, signOut } = require('../controller/auth');

// singup post route

router.post(
	'/signup',
	[
		body('name').isLength({ min: 3 }).withMessage('Name should be at least 3 char long'),
		body('email').isEmail().withMessage('Email is required'),
		body('password').isLength({ min: 6 }).withMessage('Password should be at least 6 char long'),
	],
	signUp
);

// sigin post route
router.post(
	'/signin',
	[
		body('email').isEmail().withMessage('Email is required'),
		body('password').isLength({ min: 1 }).withMessage('Password is required'),
	],
	signIn
);

router.get('/signout', signOut);
module.exports = router;
