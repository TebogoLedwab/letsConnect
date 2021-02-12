const express = require('express');
const router = express.Router();
const {
    check
} = require('express-validator');
const auth_ctrl = require('./auth.ctrl');
const authorization = require('./../../middlewares/authorization');
const getPoints = require('../../middlewares/pointing_system');

//Checks the route GET/auth
//Gets the user by a token
//Access to this route is private
router.get('/', authorization, auth_ctrl.get_user_by_token);


//Checks the route POST/auth
//Authenticates the user and get token
//Access to this route is public
router.post('/',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ], auth_ctrl.user_login, getPoints);



//Checks the route POST/auth/verify
//Veirfies user's email address
//Access to this route is public
router.post('/verify', authorization,
    [
        check('token', 'Token is required').exists()
    ], auth_ctrl.verify_token);


//Checks the route POST/auth/verify
//Resets user password
//Access to this route is public
router.post('/passwordReset',
    [
        check('email', 'Email is required').exists()
    ], auth_ctrl.reset_password);


//Checks the route POST/auth
//Authenticates the admin and get token
//Access to this route is public
router.post('/admin', 
[
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], auth_ctrl.admin_login);

module.exports = router;