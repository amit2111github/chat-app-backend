const express = require('express');
const router = express.Router();
const { getUserById, isAuthenticated, isSignedIn } = require('../controller/user');
const {
	sendMessage,
	getAllMessageOfUserOneToSecondUser,
	createContactForSecondUserIfnot,
	deleteMessage,
} = require('../controller/message');

router.param('userId', getUserById);
router.get(
	'/:userId/getAllMessage/:to',
	isSignedIn,
	isAuthenticated,
	createContactForSecondUserIfnot,
	getAllMessageOfUserOneToSecondUser
);
router.post('/send/:userId', isSignedIn, isAuthenticated, sendMessage);

router.delete('/delete/:userId/:messageId', isSignedIn, isAuthenticated, deleteMessage);

module.exports = router;
