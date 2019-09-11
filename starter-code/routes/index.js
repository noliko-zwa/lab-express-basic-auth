const express = require('express');
const router = express.Router();

/* GET home page */
router.get("/", (req, res) => {
  res.render("index");
});

router.get("/main", (req, res) => {
  res.render("main");
});


router.get("/private", (req, res) => {
  if (req.session.user) {
    res.render("private");
  } else {
    res.redirect("/login")
  }
})



module.exports = router;