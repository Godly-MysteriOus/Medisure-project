const config = require('../../config');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: config.backBlazeAccessKeyId,
  secretAccessKey: config.backBlazeSecretAccessKey,
  endpoint: config.backBlazeEndPoint,
  region: config.backBlazeRegion,
  signatureVersion: 'v4'
});

module.exports = s3;