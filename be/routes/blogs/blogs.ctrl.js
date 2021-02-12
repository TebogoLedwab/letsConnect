const express = require("express");
const config = require("config");
const { validationResult } = require("express-validator");
const Blog = require("./blogs.schema");
const User = require("../users/users.schema");
const mongoose = require("mongoose");
const notifications = require("../../middlewares/notifications");

exports.get_all_blogs = async (req, res, next) => {
  try {
    const blogPost = await Blog.find({}).populate("user", [
      "name",
      "avatar",
      "email",
    ]);

    if (!blogPost) {
      return res.status(400).json({
        msg: "There are no blog posts",
      });
    }

    res.json(blogPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/*
-adding/Update new blog (POST method) API community  
-attributes required to create/update a new blog post content,likes,datePosted*/
exports.create_update_blog = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  let id = req.params.id;

  const { title, content, image, likes, dislikes, datePosted } = req.body;

  // Build community object
  const blogFields = {};
  blogFields.user = req.user.id;

  if (title) blogFields.title = title;
  if (content) blogFields.content = content;
  if (image) blogFields.image = image;
  else blogFields.image = "";
  if (dislikes) blogFields.dislikes = dislikes;
  else blogFields.dislikes = [];
  if (likes) blogFields.likes = likes;
  else blogFields.likes = [];
  if (datePosted) blogFields.datePosted = datePosted;

  if (!id) id = new mongoose.mongo.ObjectID();

  try {
    // Using upsert option (creates new doc if no match is found):
    let blogPost = await Blog.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: blogFields,
      },
      {
        new: true,
        upsert: true,
      }
    );

    req.getPoints = "added_updated blog"; //allocating points to user after posting a blog post
    req.blogPost = blogPost;
    /* next(); */

    res.status(200).json({
      blogPost,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/* -liking and unliking on a community post */
exports.blog_liking = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  try {
    let blog = await Blog.findOne({
      _id: req.params.id,
    })
      .populate("user", ["name", "avatar"])
      .populate("comments.user_id", ["name", "avatar"]);

    let g = blog.likes.filter(function (id) {
      return id == req.user.id;
    });

    if (g.length > 0) {
      blog.likes = blog.likes.filter(function (id) {
        return id !== req.user.id;
      });
    } else {
      blog.likes.unshift(req.user.id);
      notifications.notifyLiking(blog, req.user.name);
    }

    await blog.save();

    res.json(blog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/* -liking and unliking on a community post */
exports.blog_disliking = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  try {
    let blog = await Blog.findOne({
      _id: req.params.id,
    })
      .populate("user", ["name", "avatar"])
      .populate("comments.user_id", ["name", "avatar"]);

    let g = blog.dislikes.filter(function (id) {
      return id == req.user.id;
    });

    if (g.length > 0) {
      blog.dislikes = blog.dislikes.filter(function (id) {
        return id !== req.user.id;
      });
    } else {
      blog.dislikes.unshift(req.user.id);
      notifications.notifyDisliking(blog, req.user.name);
    }

    await blog.save();

    res.json(blog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/* 
-deleting  post (DELETE method) API community 
-deleting a post based on post id  */
exports.delete_blog = async (req, res, next) => {
  try {
    await Blog.findByIdAndDelete({
      _id: req.params.id,
      user: req.params.user,
    });

    return res.status(200).json({
      msg: "Post Deleted",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Server error",
    });
  }
};
