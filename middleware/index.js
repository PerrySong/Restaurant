var Restaurant = require("../models/restaurant.js");
var Comment = require("../models/comment.js");

//All middleware goes here!!
var middlewareObj = {};

//middleware
middlewareObj.isLoggedIn = function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } 
    req.flash("error", "Please login first");
    res.redirect("/login");
}

middlewareObj.checkRestaurantOwnership = function checkRestaurantOwnership(req, res, next) {
    //is user logged in
    if(req.isAuthenticated()) {
        Restaurant.findById(req.params.id, function(err, foundRestaurant) {
            if(err) {
                req.flash("error", err.message);
                res.redirect("/restaurants");
            } else {
                // does user own the Restaurant?
                //foundRestaurant.author.id: is a mongoose object.
                if(foundRestaurant.author.id.equals(req.user._id)) { // The Restaurant is made by this author
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "you need to log in to do that");
    }
    //if not, redirect
}

middlewareObj.checkCommentOwnerShip = function checkCommentOwnerShip(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err) {
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "you need to log in to do that");
        res.redirect("back");
    }
}

module.exports = middlewareObj;