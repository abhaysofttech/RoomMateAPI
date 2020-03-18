'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const RequestSchema = new Schema({
    userId:{
        type: mongoose.Schema.ObjectId
    },
    adsId:{
        type: mongoose.Schema.ObjectId
    },
    adsOwnerId:{
        type: mongoose.Schema.ObjectId
    },
    type: {
        type: String
    },
    status:{
        type:String,
        default: "Active"
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})
RequestSchema.virtual('User', {
    ref: 'User',
    localField: '_id',
    foreignField: '_id'
});



module.exports = mongoose.model('Request', RequestSchema);