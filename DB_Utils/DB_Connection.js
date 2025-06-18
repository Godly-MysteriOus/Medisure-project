const mongoose = require('mongoose');
const config = require('../config');
const path = require('path');
const projectRoot = path.resolve(__dirname, '../');
const filePathRelativeToRoot = path.relative(projectRoot, __filename);
const logger = require('../utils/Logger/logger')(filePathRelativeToRoot);
exports.dbURI = {
    devDBConnectionURI : config.devDBConnectionURI,
    prodDBConnectionURI: config.prodDBConnectionURI,
}
exports.DBConnection = (app,PORT) =>{
    mongoose.connect(exports.dbURI.devDBConnectionURI)
    .then(()=>app.listen(PORT))
    .then(()=>{
        logger.info('Connection Successfull');
    })
    .catch(err=>{
        logger.error('Error connecting to database',err);
    });
};
