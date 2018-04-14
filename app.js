var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy= require("passport-local"),
    // override with POST having ?_method=PUT
    methodOverride = require('method-override'),
    restaurant  = require("./models/restaurant"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seed"),
    flash       = require("connect-flash");
//Require routes    
var commentRoutes = require("./routes/comments"),
    restaurantRoutes = require("./routes/restaurants"),
    indexRoutes     = require("./routes/index");


// mongoose.connect("mongodb://localhost/yelp_camp"); 
mongoose.connect("mongodb://sample:12345@ds123410.mlab.com:23410/restaurant"); 


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
//To serve the style sheet
app.use(express.static(__dirname + "/public")) //__dirname the directroy of the whole name: which make the path safer.
app.use(methodOverride('_method'))// override with POST having ?_method=PUT
app.use(flash());//Use flash in the project

// seedDB();

//PASSPORT COMFIGURATION
app.use(require("express-session")({
    secret: "Once again",
    resave: false,
    saveUninitialized: false
})); 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//responsible for paasport.authenticate("local", {})
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Following code will be used in every single route
//Set up in every route's middleware
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/restaurants/:id/comments", commentRoutes);

app.listen(8080, function() {
    console.log("Restaurant Server has started!!!");
});