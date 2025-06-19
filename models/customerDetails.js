const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbNames = require('../DB_Utils/DBNames');
const medicineInfo = require('./utilities/MedicineInfo');
const addressInfo = require('./utilities/AddressInfo');
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
        type:Number,
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
    createdAt:{
        type:Date,
        required:true,
    },
    updatedAt:{
        type:Date,
    },
    isDeleted:{
        type:Boolean,
        required:true,
        default:false,
    }
});

module.exports = mongoose.model(dbNames.userRegistrationDB,customer,dbNames.userRegistrationDB);