const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbNames = require('../DBNames');
const medicineInfo = require('./utilities/MedicineInfo');
const addressInfo = require('./utilities/AddressInfo');
const auditCols = require('./utilities/auditColumns');
const customer = new Schema({
    customerName:{
        type:String,
        required:true,
    },
    emailId:{
        type:Schema.Types.ObjectId,
        ref:dbNames.loginInfoDB,
        required:true,
    },
    mobileNumber:{
        type:Schema.Types.ObjectId,
        ref : dbNames.loginInfoDB,
        required:true,
    },
    password:{
        type:Schema.Types.ObjectId,
        ref:dbNames.loginInfoDB,
        required:true,
    },
    activeAddress:addressInfo,
    savedAddresses:{type:[addressInfo]},
    cart:{
        items:[medicineInfo],
        totalPrice:{type:Number},
    },
    resetToken:{type:String},
    resetTokenExpiration:{type:Date},
    audit : auditCols,
});

module.exports = mongoose.model(dbNames.userRegistrationDB,customer,dbNames.userRegistrationDB);