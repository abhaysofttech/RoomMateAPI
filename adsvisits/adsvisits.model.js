'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const AdsVisitsSchema = new Schema({
    adsId:{
      //  type: mongoose.Schema.ObjectId
      type:String
    },
    phonenumber:{type:Number, required:true},
    recentVisitDate:{
        type:Date,
        default:Date.now
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})
AdsVisitsSchema.virtual('images', {
    ref: 'Images',
    localField: '_id',
    foreignField: 'adsId'
})


module.exports = mongoose.model('AdsVisits', AdsVisitsSchema);