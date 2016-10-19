var webpush = require('web-push');
var fs = require('fs');
var vapidKeys = webpush.generateVAPIDKeys();

console.log('Your new public key is:');
console.log(vapidKeys.publicKey);
console.log('This key should be used as the applicationServerKey when creating a subscription');
console.log();

var vapidDetailsContents = `module.exports = {
  GCMAPIKey: 'YOUR_GCM_API_KEY',
  subject: 'mailto:your@email.com',
  publicKey: '${vapidKeys.publicKey}',
  privateKey: '${vapidKeys.privateKey}'
};`;

var vapidDetailsFilePath = __dirname+'/vapid-details.js';

fs.writeFile(vapidDetailsFilePath, vapidDetailsContents, function(err) {
  if (err) {
    console.log('Error creating vapid-details.js');
    console.log(err);
  }
  console.log(vapidDetailsFilePath+' created.');
  console.log('You should update it with your GCM API key, and email');
});
