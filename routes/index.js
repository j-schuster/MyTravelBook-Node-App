var express = require("express");
// replacing app. with router 
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


// ROOT ROUTE
router.get('/', function(req, res){
   res.render('landing');
});
// SHOW REGISTER FORM
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});
// HANDLE SIGN UP LOGIC
router.post("/register", function(req, res){
   var newUser = new User({username: req.body.username});  
   if(req.body.adminCode === 'secret123') {
       newUser.isAdmin = true;
   }
   User.register(newUser, req.body.password, function(error, user){
       if(error){
           console.log(error);
           return res.render("register", {"error": error.message});
       }
       passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to YelpCamp " + user.username);
           res.redirect("/campgrounds");
       });
   });
});

// SHOW LOGIN FORM
router.get("/login", function(req, res){
   res.render("login", {page: "login"});
});

// LOGIN LOGIC
router.post("/login", passport.authenticate("local", 
    {   successRedirect: "/campgrounds",
        failurRedirect: "/login"
}), function(req, res){
   
});

// LOGOUT LOGIC
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "logged you out!")
    res.redirect("/campgrounds");
});


module.exports = router;