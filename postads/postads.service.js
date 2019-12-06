const config = require('../config.json');
const jwt = require('jsonwebtoken');
const db = require('../_helpers/db');
const PostAds = db.PostAds; // PostAds is a schema name in _helpers/db file

module.exports = {
    newAds,
    getAds
};

async function getAds() {
    console.log("Check ***************")
    return await PostAds.find().select('-hash');
}

async function newAds(adsDetail){
    const newads = new PostAds(adsDetail);

    await newads.save();
}


