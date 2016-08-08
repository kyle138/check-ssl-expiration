'use strict';
console.log('Loading CheckSslExpiry::');
console.log('Version 0.1');

var moment = require('moment');
var https = require('https');

module.exports = function(domain) {
  if(!domain) {
    return false;
  }
  var now = moment();
  var options = {
    host: domain,
    port: 443,
    method: 'GET'
  };
  var req = https.request(options, function(res) {
    var cert=res.connection.getPeerCertificate();
    var expireDate = moment(cert.valid_to, "MMM  D HH:mm:ss YYYY GMT");
    var remaining = expireDate.diff(now, 'days');
    return remaining;
  });
  req.end();
}
