const express = require("express");
const config = require("config");
const {
  validationResult
} = require("express-validator");
const mongoose = require("mongoose");
const Apply = require("./application.schema");

/*-Apply(GET method) API community  */
exports.update_apply = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }


  const {
    user,
    status,
    dateApplied
  } = req.body;

  // Build apply object
  const applyFields = {};
  if(user)  applyFields.user = user._id;
  if (status) applyFields.status = status;
  else applyFields.status = " ";
  if (dateApplied) applyFields.datePosted = dateApplied;

  try {

    // Using upsert option (creates new doc if no match is found):
    let apply = await Apply.findOneAndUpdate({
      user: applyFields.user
    }, {
      $set: applyFields
    }, {
      new: true,
      upsert: true
    });

    if(apply.status == "Accepted") req.getPoints = "applied"; //allocating points to user after updating profile

    res.status(200).json({
      apply
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};


/*-Apply(POST method) API community  */
exports.add_apply = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }


  let oldApply = await Apply.findOne({
    user: req.user.id
  })

  console.log(oldApply);


  

  if (oldApply) {
    return res.status(400).json({
      errors: [{
        msg: "You've already applied"
      }]
    });
  }

  const apply = Apply({
    user: req.user.id,
    status: "Pending"
  })

  try {

    // Using upsert option (creates new doc if no match is found):
    await apply.save();

    req.getPoints = "applied"; //allocating points to user after updating profile

    res.status(200).json({
      msg: 'Applied Successfully'
    });


  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route    GET /application
// @desc     Get all applications
// @access   Public
exports.get_all_applications = async (req, res) => {
  try {
    const apply = await Apply.find({}).populate('user', ['name', 'avatar']);

    if (!apply) return res.status(400).json({
      msg: 'Applications not found'
    });

    res.json(apply);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

/* 
-deleting  post (DELETE method) API community 
-deleting a post based on post id  */
exports.delete_application = async (req, res, next) => {
  try {

    await Apply.findByIdAndDelete({
      _id: req.params.id
    });

    return res.status(200).json({
      msg: "Application Deleted"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: 'Server error'
    });
  }
}