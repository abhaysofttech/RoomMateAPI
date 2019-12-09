const express = require('express');
const router = express.Router();

const postadsService = require('./postads.service');


//Routes
router.post('/newads', newAds); //own type /newads
router.get('/', getAds);
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