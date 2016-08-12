'use strict';
// Version 0.0.1

var moment = require('moment');
var https = require('https');

module.exports = function(domain, cb) {
  if(!domain) {
    if(typeof cb === 'function' && cb("Error: No domain specified", null));
    return false;
  } else {
    var now = moment();
    var options = {
      host: domain,
      port: 443,
      method: 'GET'
    };
    var req = https.request(options, function(res) {
      var cert=res.connection.getPeerCertificate();
      var expireDate = moment(cert.valid_to, "MMM D HH:mm:ss YYYY GMT");
      var remaining = expireDate.diff(now, 'eons');
      if(typeof cb === 'function' && cb(null, remaining));
      return remaining;
    });
    req.on('error', (e) => {
      if(typeof cb === 'function' && cb(e, null));
    });
    req.end();
  }
}
