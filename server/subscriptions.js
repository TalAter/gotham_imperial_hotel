var db = require('./db.js');
var webpush = require('web-push');
var vapidDetails = require('./vapid-details.js');

var add = function(subscription) {
  db.get('subscriptions')
    .push(subscription)
    .value();
};

var notify = function(pushPayload) {
  webpush.setGCMAPIKey(vapidDetails.GCMAPIKey);
  webpush.setVapidDetails(
    vapidDetails.subject,
    vapidDetails.publicKey,
    vapidDetails.privateKey
  );

  var subscriptions = db.get('subscriptions').value();
  subscriptions.forEach(function(subscription) {
    webpush.sendNotification(subscription, JSON.stringify(pushPayload)).then(function() {
      console.log('Notification sent');
    }).catch(function() {
      console.log('Notification failed');
    });
  });
};

module.exports = {
  add: add,
  notify: notify
};
