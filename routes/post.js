const express = require('express');
const router = express.Router();
const { isSignedIn, isAuthenticated, getUserById } = require('../controller/user');
const {
	createPost,
	getAllPostOfOneUser,
	getAllPost,
	increaseLike,
	increaseDislike,
} = require('../controller/post');

router.param('userId', getUserById);
router.post('/create/:userId', isSignedIn, isAuthenticated, createPost);
// get all post
router.get('/getAll', getAllPost);

router.get('/getAll/:userId', isSignedIn, isAuthenticated, getAllPostOfOneUser);

// liking a post
router.put('/like/:userId/:postId', isSignedIn, isAuthenticated, increaseLike);

// Disliking a post
router.put('/dislike/:userId/:postId', isSignedIn, isAuthenticated, increaseDislike);

module.exports = router;
