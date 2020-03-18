const config = require('../config.json');
const jwt = require('jsonwebtoken');
const db = require('../_helpers/db');
const PostAds = db.PostAds; // PostAds is a schema name in _helpers/db file
const AdsVisits = db.AdsVisits; // PostAds is a schema name in _helpers/db file
const Images = db.Images; // Image is a schema name in _helpers/db file
const Request = db.Request; // Image is a schema name in _helpers/db file

module.exports = {
    newAds,
    getAds,
    searchAds,
    getAdsGender,
    getMyAds,
    getRecentAdsVisit,
    getAdsDetails,
    // getAdsDetailsVerify,
    updateAds,
    updateAmenities,
    updateRent,
    getCities,
    getAreas,
    getAllImages,
    index,
    requested
};

async function getAds() {
    console.log("Check ***************")
    //return await PostAds.find().select('-hash');
    return await PostAds.find().select('-hash')
        .populate('profileimages')
        .populate('images')
        .populate('adsvisits')

    //db.getCollection('postads').find({phonenumber:{$eq : 9960732614},gender:{$eq : 'Female'}})
    //db.getCollection('postads').find({rentAmount:{$gte : '2000',$lte:'4000'}})
}
async function searchAds(req) {
    return await PostAds.find({
        area: { $eq: req.body.area },
        gender: { $in: req.body.gender },
        roomType: { $in: req.body.roomType },
        apparttype: { $in: req.body.apparttype },
        rentAmount: { $gte: req.body.rentAmount.lower, $lte: req.body.rentAmount.upper }
    }).select('-hash')
        .populate('images')
        .populate('profileimages')
        .populate('adsvisits');
}
async function getAdsGender(id) {
    return await PostAds.find({ gender: { $eq: id } });
}

async function getCities() {
    return await PostAds.distinct("city", { "city": { $nin: ["", null] } }).sort();
}
async function getAreas(id) {
    return await PostAds.find({
        $and: [
            { $and: [{ "city": id }] },
            //  { "zip" : zip }
        ]
    }, { "area": 1 })
}

async function getAdsDetails(id) {
    return await PostAds.findById(id).select('-hash');
}

// async function getAdsCiVerify(id,param) {
//     return await PostAds.find(id,{${param}:1});
// }

async function getMyAds(id) {
    return await PostAds.find({ phonenumber: { $eq: id } })
        .populate('images')
        .populate('adsvisits');
}

async function getRecentAdsVisit(id) {
    return await AdsVisits.find({ phonenumber: { $eq: id } })
    // .populate('images')
    // return await AdsVisits.aggregate([
    //     {$group:{_id:"$adsId",allValues : {"$push" : "$$ROOT"}}}
    //     ])
    // .populate('images')

}

function newAds(adsDetail) {
    const newads = new PostAds(adsDetail);
    return newads.save().then(function (ads) {
        const { _id } = ads;
        console.log(`New room id: ${_id}`);

        return _id;
    }).catch(function (err) {
        return false;
    });
}

async function updateRent(id, rentParam) {
    const ads = await PostAds.findById(id);
    Object.assign(ads, rentParam);
    await ads.save();
}

async function updateAmenities(id, amenitiesParam) {
    // const newads = new PostAds(adsDetail);
    const ads = await PostAds.findById(id);
    ads.airConditioner = amenitiesParam[0].isChecked,
        ads.club = amenitiesParam[1].isChecked,
        ads.playground = amenitiesParam[2].isChecked,
        ads.gas = amenitiesParam[3].isChecked,
        ads.sewage = amenitiesParam[4].isChecked,
        ads.powerBackup = amenitiesParam[5].isChecked,
        ads.liftService = amenitiesParam[6].isChecked,
        ads.houseKeeper = amenitiesParam[7].isChecked,
        ads.security = amenitiesParam[8].isChecked,
        ads.carParking = amenitiesParam[9].isChecked,
        ads.twoWheelerParking = amenitiesParam[10].isChecked,
        ads.swimmingPool = amenitiesParam[11].isChecked,
        ads.internetConnectivity = amenitiesParam[12].isChecked


    // validate
    if (!ads) throw 'Advertise not found';
    // if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
    //     throw 'Username "' + userParam.username + '" is already taken';
    // }

    // hash password if it was entered
    // if (userParam.password) {
    //     userParam.hash = bcrypt.hashSync(userParam.password, 10);
    // }

    // copy userParam properties to user

    Object.assign(ads, ads);

    await ads.save();
}
async function updateAds(id, adsStatusParam) {
    // const newads = new PostAds(adsDetail);
    const ads = await PostAds.findById(id);
    ads.adsStatus = adsStatusParam.adsStatus


    // validate
    if (!ads) throw 'Advertise not found';
    Object.assign(ads, ads);
    await ads.save();
}

async function getAllImages() {
    console.log("Check All image ***************")
    return await Images.find().select('-hash');
}

async function index(req) {
    console.log("Check All image ***************")
    return await PostAds.findById(req.params.id)
        .populate('images')
        .exec(function (err, PostAds) {

        })

}

function requested(requestId,requestDetail) {
    const newRequest = new Request(requestDetail);
    newRequest.adsId = requestId;
    return newRequest.save().then(function (request) {
        const { _id } = request;
        return _id;
    }).catch(function (err) {
        return false;
    });
}