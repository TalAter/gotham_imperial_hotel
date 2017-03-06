var webpush = require("web-push");
var fs = require("fs");
var vapidKeys = webpush.generateVAPIDKeys();

console.log("Your new public key is:");
console.log(vapidKeys.publicKey);
console.log(
  "This key should be used as the applicationServerKey when creating a subscription"
);
console.log();

var pushKeysContents = `module.exports = {
  GCMAPIKey: "YOUR_GCM_API_KEY",
  subject: "mailto:your@email.com",
  publicKey: "${vapidKeys.publicKey}",
  privateKey: "${vapidKeys.privateKey}"
};`;

var pushKeysFilePath = __dirname + "/push-keys.js";

fs.writeFile(pushKeysFilePath, pushKeysContents, function(err) {
  if (err) {
    console.log("Error creating push-keys.js");
    console.log(err);
  }
  console.log(pushKeysFilePath + " created.");
  console.log("You should update it with your GCM API key, and email");
});
