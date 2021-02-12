const Profile = require('../routes/profiles/profiles.schema')

module.exports.notifyPlusPointing = async function (user, action, points) {

    notification = {
        notificationType: "You got Points!!",
        notification: `You got ${points} points for ${action}`,
        date: Date.now()
    };

    let profile = await Profile.findOne({
        user: user
    }).populate('user', ['name', 'email', 'avatar', 'date', 'age', 'gender']);;

    profile.notifications.unshift(notification);

    await profile.save();

    return profile;
};

module.exports.notifyLiking = async function (post, lastLiker) {

    let message;

    if(post.likes.length >= 2)
        message = `${lastLiker} and ${post.likes.length - 1} others liked your post on ${post.title}`

    else
        message = `${lastLiker} liked your post on ${post.title}`

    notification = {
        notificationType: "People Liked Your Post",
        postId: post._id,
        notification: message,
        date: Date.now()
    };

    let profile = await Profile.findOne({
        user: post.user
    });

    profile.notifications.unshift(notification);

    await profile.save();

    return profile;

};

module.exports.notifyDisliking = async function (post, lastDisliker) {

    let message;

    if(post.dislikes.length >= 2)
        message = `${lastDisliker} and ${post.dislikes.length - 1} others disliked your post on ${post.title}`

    else
        message = `${lastDisliker} disliked your post on ${post.title}`


    notification = {
        notificationType: "People Disliked Your Post",
        postId: post._id,
        notification: message,
        date: Date.now()
    };

    let profile = await Profile.findOne({
        user: post.user
    });

    profile.notifications.unshift(notification);

    await profile.save();

};

module.exports.notifyCommenting = async function (post, lastCommenter) {

    let message;

    if(post.comments.length >= 2)
        message = `${lastCommenter} and ${post.comments.length - 1} others commented on your post about ${post.title}`

    else
        message = `${lastCommenter} commented on your post about ${post.title}`

    notification = {
        notificationType: "People Commented On Your Post",
        postId: post._id,
        notification: message,
        date: Date.now()
    };

    let profile = await Profile.findOne({
        user: post.user
    });

    profile.notifications.unshift(notification);

    await profile.save();

};