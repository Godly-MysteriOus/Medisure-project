const mongoose = require('mongoose');
const config = require('../config');
const path = require('path');
const fileName = path.basename(__filename);
const dirName = path.dirname(__filename).split(/medisure[\\/]/)[1];
const logger = require('../utils/Logger/logger')(`${dirName}\\${fileName}`);
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
