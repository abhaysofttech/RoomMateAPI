const express = require('express');
const router = express.Router();
const requesthttp = require('request');
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
router.post('/authenticateByOTP', authenticateByOTP);

router.get('/appversions', getappVersion);

router.post('/authenticatebyemail', authenticatebyemail);
router.post('/register', register);
router.get('/current', getCurrent);
// router.get('/userid/:id', getById);
router.get('/:username', getByUsername);
router.delete('/:id', _delete);
router.put('/update/:id', update);
// router.get('/phonenumber/:phonenumber', phonenumber);
router.post('/newappversion', newappversion);


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

function getappVersion(req, res, next) {
    userService.getappVersion()
        .then(version => res.json(version))
        .catch(err => console.log(err));
}
function newappversion(req, res, next) {
    userService.newappversion(req.body)
        .then(version => res.json(version))
        .catch(err => console.log(err));
}
function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => console.log(err));
}

function phonenumber(req, res, next) {
    userService.phonenumber(req.params.phonenumber)
        .then(phonenumber => res.json(phonenumber))
        .catch(err => console.log(err));
    // .then(user => {
    //     user ? res.json(user) : res.sendStatus(404)
    // })
    // .catch(err => next(err));
}
router.get('/phonenumber/:phonenumber', (req, res) => {
    User.findOne({ phonenumber: req.params.phonenumber })
        .populate('profileimages')
        .exec(
            function (err, user) {
                if (user) {
                    if (!user.mobileverify) {
                        resData = {
                            user: {
                                username: user.firstname + " " + user.lastname,
                                userid: user.id,
                                mobileverify: user.mobileverify,
                                emailverify: user.emailverify
                            }
                        };
                        res.json(resData)
                    }
                    else {
                        // requesthttp(`https://2factor.in/API/V1/279349ff-6a03-11ea-9fa5-0200cd936041/SMS/${req.params.phonenumber}/AUTOGEN/RoomMate+OTP`, function (error, response, body) {

                        //     if (!error && response.statusCode == 200) {
                        resData = {
                            user: {
                                username: user.firstname + " " + user.lastname,
                                userid: user.id,
                                mobileverify: user.mobileverify,
                                emailverify: user.emailverify,
                                // otp: JSON.parse(response.body)
                            }
                        };
                        res.json(resData)
                        //     }
                        //     else {
                        //         resData = {
                        //             user: {
                        //                 username: user.firstname + " " + user.lastname,
                        //                 userid: user.id
                        //             }
                        //         };
                        //         res.json(resData)
                        //     }
                        // });
                    }
                }
                else {
                    res.json("No record")
                }

            }
        )
});
router.get('/phonenumber/otp/:phonenumber', (req, res) => {
    User.findOne({ phonenumber: req.params.phonenumber })
        .populate('profileimages')
        .exec(
            function (err, user) {
                if (user) {
                    requesthttp(`https://2factor.in/API/V1/279349ff-6a03-11ea-9fa5-0200cd936042/SMS/${req.params.phonenumber}/AUTOGEN/RoomMate+OTP`, function (error, response, body) {

                        if (!error && response.statusCode == 200) {
                            resData = {
                                user: {
                                    username: user.firstname + " " + user.lastname,
                                    userid: user.id,
                                    mobileverify: user.mobileverify,
                                    emailverify: user.emailverify,
                                    otp: JSON.parse(response.body)
                                }
                            };
                            res.json(resData)
                        }
                        else {
                           
                            res.status(400).json({ message: error, statusCode: response.statusCode })

                        }
                    });
                }
                else {
                    res.json("No record")
                }

            }
        )
});
router.get('/emailcheck/:email', (req, res) => {
    User.findOne({ email: req.params.email })
        .populate('profileimages')
        .exec(
            function (err, user) {
                if (user) {
                    response = {
                        user: {
                            username: user.firstname + " " + user.lastname,
                            userid: user.id
                        }
                    };
                    res.json(response)
                }
                else {
                    res.json("No record")
                }

            }
        )
});
router.post('/verifyOTP', (req, res) => {
    requesthttp(`https://2factor.in/API/V1/279349ff-6a03-11ea-9fa5-0200cd936042/SMS/VERIFY/${req.body.session_id}/${req.body.otp}`, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            async function updatePhoneVerify() {
                const user = await User.findOne({ phonenumber: req.body.phonenumber }).populate('profileimages')
                user.mobileverify = true;
                if (!user) throw 'Phone number not register with user';
                Object.assign(user, user);
                await user.save();
                return user;
            }
            updatePhoneVerify().then(user => {
                userService.authenticateByOTP(user.phonenumber).then(token => {
                    respData = {
                        id: user.id,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        userid: user.userid,
                        userGender: user.userGender,
                        dob: user.dob,
                        phonenumber: user.phonenumber,
                        email: user.email,
                        mobileverify: user.mobileverify,
                        emailverify: user.emailverify,
                        userType: user.userType,
                        userCity: user.userCity,
                        registerData: user.date,
                        profileimages: user.profileimages,
                        request: user.request
                    }
                    token = {
                        token: token.token
                    }
                    statusCode = {
                        statusCode: response.statusCode
                    }
                    res.json([respData, token, statusCode]);
                })
                // res.json({ statusCode: response.statusCode })
            })
        }
        else {
            // res.json({ message: 'Phonenumber or Password is incorrect' , statusCode: response.statusCode })
            res.status(400).json({ message: 'OTP is incorrect', statusCode: response.statusCode })
        }
    });
});
router.post('/emailVerifyOTP', (req, res) => {
    async function updateEmailVerify() {
        const user = await User.findOne({ email: req.body.email })

        if (!user) throw 'Email verify fail, contact to roommatedekho@gmail.com';
        if (user.emailverifyCode == parseInt(req.body.otp)) {
            user.emailverify = true;
        }
        else {
            throw 'Email verify otp is not match';
        }
        Object.assign(user, user);
        await user.save();
        return user;
    }
    updateEmailVerify().then(data => {
        res.status(200).json({ message: 'Email Verified Successfully', statusCode: 200 })

    })
        .catch(err => {
            console.log(err);
            res.status(400).json({ message: err, statusCode: 400 })

        });
});
function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => {
            if (user) {
                response = {
                    id: user.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    userid: user.userid,
                    userGender: user.userGender,
                    dob: user.dob,
                    phonenumber: user.phonenumber,
                    email: user.email,
                    mobileverify: user.mobileverify,
                    emailverify: user.emailverify,
                    userType: user.userType,
                    userCity: user.userCity,
                    registerData: user.date,
                    profileimages: user.profileimages,
                    request: user.request
                }
                token = {
                    token: user.token
                };
                res.json([response, token]);
            }
            else {
                res.status(400).json({ message: 'Phonenumber or Password is incorrect' })
            }
            // user ? res.json(user) : res.status(400).json({ message: 'Phonenumber or Password is incorrect' })
        })
        .catch(err => next(err));
}
function authenticateByOTP(req, res, next) {
    userService.authenticateByOTP(req.body)
        .then(user => {
            if (user) {
                response = {
                    id: user.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    userid: user.userid,
                    userGender: user.userGender,
                    dob: user.dob,
                    phonenumber: user.phonenumber,
                    email: user.email,
                    mobileverify: user.mobileverify,
                    emailverify: user.emailverify,
                    userType: user.userType,
                    userCity: user.userCity,
                    registerData: user.date,
                    profileimages: user.profileimages,
                    request: user.request
                }
                token = {
                    token: user.token
                };
                res.json([response, token]);
            }
            else {
                res.status(400).json({ message: 'Phonenumber or Password is incorrect' })
            }
            // user ? res.json(user) : res.status(400).json({ message: 'Phonenumber or Password is incorrect' })
        })
        .catch(err => next(err));
}
function authenticatebyemail(req, res, next) {
    userService.authenticatebyemail(req.body)
        .then(user => {
            if (user) {
                response = {
                    id: user.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    userid: user.userid,
                    userGender: user.userGender,
                    dob: user.dob,
                    phonenumber: user.phonenumber,
                    email: user.email,
                    mobileverify: user.mobileverify,
                    emailverify: user.emailverify,
                    userType: user.userType,
                    userCity: user.userCity,
                    registerData: user.date,
                    profileimages: user.profileimages,
                    request: user.request
                }
                token = {
                    token: user.token
                };
                res.json([response, token]);
            }
            else {
                res.status(400).json({ message: 'Phonenumber or Password is incorrect' })
            }
            // user ? res.json(user) : res.status(400).json({ message: 'Phonenumber or Password is incorrect' })
        })
        .catch(err => next(err));
}


