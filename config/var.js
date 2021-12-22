const path = require('path');
// import .env variables
require('dotenv-safe').config({
	path: path.join(__dirname, '../.env'),
	sample: path.join(__dirname, '../.env.example'),
});
module.exports = {
	secret: process.env.SECRET,
	mongoDbUrl: process.env.MONGO,
	cloudinaryName: process.env.CLOUDINARYNAME,
	cloudinaryApiKey: process.env.CLOUDINARYAPIKEY,
	cloudinaryApiSecret: process.env.CLOUDINARYAPISECRET,
};
