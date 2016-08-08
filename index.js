'use strict';
console.log('Loading check-ssl-expiration::');
console.log('Version 0.0.1');

var moment = require('moment');
var https = require('https');

module.exports = function(domain, cb) {
  console.log("checking ssl..."+domain); //DEBUG
  if(!domain) {
    //console.log("no domain"); //DEBUG
    cb("Error: No domain specified", null);
    return false;
  } else {
    var now = moment();
    var options = {
      host: domain,
      port: 443,
      method: 'GET'
    };
    var req = https.request(options, function(res) {
      //console.log("https.request...");  //DEBUG
      var cert=res.connection.getPeerCertificate();
      var expireDate = moment(cert.valid_to, "MMM D HH:mm:ss YYYY GMT");
      // console.log("cert.valid_to: "+cert.valid_to);   //DEBUG
      // console.log("expireDate: "+expireDate);   //DEBUG
      // console.log("now: "+now); //DEBUG
      var remaining = expireDate.diff(now, 'days');
      //console.log("remaining: "+remaining); //DEBUG
      cb(null, remaining);
      return remaining;
    });
    req.end();

    req.on('error', (e) => {
      //console.error(e);
      cb(e, null);
    });
  }
}
