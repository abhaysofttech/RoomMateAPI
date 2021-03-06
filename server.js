require('rootpath')();

const express = require('express');
const path = require('path')
const app = express();
const cors = require('cors');
const bodyParser= require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');
const passport = require('passport');


const allowedOrigins = [
  'capacitor://localhost',
  'ionic://localhost',
  'http://localhost',
  'http://localhost:4000',
  'http://localhost:8080',
  'http://localhost:8100'
];
const options = {
  "Access-Control-Allow-Credentials": true,

  "Access-Control-Allow-Origin": '*',
  "Access-Control-Allow-Headers": 'Content-Type,x-xsrf-token',
  "Access-Control-Expose-Headers": true,
  "Access-Control-Allow-Methods":'POST, GET, PUT, DELETE, OPTIONS'
  };
app.use(cors(options));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')))

// use JWT auth to secure the api
//  app.use(jwt());
//  app.use(passport.initialize());

// api routes
app.use('/users', require('./users/users.controller'));
app.use('/postads', require('./postads/postads.controller'));
app.use('/adsvisits', require('./adsvisits/adsvisits.controller'));
// global error handler
app.use(errorHandler);


// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
const server = app.listen(port, function () {
  
 // console.log(process.env);
    console.log('Server listening on port ' + port);
});