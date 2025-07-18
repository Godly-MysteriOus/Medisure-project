const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DBNames = require('../DBNames');
const addressStructure = require('./utilities/AddressInfo');
const auditCols = require('./utilities/auditColumns');
const schedule = {
    day : {type:String,required:true},
    openingTime : {type:String,required:true},
    closingTime : {type:String,required:true},
}
const sellerDetail = new Schema({
    sellerDetails : {
        sellerName : {type: String,required: true},
        emailId : {type : Schema.Types.ObjectId,ref: DBNames.loginInfoDB,required : true},
        password : {type: Schema.Types.ObjectId,ref : DBNames.loginInfoDB,required: true},
        mobileNumber : {type:Schema.Types.ObjectId,ref:DBNames.loginInfoDB,required:true},
    },
    storeDetails:{
        storeName : {type: String,required: true},
        address : {type : addressStructure,required : true},
        logoDetails : {
            storeLogo : {type:String},
            storeLogoPID : {type:String},
            headerLogoForPDF : {type:String},
            headerLogoPID : {type:String},
            footerLogoForPDF : {type:String},
            footerLogoPID : {type:String},
        },
        workingDetails : [schedule],
    },
    storeRegistrationDetails:{
        drugLicenseNumber : {type: String,required: true,},
        gstNumber : {type:String,required : true},
        fssaiNumber : {type: String,required : true},
    },
    resetToken : {type:String},
    resetTokenExpirationType: {type:Date},
    audit : auditCols,
});

module.exports = mongoose.model(DBNames.sellerRegistrationDB,sellerDetail,DBNames.sellerRegistrationDB);