var express = require('express');
var router = express.Router();
// config mongodb
var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb+srv://sonkk:pwd@clustersgp-tj3gl.mongodb.net/sproject";
// routes
router.get('/', (req, res) => {
  res.redirect('login');
});
router.get('/login', (req, res) => {
  if (req.session.admin) {
    res.redirect('home');
  } else {
    res.render('../views/admin/login.ejs');
  }
});
router.post('/login', (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  MongoClient.connect(uri, (err, conn) => {
    if (err) throw err;
    var db = conn.db("sproject");
    var query = { username: username, password: password };
    db.collection("admins").findOne(query, (err, result) => {
      if (err) throw err;
      if (result) {
        req.session.admin = result;
        res.redirect('home');
      } else {
        res.redirect('login');
      }
      conn.close();
    });
  });
});
router.get('/home', (req, res) => {
  if (req.session.admin) {
    res.render('../views/admin/home.ejs');
  } else {
    res.redirect('login');
  }
});
router.get('/logout', (req, res) => {
  delete req.session.admin;
  res.redirect('login');
});
router.get('/listcategory', (req, res) => {
  if (req.session.admin) {
    MongoClient.connect(uri, (err, conn) => {
      if (err) throw err;
      var db = conn.db("sproject");
      var query = {};
      db.collection("categories").find(query).toArray((err, result) => {
        if (err) throw err;
        res.render('../views/admin/listcategory.ejs', {cates: result});
        conn.close();
      });
    });
  } else {
    res.redirect('login');
  }
});
router.get('/addcategory', (req, res) => {
  res.render('../views/admin/addcategory.ejs');
});
router.post('/addcategory', (req, res) => {
  var cname = req.body.catename;
  MongoClient.connect(uri, (err, conn) => {
    if (err) throw err;
    var db = conn.db("sproject");
    var cate = { name: cname };
    db.collection("categories").insertOne(cate, (err, result) => {
      if (err) throw err;
      if (result.insertedCount > 0) {
        res.redirect('listcategory');
      } else {
        res.redirect('addcategory');
      }
      conn.close();
    });
  });
});
router.get('/deletecategory', (req, res) => {
  var id = req.query.id;
  //console.log(id); // for DEBUG
  MongoClient.connect(uri, (err, conn) => {
    if (err) throw err;
    var db = conn.db("sproject");
    var query = { _id: require('mongodb').ObjectId(id) };
    db.collection("categories").deleteOne(query, (err, result) => {
      if (err) throw err;
      res.redirect('listcategory');
      conn.close();
    });
  });
});
router.get('/editcategory', (req, res) => {
  var id = req.query.id;
  MongoClient.connect(uri, (err, conn) => {
    if (err) throw err;
    var db = conn.db("sproject");
    var query = { _id: require('mongodb').ObjectId(id) };
    db.collection("categories").findOne(query, (err, result) => {
      if (err) throw err;
      res.render('../views/admin/editcategory.ejs', {cate: result});
      conn.close();
    });
  });
});
router.post('/editcategory', (req, res) => {
  var id = req.body.id;
  var cname = req.body.catename;
  //console.log(id + " | " + cname);
  MongoClient.connect(uri, (err, conn) => {
    if (err) throw err;
    var db = conn.db("sproject");
    var query = { _id: require('mongodb').ObjectId(id) };
    var newvalues = { $set: { name: cname } };
    db.collection("categories").updateOne(query, newvalues, (err, result) => {
      if (err) throw err;
      if (result.result.nModified > 0) {
        res.redirect('listcategory');
      } else {
        res.redirect('editcategory');
      }
      conn.close();
    });
  });
});
module.exports = router;