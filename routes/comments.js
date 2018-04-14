// =====================
// COMMENTS ROUTES
// =====================
var express = require("express");
var router = express.Router({mergeParams: true});//merge the param from app.js: /:id 
var restaurant = require("../models/restaurant");
var Comment = require("../models/comment");
var middlewareObj = require("../middleware/index.js");//If we require a directory, i t will automatically require the index.js
//Comments new
router.get("/new", middlewareObj.isLoggedIn, function(req, res){
    //find restaurant by id
    restaurant.findById(req.params.id, function(err, restaurant) {
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {restaurant: restaurant});
        }
    });
});

//Comments create
router.post("/", middlewareObj.isLoggedIn, function(req, res) {
   //lookup restaurant using ID
   restaurant.findById(req.params.id, function(err, restaurant) {
       if(err) {
           console.log(err);
           res.redirect("/restaurants");
       } else {
           //in the form of the comments/new html, the form name is comment[text] etc
           //thus the comment is a object that has text etc.
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id  = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    restaurant.comments.push(comment._id);
                    restaurant.save();
                    console.log(comment);
                    res.redirect("/restaurants/" + restaurant._id);
                }          
            });
       }
   });
   //create new comment
   //connect new comment to restaurant
   //redirect restaurant show page
});

router.get("/:comment_id/edit", function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            res.redirect("back");
        } else {
            //id refers the restaurant id
            res.render("comments/edit", {restaurant_id: req.params.id, comment: foundComment});
        }
    });
    
});


// COMMENT UPDATE
router.put("/:comment_id/edit", function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/restaurants/" + req.params.id);     
        }
    });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middlewareObj.checkCommentOwnerShip,function(req, res) {
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/restaurants/" + req.params.id);
        }
    });

});

//middleware


module.exports = router;
