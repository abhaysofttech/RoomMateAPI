const express = require('express');
const router = express.Router();

const userService = require('./users.service');
// call user modal
const db = require('../_helpers/db');
const User = db.User;
const ProfileImages = db.ProfileImages;
const fs = require('fs')
const path = require('path')
const multer = require('multer')
//routes
router.get('/', getAll);
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/current', getCurrent);
// router.get('/userid/:id', getById);
router.get('/:username', getByUsername);
router.delete('/:id', _delete);
router.put('/update/:id', update);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const { adsId } = req.body
        const uploadDir = path.join(__dirname, '..', 'public', 'profileImage')
        // fs.mkdirSync(uploadDir)
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        var ext = path.extname(file.originalname);
        // cb(null, file.originalname);
        cb(null, req.params.id + ext);

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

    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb('Error: Images Only!')
    }
}

// router.post('/:id/images', upload.single('data'), (req, res, next) => {
router.post('/:id/profileimages', upload.single('data'), (req, res, next) => {
    const path = require('path')
    const remove = path.join(__dirname, '..', 'public')
    const relPath = req.file.path.replace(remove, '')
    const newProfileImage = new ProfileImages(req.body)
    newProfileImage.path = relPath
    var ext = path.extname(req.file.originalname);
    newProfileImage.mimeType = ext

    newProfileImage.save(function (err, image) {
        if (err) res.send(err)
        res.json(image)
    })
});

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => console.log(err));
}

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or Password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    const useridstring = (req.body.firstname.slice(0, 3) + req.body.lastname.slice(0, 3)).toLowerCase();
    req.body.userid = useridstring;
    userService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));

    // let errors = [];
    // //check required field
    // if(!username || !email || !password || !conformPassword){
    //     errors.push({msg:'Please fill all field'});
    // }

    // //check password match
    // if(password !== conformPassword){
    //     errors.push({msg:'Password do not match'});
    // }

    // if(errors.length > 0){
    //     console.log("There is a error for registration \"" + errors[0].msg+"\"")
    // }
    // else{
    //     userService.create(req.body)
    //     .then(() => res.json({}))
    //     .catch(err => next(err));
    // }

}


function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    // userService.getById(req.params.id)
    //     .then(user => {console.log(user),user ? res.json(user) : res.sendStatus(404)})
    //     .catch(err => next(err));

}
router.get('/userid/:id', (req, res) => {
    User.findById(req.params.id)
        .populate('request')
        // .populate('images')
        .populate('profileimages')
        // .populate('adsvisits')
        .exec(
            function (err, user) {
                if (user) {
                    response = {
                        username: user.firstname + user.lastname,
                        userid: user.id,
                        phonenumber: user.phonenumber,
                        profileimages: user.profileimages,
                        request: user.request
                    };
                    res.json(response)
                }
            }
        )
});
router.get('/request/:id/:type?', (req, res) => {
    User.findById(req.params.id)
        .populate('request')
        .populate('profileimages')
        .exec(
            function (err, user) {
                if (user) {
                    let requestData;
                    if (req.params.type != undefined) {
                        requestData = user.request.filter(function (data) { if (data.status == req.params.type) return data })
                    }
                    else {
                        requestData = user.request
                    }
                    response = {
                         requestData: requestData
                    };
                    res.json(response)
                }
            }
        )
});
function getByUsername(req, res, next) {
    userService.getByUsername(req.params.username)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

module.exports = router;