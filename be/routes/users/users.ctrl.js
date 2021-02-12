const express = require("express");
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require("config");
const {
    validationResult
} = require('express-validator');
const User = require('../users/users.schema');
const Profile = require('../profiles/profiles.schema');
const mail = require('../../middlewares/mailsender')


/*
-adding new user (POST method )
-checking if user already exist 
-attributes to be checked username descrbed as name
- email and password, valid email that the user will use to login with the correct password     
 */
exports.add_user = async (req, res) => {


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        name,
        email,
        password,
        age,
        gender,
        mobile_number
    } = req.body;

    try {
        // verify if the email used doest not belong to an existing user 
        let user = await User.findOne({
            email
        });

        if (user) {
            return res.status(400).json({
                errors: [{
                    msg: 'User already exists,please use a different email address'
                }]
            });
        }

        // get user gravatar
        const avatar = '';

        // create instance of the user
        user = new User({
            name,
            email,
            avatar,
            password,
            age,
            gender,
            mobile_number,
            confirmed: false
        });

        // encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        //save  the information to profile after registerting
        await user.save(async function (err, user) {
            profile = new Profile({
                user: user.id,
                bio: 'New to connekt',
                status: 'Intern',
                skills: [],
                interests: [],
                experience: [],
                cv: ' ',
                points: 0
            });

            await profile.save();

            // return jsonwebtoken which will be used to access user data 
            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(payload, config.get('jwtSecret'), {
                expiresIn: '1d'
            }, (err, token) => { // the token is set to last atleast a day before it expires
                if (err) throw err;
                else {
                    /* send email */
                    mail.sendMail(user.email, token)
                    res.json({
                        msg: "Please confirm you email address"
                    });
                }

            });

        });



    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
}

exports.update_user = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        name,
        email,
        age,
        gender,
        mobile_number,
        avatar,
        backgroundImage,
        password,
        oldPass,
        newPass
    } = req.body;

    try {
        /* Get Old User */
        let oldUser = await User.findById(req.user.id);

        if (oldPass && newPass) {
            /* Compare Old Password with User Password */
            if (!bcrypt.compareSync(oldPass, oldUser.password)) {
                res.status(400).json({
                    msg: 'Invalid Old Password'
                });
            }
        }

        let userFields = {};
        if (name) userFields.name = name;
        if (email) userFields.email = email;
        if (avatar) userFields.avatar = avatar; else userFields.avatar = '';
        if (backgroundImage) userFields.backgroundImage = backgroundImage; else userFields.backgroundImage = '';
        if (password) userFields.password = password;
        if (gender) userFields.gender = gender;
        if (avatar) userFields.avatar = avatar;
        if (age) userFields.age = age;
        if (mobile_number) userFields.mobile_number = mobile_number;
        userFields.date = new Date();
        if (newPass) {
            // encrypt password
            const salt = await bcrypt.genSalt(10);
            userFields.password = await bcrypt.hash(newPass, salt);

        };

        // save user to database (mongoDB)
        let user = await User.findOneAndUpdate({
            _id: req.user.id
        }, {
            $set: userFields
        }, {
            new: true
        }, function (err, us) {

            if (err) {
                console.log(err)
            } else {
                console.log(us);
            }

        });

        res.json(user);

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
}


// @route   Patch /users
// @desc    Updates user
// @access  public