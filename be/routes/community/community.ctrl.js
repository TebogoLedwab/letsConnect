const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const { validationResult } = require("express-validator");
const Community = require("./community.schema");
const User = require("../users/users.schema");
const Profile = require("../profiles/profiles.schema");
const notifications = require("../../middlewares/notifications");

/*
-getting all posts (GET method) API community  
-will get all the post that users have posted*/
exports.get_all_community_post = async (req, res, next) => {
  try {
    const commPost = await Community.find({})
      .populate("user", ["name", "avatar"])
      .populate("comments.user_id", ["name", "avatar"]);

    if (!commPost) {
      return res.status(400).json({
        msg: "There are no posts",
      });
    }

    res.json(commPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/*
-adding/Update new post (POST method) API community  
-attributes required to create/update a new community post content,tags,likes,datePosted*/
exports.create_update_community_post = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  let id = req.body.id;

  const {
    content,
    image,
    title,
    tags,
    likes,
    dislikes,
    comments,
    datePosted,
  } = req.body;

  // Build community object
  const communityFields = {};
  communityFields.user = req.user.id;

  if (content) communityFields.content = content;
  if (image) communityFields.image = image;
  else communityFields.image = "";
  if (title) communityFields.title = title;
  if (tags) communityFields.tags = tags;
  if (likes) communityFields.likes = likes;
  else communityFields.likes = [];
  if (dislikes) communityFields.likes = dislikes;
  else communityFields.dislikes = [];
  if (comments) {
    communityFields.comments = comments;
  } else communityFields.comments = [];
  if (datePosted) communityFields.datePosted = datePosted;

  if (!id) id = new mongoose.mongo.ObjectID();

  try {
    // Using upsert option (creates new doc if no match is found):
    let communityPost = await Community.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: communityFields,
      },
      {
        new: true,
        upsert: true,
      }
    );
    console.log("I get Here");
    req.getPoints = "added_updated post"; //allocating points to user after posting a community post
    req.communityPost = communityPost;
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/* -Adding a comment on a community post */
exports.add_community_comment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { comment } = req.body;

  const newComment = {
    user_id: req.user.id,
    comment,
  };

  try {
    let community = await Community.findOne({
      _id: req.params.id,
    })
      .populate("user", ["name", "avatar"])
      .populate("comments.user_id", ["name", "avatar"]);

    community.comments.unshift(newComment);

    await community.save();

    community = await Community.findOne({
      _id: req.params.id,
    })
      .populate("user", ["name", "avatar"])
      .populate("comments.user_id", ["name", "avatar"]);

    await notifications.notifyCommenting(community, req.user.name);

    res.json(community);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/* -liking and unliking on a community post */
exports.community_likes = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  try {
    let community = await Community.findOne({
      _id: req.params.id,
    })
      .populate("user", ["name", "avatar"])
      .populate("comments.user_id", ["name", "avatar"]);

    let g = community.likes.filter(function (id) {
      return id == req.user.id;
    });

    if (g.length > 0) {
      community.likes = community.likes.filter(function (id) {
        return id !== req.user.id;
      });
    } else {
      community.likes.unshift(req.user.id);
      notifications.notifyLiking(community, req.user.name);
    }

    await community.save();

    res.json(community);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/* -liking and unliking on a community post */
exports.community_dislikes = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  try {
    let community = await Community.findOne({
      _id: req.params.id,
    })
      .populate("user", ["name", "avatar"])
      .populate("comments.user_id", ["name", "avatar"]);

    let g = community.dislikes.filter(function (id) {
      return id == req.user.id;
    });

    if (g.length > 0) {
      community.dislikes = community.dislikes.filter(function (id) {
        return id !== req.user.id;
      });
    } else {
      community.dislikes.unshift(req.user.id);
      notifications.notifyDisliking(community, req.user.name);
    }

    await community.save();

    res.json(community);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/*-deleting a comment from a community post by comment id  */
exports.delete_community_comment = async (req, res, next) => {
  try {
    const community = await Community.findOne({
      _id: req.params.community_id,
    })
      .populate("user", ["name", "avatar"])
      .populate("comments.user_id", ["name", "avatar"]);

    community.comments = community.comments.filter(
      (comm) => comm._id.toString() !== req.params.comment_id
    );

    await community.save();
    return res.status(200).json(community);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Server error",
    });
  }
};

/* 
-deleting  post (DELETE method) API community 
-deleting a post based on post id  */
exports.delete_community_post = async (req, res, next) => {
  try {
    const community = await Community.findByIdAndDelete({
      _id: req.params.id,
      user: req.params.user,
    });

    return res.status(200).json(community);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Server error",
    });
  }
};
