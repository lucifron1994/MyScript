var speakeasy = require("speakeasy");
var QRCode = require('qrcode');

//Custom Scret
var custom_secret = 'ABCDEFGHIJKLMNOP';

var otpAuthString = 'otpauth://totp/SECRET?secret=' + custom_secret;
var secret = speakeasy.generateSecret();
secret.base32 = custom_secret;
secret.otpauth_url = otpAuthString;

var token = speakeasy.totp({
  secret: secret.base32,
  encoding: 'base32'
});
console.log('Token: ' + token);
