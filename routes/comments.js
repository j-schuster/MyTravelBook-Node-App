var express = require("express");
// replacing app. with router 
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


// COMMENTS NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(error, campground){
       if(error){
           console.log('oooops');
       } else {
            res.render("comments/new", {campground: campground}); 
       }
    });
      
});
// COMMENTS CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
  // lookup cg using ID
  Campground.findById(req.params.id, function(error, campground){
     if(error){
         console.log(error);
         res.redirect("/campgrounds");
     } else{
         Comment.create(req.body.comment, function(error, comment){
            if(error){
                req.flash("error", "Something went wrong");
                console.log(error);
            }else {
                // add username and id to comments
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                // save comment
                comment.save();
                campground.comments.push(comment);
                campground.save();
                console.log(comment);
                req.flash("success", "Success!");
                res.redirect("/campgrounds/" + campground._id);
            }
        });
     }
  });
});  
// COMMENTS EDIT ROUTE  
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(error, foundComment){
        if(error){
            res.redirect('back');
        }else {
             res.render("comments/edit", {campground_id: req.params.id, comment: foundComment}); 
        }
    });
 });
// COMMENTS UPDATE
router.put("/:comment_id/", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(error, udpatedComment){
      if(error){
          res.redirect('back');
      }else {
          res.redirect('/campgrounds/' + req.params.id)
      }
  });
});
// DELETE COMMENT ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   // find and remove
   Comment.findByIdAndRemove(req.params.comment_id, function(error){
       if(error){
           res.redirect('back');
       }else {
           req.flash("success", "success!")
           res.redirect('/campgrounds/' + req.params.id);
       }
   })
});

module.exports = router;