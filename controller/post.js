const Post = require('../model/post');
const formidable = require('formidable');
const { cloudinary } = require('../config/cloudinary');
//creating post
exports.createPost = async (req, res) => {
	try {
		console.log('inside');
		let post_id = '';
		let post = '';
		let firstTime = true;
		const form = new formidable.IncomingForm();
		form.keepExtensions = true;
		form.parse(req, async (err, fields, files) => {
			if (err) {
				console.log(err);
				return res.status(400).json({ error: 'Oppps Something Went Wrong' });
			}
			const attchedFilesLength = Object.keys(files).length;
			let urlList = [];
			if (attchedFilesLength > 0) {
				Object.keys(files).forEach(async (key) => {
					const { path } = files[key]._writeStream;
					const { originalFilename } = files[key];
					const data = await cloudinary.uploader.upload(path, {
						resource_type: 'auto',
						public_id: 'chatAppData/' + originalFilename,
					});
					urlList.push(data.url);
					const { description } = fields;
					if (firstTime) {
						let newpost = new Post({ description, postedBy: req.auth._id, links: urlList });
						post = await newpost.save();
						post_id = post._id;
						firstTime = false;
					} else {
						post = await Post.findByIdAndUpdate(post_id, { $push: { links: data.url } });
					}
				});
				return res.json(post);
			} else {
				const { description } = fields;
				let post = new Post({ description, postedBy: req.auth._id, links: urlList });
				post = await post.save();
				return res.json(post);
			}
		});
	} catch (err) {
		console.log(err);
		res.status(400).json({ error: 'Failed to create post' });
	}
};
// get All post
exports.getAllPost = async (req, res) => {
	try {
		const skip = Number(req.query.skipcount || 0);
		// console.log(skip);
		const post = await Post.find({})
			.skip(skip)
			.populate('postedBy')
			.populate({
				path: 'comment',
				populate: {
					path: 'commentBy like',
					model: 'User',
				},
			})
			.limit(4);
		return res.json(post);
	} catch (err) {
		console.log(err);
		res.status(403).json({ error: 'Something went wrong' });
	}
};
// all post of one user
exports.getAllPostOfOneUser = async (req, res) => {
	try {
		const posts = await Post.find({ postedBy: req.auth._id });
		return res.json(posts);
	} catch (err) {
		return res.status(400).json({ error: 'Failed to get all Post' });
	}
};
// liking a post
exports.increaseLike = async (req, res) => {
	try {
		const { postId } = req.params;
		let post = await Post.findById(postId);
		let likes = [...post.likes];
		let alreadyLiked = false;
		likes.map((user) => {
			if (user == req.auth._id) alreadyLiked = true;
		});
		if (alreadyLiked) {
			return res.json(likes);
		}
		likes.push(req.auth._id);
		post = await Post.findByIdAndUpdate(postId, { $set: { likes: likes } });
		return res.json(likes);
	} catch (err) {
		res.status(400).json({ error: 'Failed to like this post' });
	}
};
// disliking a post
exports.increaseDislike = async (req, res) => {
	try {
		const { postId } = req.params;
		let post = await Post.findById(postId);

		let { dislike } = post;
		let alreadyDisliked = false;
		dislike.map((user) => {
			if (user == req.auth._id) alreadyDisliked = true;
		});
		if (alreadyDisliked) {
			return res.json(post);
		}
		dislike.push(req.auth._id);
		post = await Post.findByIdAndUpdate(postId, { $inc: { totalDislike: 1 }, $set: { dislike: dislike } });
		return res.json(post);
	} catch (err) {
		res.status(400).json({ error: 'Failed to dislike this post' });
	}
};
