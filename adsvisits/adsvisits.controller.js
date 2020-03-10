const express = require('express');
const router = express.Router();
const db = require('../_helpers/db');
const AdsVisits = db.AdsVisits; // AdsVisits is a schema name in _helpers/db file
const adsVisitsService = require('./adsvisits.service');


//Routes
router.post('/:phonenumber', newAdsVisits); //own type /newadsvisits
//router.get('/', getAdsVisits);

// router.get('/:id', getAdsDetails);

function newAdsVisits(req, res, next) {
    // adsVisitsService.newAdsVisits(req.body,req.params.phonenumber) //newAds - this name is service function from postads.service.js file
    //     .then(data => {
    //         console.log(res);
    //         res.json(data)
    //     })
    //     .catch(err => next(err));

    const newadsvisits = new AdsVisits(req.body);
   newadsvisits.phonenumber = req.params.phonenumber;
   newadsvisits.adsId = req.body.adsID;

   newadsvisits.save().then(function (ads) {
       const { _id } = ads;
       console.log(`New room id: ${_id}`);

    //    return _id;
   })
}
module.exports = router;