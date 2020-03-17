const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const Images = db.Images;


module.exports = {
    getAllImages,
    // getById,
    // getByComplainName,
    create,
    // update,
    // delete: _delete
};


async function getAllImages() {
    console.log("Check All image ***************")
    return await Images.find().select('-hash');
}

// async function getById(id) {
//     return await ComplainType.findById(id).select('-hash');
// }

// async function getByComplainName(complainname) {
//   return await ComplainType.findOne({ complainname: complainname });
// }


async function create(userParam) {
    const path = require('path')
    const remove = path.join(__dirname, '..','..','public')
    const relPath = req.file.path.replace(remove, '')
    const newImage = new Image(userParam)
    newImage.logEntryId = req.params.log_entry_id
    newImage.path = relPath
    await newImage.save(function (err, image) {
       if(err) res.send(err) 
       res.json(image)
    })
    
//     // validate
//     if (await ComplainType.findOne({ complainname: userParam.complainname })) {
//         throw 'Complain Name "' + userParam.complainname + '" is already taken';
//     }
//   //  console.log(userParam);
//     const complainType = new ComplainType(userParam);

//     // save user
//     await complainType.save();
}

// async function update(id, userParam) {
//     const complainType = await ComplainType.findById(id);

//     // validate
//     if (!complainType) throw 'Complain type found';
//     if (complainType.complainname !== userParam.complainname && await ComplainType.findOne({ complainname: userParam.complainname })) {
//         throw 'Complain Type "' + userParam.complainname + '" is already taken';
//     }


//     // copy userParam properties to user
//     Object.assign(complainType, userParam);

//     await complainType.save();
// }

// async function _delete(id) {
//     await ComplainType.findByIdAndRemove(id);
// }