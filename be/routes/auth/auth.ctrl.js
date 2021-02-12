const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const {
  validationResult
} = require("express-validator");
const User = require('../users/users.schema');
const Admin = require('../admin/admin.schema');
const mail = require('../../middlewares/mailsender')

//Checks the route GET/auth
//Gets the user by a token
//Access to this route is private
exports.get_user_by_token = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};



//Checks the route POST/auth
//Authenticates the user and get token
//Access to this route is public
exports.user_login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  const {
    email,
    password
  } = req.body;

  try {
    // Checks if user exists
    let user = await User.findOne({
      email
    });
    if (!user) {
      return res.status(400).json({
        errors: [{
          msg: "Invalid Credentials"
        }]
      });
    }

    // Checks if password match
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({
          errors: [{
            msg: "Invalid Credentials"
          }]
        });
    }

    const payload = {
      user: {
        id: user.id,
        name: user.name
      }
    };

    //check if user is confirmed
    // if (!user.confirmed) {
    //   return res
    //     .status(400)
    //     .json({
    //       errors: [{
    //         msg: "Please verify your email address"
    //       }]
    //     });
    // }

    //If the email and password matches ,it returns the unique token and user details
    jwt.sign(
      payload,
      config.get("jwtSecret"), {
        expiresIn: 360000
      },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            name: user.name,
            surname: user.surname,
            email: user.email,
            avatar: user.avatar,
            id: user.id
          }
        });
      }
    );


    req.getPoints = 'Log In'; // allocating points to user after logging in 
    req.user = user;
    next()

    jwt.sign(
      payload,
      config.get("jwtSecret"), {
        expiresIn: 360000
      },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            id: user.id

          }
        });
      }
    );
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
};



exports.verify_token = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  const {
    token
  } = req.body;

  try {



    let user = await User.findById(req.user.id);

    user.isConfirmed = true;

    console.log(user);

    // save user to database (mongoDB)
    let newUser = await User.findOneAndUpdate({
      _id: user.id
    }, {
      $set: {
        confirmed: true
      }
    }, {
      new: true
    }, function (err, us) {

      if (err) {
        console.log(err)
      } else {
        console.log(us);
      }

    });

    res.status(200).send({
      msg: `Your account has been verified. You can now login ${user.name}`,
      user: {
        name: newUser.name,
        avatar: newUser.avatar,
        gender: newUser.gender,
        email: newUser.email,
        mobile_number: newUser.newUser
      },
      token: token
    })

  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }

}

exports.reset_password = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  const {
    email
  } = req.body;

  try {


    let user = await User.findOne({
      email: email
    });

    if (!user) {
      return res
        .status(400)
        .json({
          errors: [{
            msg: "This email does not exist on our database"
          }]
        });
    }

    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=";
    let randPass = "";

    for (var i = 0, n = charset.length; i < 8; ++i) {
      randPass += charset.charAt(Math.floor(Math.random() * n));
    }

    const salt = await bcrypt.genSalt(10);
    let newPassword = await bcrypt.hash(randPass, salt);

    // save user to database (mongoDB)
    let newUser = await User.findOneAndUpdate({
      _id: user.id
    }, {
      $set: {
        password: newPassword
      }
    }, {
      new: true
    }, function (err, us) {

      if (err) {
        console.log(err)
      } else {
        console.log(us);
      }

    });

    await mail.resetPassword(email, randPass);

    res.status(200).send({
      msg: `A new password has been sent to the E-mail: ${email}. Use it to login`,
    })

  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }

}


//Checks the route POST/auth
//Authenticates the admin and get token
//Access to this route is public
exports.admin_login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  const {
    email,
    password
  } = req.body;

  try {

    // Checks if user exists
    let admin = await Admin.findOne({
      email
    });

    if (!admin) {
      return res.status(400).json({
        errors: [{
          msg: "Invalid Credentials"
        }]
      });
    }

    // Checks if password match
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({
          errors: [{
            msg: "Invalid Credentials"
          }]
        });
    }

    const payload = {
      admin: {
        id: admin.id
      }
    };


    //If the email and password matches ,it returns the unique token and user details
    jwt.sign(
      payload,
      config.get("jwtSecret"), {
        expiresIn: 360000
      },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          admin: {
            name: admin.name,
            email: admin.email,
            id: admin.id
          }
        });
      }
    );

  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
};