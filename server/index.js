var express = require('express');
var app = express();
var port = 8443;

app.use(express.static('public'));

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
