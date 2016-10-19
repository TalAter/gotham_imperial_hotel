var webpush = require('web-push');

var vapidKeys = webpush.generateVAPIDKeys();

console.log('Public Key: ');
console.log(vapidKeys.publicKey);
console.log();
console.log('Private Key:');
console.log(vapidKeys.privateKey);
