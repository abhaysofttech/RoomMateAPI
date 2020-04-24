'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const appVersionSchema = new Schema({
    version:{
        type: String,
        default: '0.0.1'
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})


module.exports = mongoose.model('appVersion', appVersionSchema);