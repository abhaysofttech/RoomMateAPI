const config = require('../config.json');
const jwt = require('jsonwebtoken');
const db = require('../_helpers/db');
const AdsVisits = db.AdsVisits; // PostAds is a schema name in _helpers/db file


module.exports = {
    newAdsVisits
}

function newAdsVisits(adsDetail,phonenumber) {
    const newadsvisits = new AdsVisits(adsDetail);
     newadsvisits.adsId = phonenumber
    newadsvisits.phonenumber = phonenumber
    return newadsvisits.save().then(function (ads) {
        const { _id } = ads;
        console.log(`New room id: ${_id}`);

        return _id;
    }).catch(function (err) {
        return false;
    });
}

