var {expressjwt: jwt, expressjwt} = require('express-jwt');
require('dotenv').config();

function authJwt(){
    const secret = process.env.JSON_WEB_TOKEN_SECRET_KEY;
    console.log("process.env.JSON_WEB_TOKEN_SECRET_KEY",process.env.JSON_WEB_TOKEN_SECRET_KEY)
    return jwt({secret: secret, algorithms:['HS256']})
    
}  

module.exports = authJwt;


