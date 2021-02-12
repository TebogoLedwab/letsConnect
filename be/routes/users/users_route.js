const express = require("express");
const router = express.Router();
const {
    check
} = require('express-validator');
const authorization = require('./../../middlewares/authorization');
const users_ctrl = require('./users.ctrl');


/*
-adding new user (POST method) API user  
-attributes required to create account name,valid email and password*/
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valide email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({
        min: 6
    })
], users_ctrl.add_user);

//adding new (Post method) API user
//attribute require to create account name,valid email and password

router.put('/',[
    authorization,[
        check('name','Name is required').exists(),
        check('email','Please include a valid email').isEmail(),
        check('password','Please enter a password with 6 or more charecters').isLength({
            min:6
        })
    ]
],users_ctrl.update_user);


module.exports = router;