const express = require("express");
const {
    validationResult
} = require('express-validator');
const Cohort = require('./cohorts.schema');
const mongoose = require('mongoose');

//Checks the route GET/profile
//Gets users profiles
//Access to this route is private
exports.get_cohorts = async (req, res) => {
    try {

        const cohorts = await Cohort.find({});

        if (!cohorts) {
            return res.status(400).json({
                msg: 'There are no cohorts'
            });
        }

        res.json(cohorts);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}




//Checks the route POST/profile
//Create or update user profile
//Access to this route is private
exports.create_update_cohort = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    let id = req.params.id;

    const {
        name,
        internNumber,
        startDate,
        endDate,
        notes
    } = req.body;


    cohortFields = {};
    if (name) cohortFields.name = name;
    if (internNumber) cohortFields.internNumber = internNumber;
    if (startDate) cohortFields.startDate = startDate;
    if (endDate) cohortFields.endDate = endDate;
    if (notes) cohortFields.notes = notes;

    if (!id) id = new mongoose.mongo.ObjectID();

    try {

        console.log(cohortFields);


        // Using upsert option (creates new doc if no match is found):
        let cohort = await Cohort.findOneAndUpdate({
            _id: id
        }, {
            $set: cohortFields
        }, {
            new: true,
            upsert: true
        });

        res.status(200).send(cohort);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}


/* 
-deleting  post (DELETE method) API community 
-deleting a post based on post id  */
exports.delete_cohort = async (req, res, next) => {
    try {

        await Cohort.findByIdAndDelete({
            _id: req.params.id
        });

        return res.status(200).json({
            msg: 'Cohort Deleted'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: 'Server error'
        });
    }
}