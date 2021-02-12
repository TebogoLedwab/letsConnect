const express = require('express');
const config = require("config");
const {
    validationResult
} = require('express-validator');
const Profile = require('./profiles.schema');
const User = require('../users/users.schema');
const fs = require('fs');







//Checks the route GET/profile
//Gets users profiles
//Access to this route is private
exports.get_user_profile = async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id

        }).populate('user', ['name', 'avatar', 'email', 'password', 'mobile_number', 'gender', 'age', 'date', 'backgroundImage']);

        if (!profile) {
            return res.status(400).json({
                msg: 'There is no profile for this user'
            });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}




//Checks the route POST/profile
//Create or update user profile
//Access to this route is private
exports.create_update_profile = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        bio,
        status,
        skills,
        interests,
        experience,
        cv,
        points,
        notifications
    } = req.body;

    // Build profile object
    const profileFields = {};
    if (req.user) profileFields.user = req.user.id;
    else if (req.params.id) profileFields.user = req.params.id;

    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (skills) {
        profileFields.skills = skills;
    }else{
        profileFields.skills = [];
    }
    if (interests) {
        profileFields.interests = interests;
    }else{
        profileFields.interests = [];
    }
    if (cv) profileFields.cv = cv;
    else profileFields.cv = " ";
    if (experience) profileFields.experience = experience;
    if (points) profileFields.points = points;
    if (notifications) profileFields.notifications = notifications;



    try {


        // Using upsert option (creates new doc if no match is found):
        let profile = await Profile.findOneAndUpdate({
            user: profileFields.user
        }, {
            $set: profileFields
        }, {
            new: true,
            upsert: true
        });

        req.getPoints = 'updateProfile'; //allocating points to user after updating profile
        req.profile = profile;

        if (req.user) next();
        if (req.admin) res.status(200).send(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}


exports.addImage = async (req, res) => {

    const {
        cv,
    } = req.body;

    console.log("HI")
    console.log(cv);
    console.log(req.body);

    res.json(cv);

}

// @route    GET /profile
// @desc     Get all profiles
// @access   Public
exports.get_all_profile = async (req, res) => {
    try {
        const profile = await Profile.find({}).populate('user', ['name', 'email', 'avatar', 'date', 'age', 'gender']);

        if (!profile) return res.status(400).json({
            msg: 'Profile not found'
        });

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}



// @route    GET /profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
exports.get_profile_per_id = async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate('user', ['name', 'avatar']);

        if (!profile) return res.status(400).json({
            msg: 'Profile not found'
        });

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({
                msg: 'Profile not found'
            });
        }
        res.status(500).send('Server Error');
    }
}




// @route    DELETE /profile
// @desc     Delete profile, user & posts
// @access   Private
exports.delete_per_token = async (req, res) => {
    try {
        // Remove user posts
        await Post.deleteMany({
            user: req.user.id
        });
        // Remove profile
        await Profile.findOneAndRemove({
            user: req.user.id
        });
        // Remove user
        await User.findOneAndRemove({
            _id: req.user.id
        });

        res.json({
            msg: 'User deleted'
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}



// @route    PUT /profile/experience
// @desc     Add profile experience
// @access   Private
exports.add_experience = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({
            user: req.user.id
        });

        profile.experience.unshift(newExp);

        await profile.save();

        req.getPoints = 'updateProfile'; //allocating points to user after updating profile
        req.profile = profile;
        next()

        res.json(profile.experience);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}



// @route    DELETE /profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private
exports.delete_experience = async (req, res) => {
    try {
        const foundProfile = await Profile.findOne({
            user: req.user.id
        });

        foundProfile.experience = foundProfile.experience.filter(
            exp => exp._id.toString() !== req.params.exp_id
        );

        await foundProfile.save();
        return res.status(200).json(foundProfile.experience);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: 'Server error'
        });
    }
}

// @route    DELETE /profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private
exports.delete_notification = async (req, res) => {
    try {
        const foundProfile = await Profile.findOne({
            user: req.user.id
        }).populate('user', ['name', 'avatar', 'email', 'password', 'mobile_number', 'gender', 'age', 'date', 'backgroundImage']);

        foundProfile.notifications = foundProfile.notifications.filter(
            notF => notF._id.toString() !== req.params.notification_id
        );

        await foundProfile.save();
        return res.status(200).json(foundProfile);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: 'Server error'
        });
    }
}