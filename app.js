var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds"),
    path            = require('path'),
    geocoder        = require("geocoder");
// REQUIRING ROUTES    
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes          = require("./routes/index");

// APP CONFIGURATION
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(flash());
// call function to seed DB  
//seedDB();   

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Sutton is my buddy",
    resave: false,
   saveUninitialized: false
}));

app.locals.moment = require('moment');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log('YC server is listening'); 
});