const mongoose = require('mongoose');

const PostAdsSchema = new mongoose.Schema({
    // postadsid: {type:String, required: true},
    adsStatus:{type:Boolean, default:true},
    phonenumber:{type:Number, required:true},
    username: {type:String, required: true},
    gender: {type:String, required: true},
    marital: {type:String, required: true},
    dob: {type:Date, required: true},
    userGender:{type:String, required: true},
    roomType: {type:String, required: true},
    apparttype: {type:String, default: ''},
    bhkType: {type:String, required: true},
    gatedSecurity: {type:String, default: ''},
    cooking: {type:String, required: true},
    vegNonveg: {type:String, required: true},
    bathroom: {type:String, required: true},
    balcony: {type:String, required: true},
    cupboard: {type:String, required: true},

    
    address: {type:String,  default: ''},
    shortaddress: {type:String,  default: ''},
    state: {type:String,  default: ''},
    city: {type:String,  default: ''},
    area: {type:String,  default: ''},
    pincode: {type:Number,  default: ''},
    landmark: {type:String,  default: ''},
    latitude: {type:Number,  default: ''},
    longitude: {type:Number,  default: ''},


    rentAmount: {type:Number, default: ''},
    depositAmount: {type:Number, default: ''},
    rentNegotiable: {type:Boolean, default:false},


    airConditioner: {type:Boolean, default:false},
    club: {type:Boolean, default:false},
    playground: {type:Boolean, default:false},
    gas: {type:Boolean, default:false},
    sewage: {type:Boolean, default:false},
    powerBackup: {type:Boolean, default:false},
    liftService: {type:Boolean, default:false},
    houseKeeper: {type:Boolean, default:false},
    security: {type:Boolean, default:false},
    carParking: {type:Boolean, default:false},
    twoWheelerParking: {type:Boolean, default:false},
    swimmingPool: {type:Boolean, default:false},
    internetConnectivity: {type:Boolean, default:false},
    postdate: {type:Date, default: Date.now}
   
});

PostAdsSchema.set('toJSON',{virtuals:true});
module.exports = mongoose.model('PostAds', PostAdsSchema);  // postads.service from this file PostAds name is taken(db.PostAds)