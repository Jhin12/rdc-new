var SITO = 'http://rdc_new.jhin.c9users.io'

var express = require('express');
var router = express.Router();
var login = require('./login');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


/*funzione invocata al click del bottone per login facebook*/

router.get('/FBLogin', function(req, res, next) {
    res.redirect(SITO + '/users/FBLogin/confirm');
});

console.log('sto prima della confirm');
router.get('/FBLogin/confirm', login.callback_0);
console.log('sto dopo la confirm');


module.exports = router;
