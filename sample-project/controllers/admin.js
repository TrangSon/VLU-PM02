var express = require('express');
var router = express.Router();
// routes
router.get('/', (req, res) => {
  res.send('<h1>ADMIN HOME</h1>');
});
module.exports = router;