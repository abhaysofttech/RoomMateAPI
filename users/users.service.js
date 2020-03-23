const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const User = db.User;

module.exports = {
    authenticate,
    authenticatebyemail,
    getAll,
    phonenumber,
    userById,
    getById,
    getRequest,
    getByUsername,
    create,
    update,
    delete: _delete
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
                else{
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
    if (await User.findOne({ phonenumber: userParam.phonenumber })) {
        throw 'Phone Number "' + userParam.phonenumber + '" is already register';
    }
    const user = new User(userParam);
    if (userParam.password) {
        user.password = bcrypt.hashSync(userParam.password, 10);
    }
    return user.save().then(function (user) {
        const { _id } = user;
        console.log(`New room id: ${_id}`);

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