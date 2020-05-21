// main-controller
var express = require('express');
var app = express();
app.listen(3000);
// middleware
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
var session = require('express-session');
app.use(session({ secret: '123456' }));
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});
// template engine
app.set('view engine', 'ejs');
// routers = controllers
app.use('/', require('./controllers/customer.js'));
app.use('/admin', require('./controllers/admin.js'));