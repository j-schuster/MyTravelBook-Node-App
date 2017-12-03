var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name:"White Mountain Peek",
        image: "https://farm5.staticflickr.com/4312/35772883520_5124ec069b.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vehicula tempor sem et pharetra. Pellentesque sit amet tortor blandit, sagittis nunc a, maximus eros. Nam imperdiet turpis sit amet consectetur dapibus. Ut at tortor eget magna pharetra ultricies. Proin cursus dictum porttitor. Donec suscipit "
        
    },
    {
        name:"Jagged Ice Mountain",
        image: "https://farm1.staticflickr.com/436/32756217002_069ed08f57.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vehicula tempor sem et pharetra. Pellentesque sit amet tortor blandit, sagittis nunc a, maximus eros. Nam imperdiet turpis sit amet consectetur dapibus. Ut at tortor eget magna pharetra ultricies. Proin cursus dictum porttitor. Donec suscipit "
        
    },
    {
        name:"Bald Mount",
        image: "https://farm1.staticflickr.com/32/38211822_281567e1b5.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vehicula tempor sem et pharetra. Pellentesque sit amet tortor blandit, sagittis nunc a, maximus eros. Nam imperdiet turpis sit amet consectetur dapibus. Ut at tortor eget magna pharetra ultricies. Proin cursus dictum porttitor. Donec suscipit "
        
    }
    ];

function seedDB(){
    // remove all campgrounds
    Campground.remove({}, function(error){
        if(error){
            console.log(error);
        }
        console.log("removed campgrounds");
        //add a few cmpgrds
        data.forEach(function(seed){
          Campground.create(seed, function(error, campground){
              if(error){
                  console.log(error);
                }else {
                    console.log("added campground");
                    // create comment
                    Comment.create({
                        text: "No internet, otherwise good!",
                        author: "Homer",
                    }, function(error, comment){
                        if(error){
                            console.log(error);
                        }else {
                            campground.comments.push(comment);
                            campground.save();
                            console.log("created new comment");
                        }
                        
                    });
                } 
          }); 
         });
    });
}
// add a few campgrounds

// add a few comments


module.exports = seedDB;

