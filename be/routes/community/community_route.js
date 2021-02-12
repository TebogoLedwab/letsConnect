const express = require('express');
const router = express.Router();
const config = require("config");
const {
    check
} = require('express-validator');
const community_ctrl = require('./community.ctrl');
const authorization = require('./../../middlewares/authorization');
const getPoints = require('../../middlewares/pointing_system');


/* 
- GET method API/community
- Getting community posts from community 
- @access   Private */
router.get('/', community_ctrl.get_all_community_post)

/* 
- POST method API/community
- Adding a community post 
- @access   Private */
router.post(
    '/',
    [
        authorization,
        [
            check('content', 'Content is required')
                .not()
                .isEmpty(),
            check('title', 'Title is required')
                .not()
                .isEmpty()
        ]
    ],
    community_ctrl.create_update_community_post,getPoints
     )

/* 
- PUT method API/community
- Updating  community post 
- @access   Private */
router.put(
    '/',
    [
        authorization
    ],
    community_ctrl.create_update_community_post,getPoints
)

/* 
- PUT method API/community/comments
- Adding comment from community post 
- @access   Private */
router.put(
    '/comments/:id',
    [
        authorization,
        [
            check('comment', 'Comment is required')
                .not()
                .isEmpty()
        ]
    ],
    community_ctrl.add_community_comment
);

/* 
- PUT method API/community/comments
- Adding comment from community post 
- @access   Private */
router.put(
    '/likes/:id',
    authorization,
    community_ctrl.community_likes,getPoints
);

/* 
- PUT method API/community/comments
- Adding comment from community post 
- @access   Private */
router.put(
    '/dislikes/:id',
    authorization,
    community_ctrl.community_dislikes
);

/*
 - DELETE mrthod API/community/comments/:id
 - Delete comment from community post
// @access   Private */
router.delete('/:community_id/comments/:comment_id', authorization, community_ctrl.delete_community_comment);

/*
 - DELETE mrthod API/community/:id
 - Delete community post by id
// @access   Private */
router.delete('/:id', authorization,community_ctrl.delete_community_post);


module.exports = router;