const addressInfo = {
    state:{
        type:String,
    },
    city:{
        type:String,
    },
    pincode:{
        type:Number,
    },
    address:{
        type:String,
    },
    location:{
        type:{enum:["Point"],default:"Point",type:String},
        coordinates:{type:[Number]}
    },
};

module.exports = addressInfo;