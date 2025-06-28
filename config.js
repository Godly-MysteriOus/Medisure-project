require('dotenv').config({path:'./credentials.env'});

module.exports = {
    devDBConnectionURI : process.env.devDBConnectionURI,
    prodDBConnectionURI : process.env.prodDBConnectionURI,
    sessionSecretKey:process.env.sessionSecretKey,
    hostURI : process.env.hostURI,
    emailAPIKey : process.env.emailAPI_KEY,
    backBlazeEndPoint : process.env.backblazeEndPoint,
    backBlazeAccessKeyId : process.env.backblazeAccessKeyId,
    backBlazeSecretAccessKey : process.env.backblazeSecretAccessKey,
    backBlazeRegion : process.env.baxkblazeRegion,
};
