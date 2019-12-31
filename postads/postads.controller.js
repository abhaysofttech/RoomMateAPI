const express = require('express');
const router = express.Router();

const postadsService = require('./postads.service');


//Routes
router.post('/newads', newAds); //own type /newads
router.get('/', getAds);
router.post('/', searchAds);
router.get('/:id', getAdsDetails);
router.get('/myads/:id', getMyAds);
router.get('/reqGender/:id', getAdsGender);
router.put('/updateamenities/:id', updateAmenities);
router.put('/updaterents/:id', updateRents);

function newAds(req,res,next){
    postadsService.newAds(req.body) //newAds - this name is service function from postads.service.js file
    .then(data => {
        console.log(res);
        res.json(data)})
    .catch(err => next(err));
}
function getAds(req,res,next){
    postadsService.getAds()
    .then(ads => res.json(ads))
    .catch(err => console.log(err));
}
function searchAds(req,res,next){
    postadsService.searchAds(req)
    .then(ads => res.json(ads))
    .catch(err => console.log(err));
}
function getAdsGender(req,res,next){
    postadsService.getAdsGender(req.params.id)
    .then(ads => res.json(ads))
    .catch(err => console.log(err));
}
function getMyAds(req,res,next){
    postadsService.getMyAds(req.params.id)
    .then(ads => res.json(ads))
    .catch(err => console.log(err));
}
function getAdsDetails(req,res,next){
    console.log(req);
    postadsService.getAdsDetails(req.params.id)
    .then(ads => res.json(ads))
    .catch(err => console.log(err));
}
function updateAmenities(req, res, next) {

    postadsService.updateAmenities(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}
function updateRents(req, res, next) {

    postadsService.updateRent(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

module.exports = router;