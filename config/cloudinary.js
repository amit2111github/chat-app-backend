var cloudinary = require('cloudinary').v2;
const { cloudinaryName, cloudinaryApiKey, cloudinaryApiSecret } = require('./var');
cloudinary.config({
	cloud_name: cloudinaryName,
	api_key: cloudinaryApiKey,
	api_secret: cloudinaryApiSecret,
	secure: true,
});
module.exports = { cloudinary };
