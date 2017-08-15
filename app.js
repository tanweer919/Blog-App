var express = require("express");
var app = express();
var methodOverride = require("method-override");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
//app config
mongoose.connect("mongodb://localhost/blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
//Mongoose/model config
var blogSchema = mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);
//Restful routes
app.get("/", function (req, res) {
    res.redirect("/blogs");
});
app.get("/blogs", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if(err) {
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});
//NEW Route
app.get("/blogs/new", function (req, res) {
    res.render("new");
});
//CREATE Route
app.post("/blogs", function (req, res) {
    //create blog
    Blog.create(req.body.blog, function (err, newBlog) {
        if(err) {
            res.render("new")
        }
        else {
            //then redirect to index page
            res.redirect("/blogs")
        }
    });
});
//SHOW Route
app.get("/blogs/:id", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if(err) {
            res.redirect("/blogs");
        }
        else  {
            res.render("show", {blog: foundBlog});
        }
    });
});
//EDIT Route
app.get("/blogs/:id/edit", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if(err) {
            res.redirect("/blogs");
        }
        else {
            res.render("edit", {blog: foundBlog});
        }
    });
});
//UPDATE Route
app.put("/blogs/:id", function (req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, UpdatedBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/"+req.params.id);
        }
    })
});
//DELETE Route
app.delete("/blogs/:id", function (req, res) {
    Blog.findByIdAndRemove(req.params.id, function (err) {
        if(err) {
            res.redirect("/blogs");
        }
        else {
            res.redirect("/blogs");
        }
    });
});
app.listen(3000, function () {
    console.log("Server started successfully");
});


