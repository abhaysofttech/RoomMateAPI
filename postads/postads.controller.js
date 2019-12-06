const express = require('express');
const router = express.Router();

const postadsService = require('./postads.service');


//Routes
router.post('/newads', newAds); //own type /newads
router.get('/', getAds);

function newAds(req,res,next){
    postadsService.newAds(req.body) //newAds - this name is service function from postads.service.js file
    .then(() => res.json({}))
    .catch(err => next(err));
}
function getAds(req,res,next){
    postadsService.getAds()
    .then(ads => res.json(ads))
    .catch(err => console.log(err));
}

module.exports = router;