const addressInfo = {
    state:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    pincode:{
        type:Number,
        required:true,
    },
    address:{
        required:true,
        type:String,
    },
    location:{
        type:{enum:["Point"],default:"Point",type:required},
        coordinates:{type:[Number]}
    },
};

module.exports = addressInfo;