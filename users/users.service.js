require('dotenv').config();
const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const User = db.User;
const appVersionDB = db.appVersion;

const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');


module.exports = {
    authenticate,
    authenticateByOTP,
    authenticatebyemail,
    getAll,
    phonenumber,
    userById,
    getById,
    getRequest,
    getByUsername,
    create,
    update,
    delete: _delete,
    getappVersion,
    newappversion
};

async function authenticate({ phonenumber, password }) {
    console.log(phonenumber, password);
    const user = await User.findOne({ phonenumber }).populate('profileimages');
    if (user && bcrypt.compareSync(password, user.password)) {
        const { password, ...userWithoutHash } = user.toObject();
        console.log(userWithoutHash);
        const token = jwt.sign({ sub: user.id }, config.secret);
        return {
            ...userWithoutHash,
            token
        };
    }
}

async function authenticateByOTP(phonenumber) {
    const user = await User.findOne({phonenumber}).populate('profileimages');
    if (user) {
        const token = jwt.sign({ sub: user.id }, config.secret);
        return {
            token
        };
    }
}

async function authenticatebyemail({ email, password }) {
    const user = await User.findOne({ email }).populate('profileimages');
    if (user && bcrypt.compareSync(password, user.password)) {
        const { password, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id }, config.secret);
        return {
            ...userWithoutHash,
            token
        };
    }
}

async function getAll() {
    console.log("Check ***************")
    return await User.find().select('-hash')
        .populate('profileimages');
}
async function getappVersion() {
    return await appVersionDB.find().select('-hash')
}


async function newappversion(newVersion) {
    const appVersion = await appVersionDB.findOne();
    const version = new appVersionDB(newVersion);

    if (appVersion != null && appVersion.version != newVersion.version) {
        // copy userParam properties to user
        appVersion.version = newVersion.version;
        Object.assign(appVersion,appVersion);
        appVersion.save().then(function (user) {
            return user.version;
        }).catch(function (err) {
            return false;
        });
    }
    else if(appVersion == null){
        return version.save().then(function (user) {
            const { _id } = user;
           // console.log(`new RoomMate version: ${user.version}`);

            return user.version;
        }).catch(function (err) {
            return false;
        });
    }
    else{
        return 'version is already exists'
    }

}

async function phonenumber(contact) {
    return await User.findOne({ phonenumber: contact })
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
        );
}
async function userById(id) {
    return await User.findById(id).select('')
}
async function getById(id) {
    return await User.findById(id).select('')
        // .populate('profileimages')
        // .populate('request')

        .exec(
            function (err, user) {
                if (user) {
                    response = {
                        user: {
                            username: user.firstname + user.lastname,
                            userid: user.id
                        }
                    };
                    //  return(response);
                }
            }
        );
}
async function getRequest(id) {
    return await User.findById(id).select('-hash')
        .populate('profileimages')
        .populate('request')
        ;
}


async function getByUsername(username) {
    //  return await User.findById(username).select('-hash');
    return await User.findOne({ username: username });
}


async function create2(userParam) {
    // validate
    if (await User.findOne({ phonenumber: userParam.phonenumber })) {
        throw 'Phone Number "' + userParam.phonenumber + '" is already taken';
    }
    console.log(userParam);
    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.password = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save().then(function (user) {
        const { _id } = user;
        console.log(`New room id: ${_id}`);

        return user;
    }).catch(function (err) {
        return false;
    });

}
async function create(userParam) {
    if (await User.findOne({ phonenumber: userParam.phonenumber }) || await User.findOne({ email: userParam.email })) {
        throw 'Phone Number "' + userParam.phonenumber + '"<br/>or Email "' + userParam.email +' <br/>is already register';
    }
    const user = new User(userParam);
    if (userParam.password) {
        user.password = bcrypt.hashSync(userParam.password, 10);
    }
    const otpGeneratorValue =  otpGenerator.generate(6, { alphabets:false,upperCase: false, specialChars: false })
    user.emailverifyCode = otpGeneratorValue;
    return user.save().then(function (user) {
        sendEmail(user)
        const { _id } = user;
        // console.log(`New room id: ${_id}`);

        return _id;
    }).catch(function (err) {
        return false;
    });
}

async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}

function sendEmail(user) {
    // nodemailer configuration *************************

    //Step 1
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.email, // generated ethereal user
            pass: process.env.pass // generated ethereal password
        }
    });

    //Step 2
    // send mail with defined transport object
    let mailOptions = {
        from: 'roommatedekho@gmail.com', // sender address
        to: user.email, // list of receivers
        bcc: 'abhaysofttech@gmail.com',
        subject: "Your verification code awaits with RoomMate", // Subject line
        text: `${user.emailverifyCode} Your verification code awaits with RoomMate `, // plain text body
        html: `Dear ${user.firstname}<br><br>
        Thanks for signing up with <b>RoomMate Dekho</b> (http://www.roommatedekho.com)! With Room Mate you can now experience hassle free search for room mate & flats.
        <br><br><br>Verify email id code is <span style="font-size:16px;"><b>${user.emailverifyCode}</b></span>
        <br><br><br>Thanks,
        <br>RoomMate Dekho Team.
        <br><br><br>If you have any doubts, don't hesitate we are there. Write to us on - roommatedekho@gmail.com` // html body
    };

    //Step 3
    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log('Error Occurs' + err)
        } else {
            console.log('Email sent !!!!!!!!!!!')
        }
    });
    //******************************************** */
}

async function reSendEmailVerify(user) {
    // nodemailer configuration *************************

    //Step 1
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.email, // generated ethereal user
            pass: process.env.pass // generated ethereal password
        }
    });

    //Step 2
    // send mail with defined transport object
    let mailOptions = {
        from: 'roommatedekho@gmail.com', // sender address
        to: user.email, // list of receivers
        bcc: 'abhaysofttech@gmail.com',
        subject: "Your verification code awaits with RoomMate", // Subject line
        text: `${user.emailverifyCode} Your verification code awaits with RoomMate `, // plain text body
        html: `Dear ${user.firstname}<br><br>
        Thanks for signing up with <b>RoomMate Dekho</b> (http://www.roommatedekho.com)! With Room Mate you can now experience hassle free search for room mate & flats.
        <br><br><br>Your Email Verify code is <span style="font-size:16px;"><b>${user.emailverifyCode}</b></span>
        <br><br><br>Thanks,
        <br>RoomMate Dekho Team.
        <br><br><br>If you have any doubts, don't hesitate we are there. Write to us on - roommatedekho@gmail.com` // html body
    };

    //Step 3
    await transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log('Error Occurs' + err)
        } else {
            console.log('Email sent !!!!!!!!!!!')
        }
    });
    //******************************************** */
}

