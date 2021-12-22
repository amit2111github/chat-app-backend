const Post = require('../model/post');
const Comment = require('../model/comment');

exports.createComment = async (req, res) => {
	try {
		const { postId } = req.params;
		req.body.commentBy = req.auth._id;
		req.body.commentTo = postId;
		let comment = new Comment(req.body);
		// comment created
		comment = await comment.save();
		const post = await Post.findByIdAndUpdate(postId, { $push: { comment: comment } });
		// returning post;
		return res.json(post);
	} catch (err) {
		return res.status(400).json('Failed to comment on this post');
	}
};

exports.likeComment = async (req, res) => {
	try {
		const { commentId } = req.params;
		const comment = await Comment.findById(commentId);
		let like = [...comment.like];
		let alreadyLiked = false;
		like.map((users) => {
			if (users == req.auth._id) alreadyLiked = true;
		});
		if (alreadyLiked) {
			return res.json(like);
		}
		like.push(req.auth._id);
		const data = await Comment.findByIdAndUpdate(commentId, { $push: { like: req.profile } });
		const post = await Post.findById(comment.commentTo);
		const arrayOfComment = post.comment;
		arrayOfComment.map((com) => {
			if (com._id.toString() == commentId) {
				com.like = like;
			}
		});
		await Post.findByIdAndUpdate(post._id, { $set: { comment: arrayOfComment } });
		return res.json(like);
	} catch (err) {
		console.log(err);
		return res.status(400).json({ error: 'Failed to like this comment' });
	}
};
