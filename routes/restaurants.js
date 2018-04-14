var express = require("express");
var router = express.Router();
var restaurant = require("../models/restaurant");
var middlewareObj = require("../middleware");//Automatically search for /index.js


//INDEX - show all restaurants
router.get("/", function(req, res) {
    //Get all restaurant from db
    restaurant.find({}, function(err, restaurants) {
        if(err) {
            req.flash("error", err.message);
            console.log(err);
        } else {
            res.render("restaurants/index", {restaurants: restaurants});
        }
    });
});

//CREATE - add restaurant to database
router.post("/", middlewareObj.isLoggedIn, function(req, res) {
   //get data from form and add to restaurants array
   var name = req.body.name;
   var image = req.body.image;
   var price = req.body.price;
   var desc = req.body.description;
   var author = {
       id: req.user._id,
       username: req.user.username
   };
   
   var newRes = {name: name, image: image, description: desc, author: author, price: price};
   
   //Create a new restaurant and save to DB
   restaurant.create(newRes, function(err, newlyCreated) {
       if(err) {
           req.flash("error", err.message);
           console.log(err);
       } else {
           //redirect back to restaurants page
           req.flash("success", "You have add a new restaurant");
           console.log("add a new restaurant: " + newlyCreated);
           res.redirect("/restaurants");
       }
   });
});

//NEW - show form to create new restaurant
router.get("/new", middlewareObj.isLoggedIn, function(req, res) {
    res.render("restaurants/new");
});

router.get("/:id", function(req, res) {
    //find the restaurant with provided ID
    // restaurant.findById(req.params.id, function(err, foundrestaurant) {
    restaurant.findById(req.params.id).populate("comments").exec(function(err, foundRestaurant) {
       //.populate translate the comments id to comments' content
       if(err){
           req.flash("error", err.message);
           console.log(err);
       } else {
          console.log(foundRestaurant);
          //render show template with that restaurant
          res.render("restaurants/show", {restaurant: foundRestaurant});
       }
    });
    //find show template with that restaurant
});

// EDIT restaurant ROUTE
router.get("/:id/edit", middlewareObj.checkRestaurantOwnership, function(req, res) {
    //is user logged in
    restaurant.findById(req.params.id, function(err, foundRestaurant) {
        // does user own the restaurant?
        //foundRestaurant.author.id: is a mongoose object
        res.render("restaurants/edit", {restaurant: foundRestaurant});
    });
    //if not, redirect
});

// UPDATE restaurant ROUTE
router.put("/:id", middlewareObj.checkRestaurantOwnership,function(req, res) {
    //find and update the correct restaurant
    restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant, function(err, updatedRestaurant) {
        if(err) {
            req.flash("error", err.message);
            res.redirect("/restaurants");
        } else {
            res.redirect("/restaurants/" + req.params.id);
        }
    });
    //redirect somewhere
});

// DESTROY restaurant ROUTE
router.delete("/:id", middlewareObj.checkRestaurantOwnership, function(req, res) {
    restaurant.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            req.flash("error", err.message);
            res.redirect("/restaurants");
        } else {
            req.flash("success", "You have deleted the restaurant");
            res.redirect("/restaurants");
        }
    })
});

module.exports = router;