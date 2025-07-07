require('dotenv').config({path:'./credentials.env'});

module.exports = {
    devDBConnectionURI : process.env.devDBConnectionURI,
    prodDBConnectionURI : process.env.prodDBConnectionURI,
    sessionSecretKey:process.env.sessionSecretKey,
    hostURI : process.env.hostURI,
    emailAPIKey : process.env.emailAPI_KEY,
    cloudinaryCloudName:process.env.cloudinary_cloud_name,
    cloudinaryApiKey:process.env.cloudinary_api_key,
    cloudinaryApiSecret : process.env.cloudinary_api_secret,
};
