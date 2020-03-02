const express = require('express');
const router = express.Router();
// const upload = require('./images.service');
//Calling model & Service **************************
const imagesService = require('./images.service');
const db = require('../_helpers/db');
const Image = db.Images;
//images routes *******************************
router.get('/', getAllImages);
// router.post('/create', create);
// router.get('/subcomplainname', getByComplainName);

// app.route('/log-entries/:log_entry_id/images')
// .get(controller.index)
// .post(upload.single("data").controller.create)

// app.route('/images/:id')
// .get(controller.show)
// .put(controller.update)
// .delete(controller.destroy)

// ****** Code for the Store Image **************
const fs = require('fs')
const path = require('path')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '..', 'public', 'uploads', `${Date.now()}`)
        fs.mkdirSync(uploadDir)
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage })

 // const upload = multer({ storage })

  //******** Code for the store Image End */

function getAllImages(req, res, next) {
    console.log("***** Get Images")
    imagesService.getAllImages()
        .then(Images => res.json(Images))
        .catch(err => console.log(err));
}
router.post('/', upload.single('data'), (req, res, next) => {
    // Create a new image model and fill the properties
    // let newImage = new Image();
    // newImage.filename = req.file.filename;
    // newImage.originalName = req.file.originalname;
    // newImage.desc = req.body.desc
    // newImage.save(err => {
    //     if (err) {
    //         return res.sendStatus(400);
    //     }
    //     res.status(201).send({ newImage });
    // });

    const path = require('path')
    const remove = path.join(__dirname,'..','public')
    const relPath = req.file.path.replace(remove, '')
    const newImage = new Image(req.body)
    newImage.logEntryId = req.params.log_entry_id
    newImage.path = relPath
    newImage.save(function (err, image) {
       if(err) res.send(err) 
       res.json(image)
    })
});
function create(req, res, next){
    upload.single("data").imagesService.create(req.body)
    .then(() => res.json({}))
    .catch(err => next(err));
}

module.exports = router; 