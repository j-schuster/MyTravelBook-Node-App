var express = require("express");
// replacing app. with router 
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var geocoder = require("geocoder");
// INDEX SHOW ALL CAMPGROUNDS
router.get('/', function(req, res){
// Get all campgrounds from DB
Campground.find({}, function(error, allCampgrounds){
    if(error){
        console.log('error');
    }else{
        res.render('campgrounds/index', {campgrounds: allCampgrounds, currentUser: req.user, page: 'campgrounds'});
    }
});
});
// CREATE ROUTE
router.post('/', middleware.isLoggedIn, function(req, res) {
   // get data from form and add to cmpgrds array
  var name = req.body.name;
  var image = req.body.image;
  var price = req.body.price;
  var desc = req.body.description;
    var author = {
      id: req.user._id,
      username: req.user.username
  }
  geocoder.geocode(req.body.location, function (error, data) {
  var lat = data.results[0].geometry.location.lat;
  var lng = data.results[0].geometry.location.lng;
  var location = data.results[0].formatted_address;
  
  var newCampground = {name: name,price: price, image: image, description: desc, author:author,  location: location, lat: lat, lng: lng};
  // create new campground
  Campground.create(newCampground, function(error, newlyCreated){
      if(error){
          console.log('error'); 
      }else{
          // go back to page
          console.log(newlyCreated);
          res.redirect('/campgrounds');
         }
      });
  });
});
// SHOW ADD NEW PAGE
router.get('/new', middleware.isLoggedIn, function(req, res){
   res.render('campgrounds/new'); 
});
// SHOW - shows more info about one campground
router.get('/:id', function(req, res){
    // find campground with specific id
    Campground.findById(req.params.id).populate("comments").exec(function(error, foundCampground){
        if(error){
            console.log('there is something wrong');
        }else {
            console.log(foundCampground);
            // render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(error, foundCampground){
              res.render('campgrounds/edit', {campground: foundCampground});
    });   
});
// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    geocoder.geocode(req.body.location, function (error, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, cost: req.body.cost, location: location, lat: lat, lng: lng}
    // find and update correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(error){
       if(error){
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
            }
        });
    });
});

// DESTROY CAMPGROUND ROUTE 
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(error){
       if(error){
           res.redirect("/campgrounds");
       }else{
           res.redirect("/campgrounds");
       }
   });
});


// EXPORT
module.exports = router;
