const mongoose = require('mongoose');

const PostAdsSchema = new mongoose.Schema({
    // postadsid: {type:String, required: true},
    roomType: {type:String, required: true},
    apparttype: {type:String, default: ''},
    bhkType: {type:String, required: true},
    gatedSecurity: {type:String, default: ''},
    vegNonveg: {type:String, required: true},
    bathroom: {type:String, required: true},
    balcony: {type:String, required: true},
    cupboard: {type:String, required: true},
});

PostAdsSchema.set('toJSON',{virtuals:true});
module.exports = mongoose.model('PostAds', PostAdsSchema);  // postads.service from this file PostAds name is taken(db.PostAds)