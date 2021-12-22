const express = require('express');
const router = express.Router();
const { getUserById, isSignedIn, isAuthenticated } = require('../controller/user');
const { likeComment, createComment, dislikeComment } = require('../controller/comment');

router.param('userId', getUserById);
router.post('/create/:userId/:postId', isSignedIn, isAuthenticated, createComment);
router.put('/like/:userId/:commentId', isSignedIn, isAuthenticated, likeComment);

module.exports = router;
