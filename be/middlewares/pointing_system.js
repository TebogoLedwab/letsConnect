const Profile = require("../routes/profiles/profiles.schema");
const notifications = require("../middlewares/notifications");

module.exports = async function (req, res) {
  let getPoints = req.getPoints;
  let profile = req.profile;

  if (!profile) {
    profile = await Profile.findOne({
      user: req.user.id,
    });
  }

  let lastUpdate = profile.date;
  var currentDate = new Date();

  // get total seconds between two dates
  var dateDiff = (currentDate.getTime() - lastUpdate.getTime()) / 1000;
  
  /*
    - points are allocated once a month when the user atleast :
    - login
    - update profile 
    - post something on the Blog
    - post something on the community 
    - when you comment or answer to any post in the community 
    - when you like a post on the community 
     */

  if (dateDiff > 5) {
    //this date verifies if you get points every month

    if (getPoints == "updateProfile") {
      profile.points += 20;
      profile = await updateProfile(profile, currentDate);

      profile = await notifications.notifyPlusPointing(
        profile.user,
        "Updating Profile",
        "20"
      );

      res.status(200).json(profile);
    }

    if (getPoints == "Log In") {
      profile.points += 10;
      profile = await updateProfile(profile, currentDate);
    }

    if (getPoints == "applied") {
      profile.points += 10;
      profile = await updateProfile(profile, currentDate);
    }

    if (getPoints == "added_updated blog") {
      profile.points += 30;
      profile = await updateProfile(profile, currentDate);

      blogPost = req.blogPost;
    }

    if (getPoints == "added_updated post") {
      console.log("I get Here");

      profile.points += 30;
      profile = await updateProfile(profile, currentDate);

      console.log("I get Here");
      

      profile = await notifications.notifyPlusPointing(profile.user, "Posting to Community", 30);

      communityPost = req.communityPost;

      res.status(200).json(communityPost);
    }

    if (getPoints == "commented") {
      profile.points += 10;
      profile = await updateProfile(profile, currentDate);
    }

    if (getPoints == "liked") {
      for (var i = 0; i < postLike.length; i + 2) {
        //a condition to check if points are allocted for every 2  likes

        profile.points += 10;
      }
    }
  }
};

async function updateProfile(profile, currentDate) {
  //saving allocated points to user profile
  try {
    //Once were done adding points we need to set the last update to now
    profile.date = currentDate;

    await profile.save((err, data) => {
      profile = data;
    });

    return profile;
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Pointing Server Error");
  }
}
