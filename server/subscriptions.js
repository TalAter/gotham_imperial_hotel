var db = require('./db.js');
var webpush = require('web-push');
var pushKeys = require('./push-keys.js');

/**
 * Adds a subscription details object to the database, if it doesn't already exist
 *
 * @param {Object} subscription
 */
var add = function(subscription) {
  // Make sure subscription doesn't already exist
  var existingSubscriptions = db.get('subscriptions')
  .filter({endpoint: subscription.endpoint})
  .value();
  if (existingSubscriptions.length > 0) {
    return;
  }

  // Add the new subscription
  db.get('subscriptions')
    .push(subscription)
    .value();
};

/**
 * Sends a push message to all subscriptions
 *
 * @param {Object} pushPayload
 */
var notify = function(pushPayload) {
  webpush.setGCMAPIKey(pushKeys.GCMAPIKey);
  webpush.setVapidDetails(
    pushKeys.subject,
    pushKeys.publicKey,
    pushKeys.privateKey
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
