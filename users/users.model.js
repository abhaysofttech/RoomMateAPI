const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userid: {type:String, required: true},
    firstname: {type:String, required: true},
    lastname: {type:String, required: true},
    password: {type:String, required: true},
    phonenumber: {type:String, required: true},
    email: {type:String, default:''},
    userType:{type:String, default:'user'}, //type must be superAdmin, grampanchayat, Admin, wardMember, employee, user
    userCity:{type:String, default:''},
    mobileverify: {type:String,default:true},
    date: {type:Date, default: Date.now},

    
});
//If you want the virtual field to be displayed on client side, 
//then set {virtuals: true} for toObject and toJSON in schema options as below:
UserSchema.set('toJSON', { virtuals: true }); 

module.exports = mongoose.model('User', UserSchema);