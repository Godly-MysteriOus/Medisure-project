const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbNames = require('../../DB_Utils/DBNames');

const medicineInfo = {
    productId:{
        type:Schema.Types.ObjectId,
        ref:dbNames.centralMedicineDB,
        requried:true,
    },
    sellerId:{
        type:Schema.Types.ObjectId,
        ref:dbNames.sellerRegistrationDB,
        required:true,
    },
    qty:{
        type:Number,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
}

module.exports = medicineInfo;