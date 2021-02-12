const express = require('express');
const router = express.Router();
const config = require("config");
const {
    check
} = require('express-validator');
const profiles_ctrl = require('./profiles.ctrl');
const authorization = require('./../../middlewares/authorization');
const admin_authorization = require('./../../middlewares/admin_authorization');
const getPoints = require('../../middlewares/pointing_system');
const axios = require('axios');



/* 
- getting the user profile of the current user that has logged in (GET method API/ Profile)
*/
router.get('/me', authorization, profiles_ctrl.get_user_profile);



/* 
- PUT  method  API/profile
- Updating  user profile
// @access   Private */
router.put(
    '/:id',
    [
        admin_authorization,
        [
            check('status', 'Status is required')
            .not()
            .isEmpty(),
            check('bio', 'Bio is required')
            .not()
            .isEmpty()
        ]
    ],
    profiles_ctrl.create_update_profile
);

/* 
- POST  method  API/profile
- Creating  or updating  user profile
// @access   Private */
router.post(
    '/',
    [
        authorization,
        [
            check('status', 'Status is required')
            .not()
            .isEmpty(),
            check('bio', 'Bio is required')
            .not()
            .isEmpty()
        ]
    ],
    profiles_ctrl.create_update_profile,getPoints
);

// @route    POST /profile/pic
// @desc     Submits user profile
// @access   Private
router.post(
    '/pic',
    profiles_ctrl.addImage
);

/*
- @route    GET method /profile
- Getting all user ofiles  who created their profile 
- @access   Public */
router.get('/', profiles_ctrl.get_all_profile);


/* 
- GET method API/profile/user/:user_id
- Getting a specific user profile using the user id 
- @access   Public */

router.get('/user/:user_id', profiles_ctrl.get_profile_per_id);



/* 
- DELETE method  API/profile
- Delete profile, user & posts
// @access   Private */
router.delete('/', authorization, profiles_ctrl.delete_per_token);




/* 
- PUT method API/profile/experience
- Adding work experience  to a user profile 
- @access   Private */
router.put(
    '/experience',
    [
        authorization,
        
    ],
    profiles_ctrl.add_experience,getPoints
);

/* 
- PUT method API/profile/experience
- Adding work experience  to a user profile 
- @access   Private */
router.post(
    '/experience',
    [
        authorization,
        [
            check('title', 'Title is required')
                .not()
                .isEmpty(),
            check('company', 'Company is required')
                .not()
                .isEmpty(),
            check('from', 'From date is required')
                .not()
                .isEmpty()
        ]
    ],
    profiles_ctrl.add_experience,getPoints
);


/*
 - DELETE mrthod API/profile/experience/:exp_id
 - Delete work experience from user profile
// @access   Private */
router.delete('/experience/:exp_id', authorization, profiles_ctrl.delete_experience);

/*
 - DELETE mrthod API/profile/notification/:notification_id
 - Delete work experience from user profile
// @access   Private */
router.delete('/notifications/:notification_id', authorization, profiles_ctrl.delete_notification);

module.exports = router;