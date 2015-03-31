var express = require('express');
var app = express();
app.configure(function() {
  app.use(express.bodyParser());
});
app.listen(80);