function register(req, res, next) {
    const useridstring = (req.body.firstname.slice(0, 3) + req.body.lastname.slice(0, 3)).toLowerCase();
    req.body.userid = useridstring;
    userService.create(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username not register, Please try again.....' }))
        //   .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username not register, Please try again.....' }))
        // .then((user) => {console.log(user),res.json(user)})
        .catch(err => {
            next(err)
        });

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
    userService.getById(req.params.id)
        .then(user => { console.log(user), user ? res.json(user) : res.sendStatus(404) })
        .catch(err => next(err));

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
                        id: user.id,
                        username: user.firstname + " " + user.lastname,
                        userid: user.userid,
                        userGender: user.userGender,
                        dob: user.dob,
                        phonenumber: user.phonenumber,
                        email: user.email,
                        mobileverify: user.mobileverify,
                        emailverify: user.emailverify,
                        userType: user.userType,
                        userCity: user.userCity,
                        registerData: user.date,
                        profileimages: user.profileimages,
                        request: user.request
                    };
                    res.json(response)
                }
                else {
                    res.json("No record")
                }
            }

        )
});
router.get('/syncUser/:id', (req, res) => {
    User.findById(req.params.id)
        .populate('profileimages')
        .exec(
            function (err, user) {
                if (user) {
                    response = {
                        id: user.id,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        userid: user.userid,
                        userGender: user.userGender,
                        dob: user.dob,
                        phonenumber: user.phonenumber,
                        email: user.email,
                        mobileverify: user.mobileverify,
                        emailverify: user.emailverify,
                        userType: user.userType,
                        userCity: user.userCity,
                        registerData: user.date,
                        profileimages: user.profileimages,
                        request: user.request
                    };
                    res.json(response)
                }
                else {
                    res.json("No record")
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
                else {
                    res.json("No record")
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