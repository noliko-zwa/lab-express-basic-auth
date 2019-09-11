const express = require('express');
const bcrypt = require("bcrypt");

const router = express.Router();
const User = require("../models/User");

router.get("/signup", (req, res) => {
    res.render('signup');
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/signup", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username === "") {
        res.render('signup', {
            message: "your username cannot be empty"
        });
        return;
    }


    User.findOne({
        username: username
    }).then(found => {
        if (found !== null) {
            res.render("signup", {
                message: "this username is already taken"
            });

        } else {
            const salt = bcrypt.genSaltSync();
            const hash = bcrypt.hashSync(password, salt);

            User.create({
                    username: username,
                    password: hash
                })
                .then(dbUser => {
                    res.session.user = dbUser;
                    res.redirect('/');
                })
                .catch(err => {
                    next(err);
                });
        }
    })
});

router.post("/login", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({
        username: username
    }).then(found => {
        if (found === null) {
            res.render("login", {
                message: "Invalid"
            });
            return
        }
        if (bcrypt.compareSync(password, found.password)) {
            req.session.user = found;
            res.redirect("/private");

        } else {
            res.render("login", {
                message: "Invalid"
            });
        }
    });
});

router.get("/logout", (req, res, next) => {
    req.session.destroy(err => {
        if (err) next(err);
        else res.redirect("/")
    });
});




module.exports = router;