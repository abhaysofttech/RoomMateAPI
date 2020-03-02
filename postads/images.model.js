'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    adsId:{
        type: mongoose.Schema.ObjectId
    },
    path:{
        type: String
    },
    label: {
        type: String
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})


module.exports = mongoose.model('Images', ImageSchema);