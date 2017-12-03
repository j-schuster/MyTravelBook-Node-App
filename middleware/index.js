var Campground = require("../models/campground");
var Comment = require("../models/comment");
// all middleware goes here
var middlewareObj = {};
// CHECK CAMPGROUND OWNER
middlewareObj.checkCampgroundOwnership= function(req, res, next){
       if(req.isAuthenticated()){
             Campground.findById(req.params.id, function(error, foundCampground){
                 if(error){
                    req.flash("error", "Campground not found")  
                    res.redirect('back');
                 }else {
                if(!foundCampground) {
                    req.flash("error");
                    return res.redirect("back");
                }     
                 // does user own cg?
                 // do not use foundCampground.author.id === req.user_id
                 if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
                        next();
                 }else {
                 req.flash("error", "You need to be logged in to be able to do that")     
                 res.redirect('back')
            }
        }
    });   
    }else {
        res.redirect('back');
    }
}
// CHECK COMMENTOWNERSHIP
middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(error, foundComment){
                 if(error){
                    res.redirect('back');
                 }else {
                   if(!foundComment) {
                    req.flash("error");
                    return res.redirect("back");
                }       
                 // does user own cg?
                 // do not use foundCampground.author.id === req.user_id
                 if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                        next();
                 }else {
                 req.flash("error", "You cant do that" );   
                 res.redirect('back')
            }
        }
    });   
    }else {
        res.redirect('back');
    }
}
// IS LOGGED IN 
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You need to be logged in to do that');
    res.redirect("/login");
}


module.exports = middlewareObj;