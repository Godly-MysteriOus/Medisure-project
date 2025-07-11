const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbNames = require('../DB_Utils/DBNames');
const auditCols = require('./utilities/auditColumns');
const loginCredentailDB = new Schema({
    emailId:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    mobileNo : {
        type:String
    },
    roleId:{
        type:Number,
        enum:[1,2,3],
    },
    entityObject:{
        type:Schema.Types.ObjectId,
        ref:'entityModel',
    },
    entityModel:{
        type:String,
        enum:[dbNames.userRegistrationDB,dbNames.sellerRegistrationDB,dbNames.adminRegistrationDB],
    },
    audit : auditCols
});
loginCredentailDB.index({emailId:1});
module.exports = mongoose.model(dbNames.loginInfoDB,loginCredentailDB,dbNames.loginInfoDB);