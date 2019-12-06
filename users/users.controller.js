const express = require('express');
const router = express.Router();

const userService = require('./users.service');
// call user modal
const User = require('./users.model');

//routes
router.get('/', getAll);
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/current', getCurrent);
//router.get('/:id', getById);
router.get('/:username', getByUsername);
router.delete('/:id', _delete);
router.put('/update/:id', update);

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
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

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