const express = require("express");
const router = express.Router();
const {
    check
} = require('express-validator');
const admin_authorization = require('./../../middlewares/admin_authorization');
const admin_ctrl = require('./admin.ctrl');


/*
-adding new user (POST method) API user  
-attributes required to create account name,valid email and password*/
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valide email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({
        min: 6
    })
], admin_ctrl.add_admin);

//adding new (Post method) API user
//attribute require to create account name,valid email and password
router.put('/',[
    admin_authorization,[
        check('name','Name is required').exists(),
        check('email','Please include a valid email').isEmail(),
        check('password','Please enter a password with 6 or more charecters').isLength({
            min:6
        })
    ]
],admin_ctrl.update_admin);


module.exports = router;