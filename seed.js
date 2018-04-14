//This file initailize the data, such that we can test the web app

var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
        {
            name: "Cloud's Rest",
            image: "https://image.shutterstock.com/display_pic_with_logo/2547541/358158596/stock-photo-camping-and-tent-under-the-pine-forest-in-sunset-at-north-of-thailand-358158596.jpg",
            description: "This is nice"
        }, 
        {
            name: "Russy Mountain",
            image: "https://cdn.pixabay.com/photo/2018/01/12/11/01/the-haze-3078040__480.jpg",
            description: "I wanna go there some day"
        },
        {
            name: "Weedy Ruster",
            image: "https://cdn.pixabay.com/photo/2017/04/05/01/15/forest-2203708__480.jpg",
            description: "I wanna be a part of this forest"
        }
    ];


function seedDB() {
    //Remove all campground
    Campground.remove({}, function(err) {
      if(err) {
          console.log(err);
      } 
      console.log("remove campground!");
        //*******Cause if the function is not in the call back, there is no guarantee the sequence the function is called.
        //*******Must put the code inside of the call back function if you want the code be called after the function finish!!!
        //Add a few campgrounds
        // data.forEach(function(seed) {
        //     Campground.create(seed, function(err, campground) {
        //         if(err) {
        //             console.log(err);
        //         } else {
        //             console.log("Added a campground");
        //             //create a comment
        //             Comment.create({
        //                 text: "This place is great, but I wish there was internet",
        //                 author: "Homer"
        //             }, function(err, comment) {
        //                 if(err) {
        //                     console.log(err)
        //                 } else {        
        //                     campground.comments.push(comment._id);
        //                     campground.save(function (err, updatedCamp) {
        //                         if (err) {
        //                             console.log(err);
        //                         }
        //                         else {
        //                             console.log("Add a comment!!!!!!!!!!!!!!")
        //                         }
                                    
        //                     });    
        //                 }
                        
        //             });
        //         }
        //     });
            
        // });
        //Add a few comments
    });
    
}

module.exports = seedDB;