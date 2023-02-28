const cloudinary = require('cloudinary').v2
const config = require("../config_env.js");

cloudinary.config({
    cloud_name: config.CLOUDINARY_NAME,
    api_key:config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET,
})

module.exports = cloudinary