const express = require('express');
const router = express.Router();
const db = require('../_helpers/db');
const PostAds = db.PostAds; // PostAds is a schema name in _helpers/db file
const Image = db.Images;
const AdsVisits = db.AdsVisits;
const fs = require('fs')
const path = require('path')
const multer = require('multer')

const postadsService = require('./postads.service');


//Routes
router.post('/newads', newAds); //own type /newads
router.get('/', getAds);
router.get('/cities', getCities);
router.get('/areas/:id', getAreas);
router.post('/', searchAds);
// router.get('/:id', getAdsDetails);

// router.get('/:id/:param', getAdsDetailsVerify);
router.get('/:phonenumber/adsvisits', getRecentAdsVisit);
router.get('/myads/:id', getMyAds);
router.get('/reqGender/:id', getAdsGender);
router.put('/updateamenities/:id', updateAmenities);
router.put('/updaterents/:id', updateRents);
router.get('/images', getAllImages);
// ****** Code for the Store Image **************


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const { adsId } = req.body
        const uploadDir = path.join(__dirname, '..', 'public', 'uploads', `${adsId}`)
        // fs.mkdirSync(uploadDir)
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        // cb(null, file.originalname)
        cb(null, Date.now() + '-' + file.originalname);

    }
})
const upload = multer({
    storage: storage,
    // limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
})

function checkFileType(file, cb) {
    // Allow ext
    const filetypes = /jpeg|jpg|png|gif/;
    // check ext
    const extname = filetypes.test(path.extname
        (file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if(mimetype && extname){
        return cb(null,true);
    }
    else {
        cb('Error: Images Only!')
    }
}
// const upload = multer({ storage })

//******** Code for the store Image End */
router.get('/:id', (req, res) => {
    PostAds.findById(req.params.id)
    .populate('images')
    .populate('profileimages')
    .populate('adsvisits')
        .exec(function (err, PostAds) {
            if (err) res.send(err)
            res.json(PostAds)
        })
});

// router.post('/:id/images', upload.single('data'), (req, res, next) => {
router.post('/:id/images', upload.single('data'), (req, res, next) => {
    const path = require('path')
    const remove = path.join(__dirname, '..', 'public')
    const relPath = req.file.path.replace(remove, '')
    const newImage = new Image(req.body)
    newImage.adsId = req.params.id
    newImage.path = relPath
    newImage.save(function (err, image) {
        if (err) res.send(err)
        res.json(image)
    })
});
async function index(req) {
    console.log("Check All image ***************")
    return await PostAds.findById(req.params.id)
        .populate('images')
        .exec(function (err, PostAds) {

        })

}


function getRecentAdsVisit(req, res, next) {
    postadsService.getRecentAdsVisit(req.params.phonenumber)
        .then(ads => res.json(ads))
        .catch(err => console.log(err));
}

router.post('/:phonenumber/adsvisits', (req, res, next) => {
    const newadsvisits = new AdsVisits(req.body)
    newadsvisits.phonenumber = req.params.phonenumber;
    newadsvisits.adsId = req.body.adsID;
   newadsvisits.save(function (err, image) {
        if (err) res.send(err)
        res.json(image)
    })
});
function index(req, res) {
    postadsService.index(req)
        .then(Images => res.json(Images))
        .catch(err => console.log(err));
}

function getAllImages(req, res, next) {
    console.log("***** Get Images")
    postadsService.getAllImages()
        .then(Images => res.json(Images))
        .catch(err => console.log(err));
}

function getCities(req, res, next) {
    postadsService.getCities()
        .then(cities => res.json(cities))
        .catch(err => console.log(err));
}
function getAreas(req, res, next) {
    postadsService.getAreas(req.params.id)
        .then(areas => res.json(areas))
        .catch(err => console.log(err));
}
function newAds(req, res, next) {
    postadsService.newAds(req.body) //newAds - this name is service function from postads.service.js file
        .then(data => {
            console.log(res);
            res.json(data)
        })
        .catch(err => next(err));
}
function getAds(req, res, next) {
    postadsService.getAds()
        .then(ads => res.json(ads))
        .catch(err => console.log(err));
}
function searchAds(req, res, next) {
    postadsService.searchAds(req)
        .then(ads => res.json(ads))
        .catch(err => console.log(err));
}
function getAdsGender(req, res, next) {
    postadsService.getAdsGender(req.params.id)
        .then(ads => res.json(ads))
        .catch(err => console.log(err));
}
function getMyAds(req, res, next) {
    postadsService.getMyAds(req.params.id)
        .then(ads => res.json(ads))
        .catch(err => console.log(err));
}
function getAdsDetails(req, res, next) {
    console.log(req);
    postadsService.getAdsDetails(req.params.id)
        .then(ads => res.json(ads))
        .catch(err => console.log(err));
}
// function getAdsDetailsVerify(req,res,next){
//     console.log(req);
//     postadsService.getAdsDetailsVerify(req.params.id,req.params.param)
//     .catch(err => console.log(err));
// }
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