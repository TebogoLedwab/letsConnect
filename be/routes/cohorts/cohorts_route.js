const express = require("express");
const router = express.Router();
const {
    check
} = require('express-validator');
const admin_authorization = require('../../middlewares/admin_authorization');
const cohorts_ctrl = require('./cohorts.ctrl');

/* 
- getting the blogs (GET method /blogs)
*/
router.get('/', admin_authorization , cohorts_ctrl.get_cohorts);

/*
-adding new user (POST method) API user  
-attributes required to create account name,valid email and password*/
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('internNumber', 'Number Of interns is required').not().isEmpty(),
    check('startDate', 'Start Date is required').not().isEmpty(),
    check('endDate', 'End Date is required').not().isEmpty(),
    check('notes', 'Notes is required').not().isEmpty(),
], cohorts_ctrl.create_update_cohort);

//adding new (Post method) API user
//attribute require to create account name,valid email and password
router.put('/:id', [
    admin_authorization, [
        check('name', 'Name is required').not().isEmpty(),
        check('internNumber', 'Number Of interns is required').not().isEmpty(),
        check('startDate', 'Start Date is required').not().isEmpty(),
        check('endDate', 'End Date is required').not().isEmpty(),
        check('notes', 'Notes is required').not().isEmpty(),
    ]
], cohorts_ctrl.create_update_cohort);


/* 
- DELETE  method  /blogs
- Creating  or updating blog
// @access   Private */
router.delete('/:id', admin_authorization, cohorts_ctrl.delete_cohort);


module.exports = router;