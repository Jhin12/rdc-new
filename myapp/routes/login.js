var request = require('request');
var crypto = require('crypto');
var key = require('../key');

var ALGORITHM = 'aes-256-ctr';
var CRYPTO_PASS = key.crypto_pass;

var APP_ID_FB = key.app_id_fb;
var APP_SECRET_FB = key.app_secret_fb;

var URL_OAUTH = 'https://graph.facebook.com/v2.8/oauth/access_token?';
var URL = 'https://www.facebook.com/dialog/oauth?client_id=' + APP_ID_FB + '&redirect_uri=http://rdc_new.jhin.c9users.io/users/FBLogin/confirm&scope=email,user_location,user_hometown,user_tagged_places,user_photos,user_friends,publish_actions,user_posts';
var callback_0 = function(req, res, next) {
    if(!req.query.hasOwnProperty('code')){
        res.redirect(URL);
    }
    var code = req.query.code;
    request.get({
        url: URL_OAUTH,
        qs: {
            client_id: APP_ID_FB,
            client_secret: APP_SECRET_FB,
            redirect_uri: 'http://rdc_new.jhin.c9users.io/users/FBLogin/confirm',
            code: code,
            
        }, function(error, response, body){
            if(!error && response.statusCode == 200){
                var element = JSON.parse(body);
                console.log('sono entrato nella function');
                req.ACCESS_TOKEN = element.access_token;
                req.APPSECRET_PROOF = crypto.createHmac('SHA256', APP_SECRET_FB).update(req.ACCESS_TOKEN).digest('hex');
                
                var cipher_accessToken = crypto.createCipher(ALGORITHM, CRYPTO_PASS);
                req.crypted_accessToken = cipher_accessToken.update(req.ACCESS_TOKEN, 'utf8', 'hex');
                req.crypted_accessToken += cipher_accessToken.final('hex');

                var cipher_appsecretProof = crypto.createCipher(ALGORITHM, CRYPTO_PASS);
                req.crypted_appsecretProof = cipher_appsecretProof.update(req.APPSECRET_PROOF, 'utf8', 'hex');
                req.crypted_appsecretProof += cipher_appsecretProof.final('hex');
                next();
            }
             else {
                res.send(body).end();
            }
        }
    })
};

var obj_login = {
    callback_0: callback_0
};

module.exports = obj_login;