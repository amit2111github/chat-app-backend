var express = require('express');
var router = express.Router();
const {
	getUserById,
	isSignedIn,
	isAuthenticated,
	createContact,
	getAllContact,
	forgetPassword,
	resetPassword,
	updatePassword,
	removeContactPersonFromContacList,
} = require('../controller/user');

// userId param
router.param('userId', getUserById);

router.get('/getUser/:userId', (req, res) => {
	return res.json(req.profile);
});
// adding newuser in contact list

router.put('/:userId/create-contact', isSignedIn, isAuthenticated, createContact);
router.put('/forget-password', forgetPassword);
router.post('/update-password', updatePassword);
router.post('/reset-password', resetPassword);
router.get('/:userId/getAllContact', isSignedIn, isAuthenticated, getAllContact);
router.put('/:userId/remove-contact', isSignedIn, isAuthenticated, removeContactPersonFromContacList);

module.exports = router;
