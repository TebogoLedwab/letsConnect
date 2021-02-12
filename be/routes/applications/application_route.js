const express = require('express');
const router = express.Router();
const apply_ctrl = require('./application.ctrl');
const config = require("config");
const {
    check
} = require('express-validator');

const admin_authorization = require('./../../middlewares/admin_authorization');
const authorization = require('./../../middlewares/authorization');


/* 
- POST  method  /apply
- create application
// @access   Private */
router.post('/', authorization, apply_ctrl.add_apply);


/* 
- POST  method  /apply
- create application
// @access   Private */

router.put('/', admin_authorization, apply_ctrl.update_apply);

/*
- @route    GET method /apply
- Getting all applications by users 
- @access   Public */
router.get('/applications', admin_authorization, apply_ctrl.get_all_applications);

/*
- @route    GET method /apply
- Getting all applications by users 
- @access   Public */
router.delete('/:id', admin_authorization, apply_ctrl.delete_application);


module.exports = router;