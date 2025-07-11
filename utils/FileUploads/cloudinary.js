const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const config = require('../../config');
cloudinary.config({
    cloud_name:config.cloudinaryCloudName,
    api_key:config.cloudinaryApiKey,
    api_secret:config.cloudinaryApiSecret,
});

const upload = multer();
module.exports = {upload,cloudinary};