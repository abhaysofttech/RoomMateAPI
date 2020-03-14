'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ProfileImageSchema = new Schema({
    profileId:{
        type: mongoose.Schema.ObjectId
    },
    path:{
        type: String
    },
    userName: {
        type: String
    },
    mimeType:{
        type: String
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})


module.exports = mongoose.model('ProfileImages', ProfileImageSchema);