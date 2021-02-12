const express = require('express');
const router = express.Router();
const config = require("config");
const blog_ctrl = require('./blogs.ctrl');
const {
    check
} = require('express-validator');
const authorization = require('./../../middlewares/authorization');
const getPoints = require('../../middlewares/pointing_system');


/* 
- getting the blogs (GET method /blogs)
*/
router.get('/', blog_ctrl.get_all_blogs);


/* 
- POST  method  /blogs
- Creating  or updating blog
// @access   Private */

router.post(
    '/',
    [
        authorization,
        [

            check('content', 'Content is required')
            .not()
            .isEmpty()
        ]
    ],
    blog_ctrl.create_update_blog, getPoints
);


/* 
- PUT  method  /blogs
- Creating  or updating blog
// @access   Private */
router.put(
    '/:id',
    [
        authorization
    ],
    blog_ctrl.create_update_blog, getPoints
);

/* 
- PUT method API/blogs/likes/:id
- Adding comment from community post 
- @access   Private */
router.put(
    '/likes/:id',
    authorization,
    blog_ctrl.blog_liking
);

/* 
- PUT method API/blogs/dislikes
- Adding comment from community post 
- @access   Private */
router.put(
    '/dislikes/:id',
    authorization,
    blog_ctrl.blog_disliking
);

/* 
- DELETE  method  /blogs
- Creating  or updating blog
// @access   Private */

router.delete('/:id', authorization, blog_ctrl.delete_blog);


module.exports = router;