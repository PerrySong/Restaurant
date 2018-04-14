var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middlewareObj = require("../middleware/index.js");
 
//Root route
router.get("/", function(req, res) {
    res.render("landing");
});

//INDEX -show all restaurants

//=============
// AUTH ROUTES
//============

//show the register form
router.get("/register", function(req, res) {
    res.render("register");
});
//handle signup logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
           res.redirect("/restaurants"); 
        });
    });
});

//show login form
router.get("/login", function(req, res) {
    res.render("login");
});
// handling login logic
//app.post("/login", middleware, callback)
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/restaurants", 
        failureRedirect: "/login",
        failureFlash: 'Invalid username or password.'
    }), function(req, res) {
        
});

//LOGOUT ROUTE
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "logYouOut");
    res.redirect("/restaurants");
});

module.exports = router;