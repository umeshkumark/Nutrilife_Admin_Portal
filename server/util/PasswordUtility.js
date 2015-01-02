

var crypto = require('crypto');
var algorithm = 'aes-256-ctr';
var password = 'password';

exports.encryptText = function(plainText) {
    console.log('PasswordUtility#encryptText');
    var cipher = crypto.createCipher(algorithm,password);
    var encryptedText = cipher.update(plainText,'utf8','hex');
    encryptedText = encryptedText + encryptedText.final('hex');
    return encryptedText;
};

exports.decryptText = function(encryptedText) {
    console.log('PasswordUtility#decryptText');
    var decipher = crypto.createDecipher(algorithm,password);
    var decryptedText = decipher.update(encryptedText,'hex','utf8');
    decryptedText = decryptedText + decryptedText.final('utf8');
    return decryptedText;
};

exports.generateHash = function(plainText){
    console.log('PasswordUtility#generateHash.Plain Text - ' + plainText);
    var md5sum = crypto.createHash('md5');
    md5sum.update(plainText);
    var hash = md5sum.digest('hex');
    console.log('PasswordUtility#generateHash.Hash - ' + hash);
    return hash;
};
