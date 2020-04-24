const config = require('../config.json');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true })
    .then(() => console.log("MongoDB Connection..."))
    .catch(err => console.log(err));
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../users/users.model'),
    PostAds: require('../postads/postads.model'),
    Images:require('../postads/images.model'),
    ProfileImages:require('../users/profile.model'),
    AdsVisits:require('../adsvisits/adsvisits.model'),
    Request:require('../postads/request.model'),
    appVersion: require('../users/appversion.model')

};