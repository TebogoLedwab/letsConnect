const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require("config");
const {
    validationResult
} = require('express-validator');
const Admin = require('./admin.schema');
const mail = require('../../middlewares/mailsender')



/*
-adding new admin (POST method )
-checking if admin already exist 
-attributes to be checked username descrbed as name
- email and password, valid email that the admin will use to login with the correct password     
 */
exports.add_admin = async (req, res) => {


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        name,
        email,
        password
    } = req.body;

    try {
        // verify if the email used doest not belong to an existing user 
        let admin = await Admin.findOne({
            email
        });

        if (admin) {
            return res.status(400).json({
                errors: [{
                    msg: 'Admin already exists,please use a different email address'
                }]
            });
        }


        // create instance of the admin
        admin = new Admin({
            name,
            email,
            password
        });

        // encrypt password
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(password, salt);

        //save  the information to profile after registerting
        await admin.save(async function (err, admin) {
          

            console.log(admin);

            // return jsonwebtoken which will be used to access user data 
            const payload = {
                admin: {
                    id: admin.id
                }
            };

            jwt.sign(payload, config.get('jwtSecret'), {
                expiresIn: '1d'
            }, (err, token) => { // the token is set to last atleast a day before it expires
                if (err) throw err;
                else {
                    /* send email */
                    mail.sendMail(admin.email, token)
                    res.json({
                        msg: "Admin created"
                    });
                }

            });

        });



    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
}

exports.update_admin = async (req, res) => {

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
        oldPass,
        newPass
    } = req.body;


    try {

        /* Get Old User */
        let oldAdmin = await Admin.findById(req.admin.id);

        if (oldPass && newPass) {
            /* Compare Old Password with User Password */
            if (!bcrypt.compareSync(oldPass, oldAdmin.password)) {
                res.status(400).json({
                    msg: 'Invalid Old Password'
                });
            }
        }

        let adminFields = {};
        if (name) adminFields.name = name;
        if (email) adminFields.email = email;
        if (password) adminFields.password = password;
        if (newPass) {
            // encrypt password
            const salt = await bcrypt.genSalt(10);
            adminFields.password = await bcrypt.hash(newPass, salt);

        };


        // save user to database (mongoDB)
        let admin = await Admin.findOneAndUpdate({
            _id: req.admin.id
        }, {
            $set: adminFields
        }, {
            new: true
        }, function (err, us) {

            if (err) {
                console.log(err)
            } else {
                console.log(us);
            }

        });

        res.json(admin);


    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
}
