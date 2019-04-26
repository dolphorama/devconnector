const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route GET api/profile/test
// @desc test profile route
// @access public
router.get("/test", (req, res) => res.json({ msg: "Profile works" }));

// @route GET api/profile
// @desc get current user profile
// @access private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "there is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route GET api/profile/all
// @desc get all profiles
// @access public
router.get("/all", (req, res) => {
  const errors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "there are no profiles";
        return res.staus(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => res.status(404).json({ profile: "there is no profiles" }));
});

// @route GET api/profile/handle/:handle
// @desc get profile by handle
// @access public

router.get("/handle/:handle", (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "there is no profile for this user";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route get api/profile/user/:user_id
// @desc get profile by user ID
// @access public

router.get("/user/:user_id", (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "there is no profile for this user";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ profile: "there is no profile for this user" })
    );
});
// @route post api/profile
// @desc create or edit user profile
// @access private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // check validation
    if (!isValid) {
      // return any errors with 400
      return res.status(400).json(errors);
    }
    //    get fields
    const porfileFields = {};
    porfileFields.user = req.id;
    if (req.body.handle) porfileFields.handle = req.body.handle;
    if (req.body.company) porfileFields.company = req.body.company;
    if (req.body.website) porfileFields.website = req.body.website;
    if (req.body.location) porfileFields.location = req.body.location;
    if (req.body.bio) porfileFields.bio = req.body.bio;
    if (req.body.status) porfileFields.status = req.body.status;
    if (req.body.githubusername)
      porfileFields.githubusername = req.body.githubusername;
    // skills spilt into array

    if (typeof req.body.skills !== "undefined") {
      porfileFields.skills = req.body.skills.split(",");
    }
    // social
    porfileFields.social = {};
    if (req.body.youtube) porfileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) porfileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) porfileFields.social.youtube = req.body.youtube;
    if (req.body.linkedin) porfileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) porfileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: porfileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // create

        // check if handle exist
        Profile.findOne({ handle: porfileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "that handle already exists";
            res.status(400).json(errors);
          }
          //   save pro
          new Profile(porfileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);
// @route POST api/experience
// @desc add experience to profile
// @access private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req, body);

    // check validation
    if (!isValid) {
      // return any errors with 400
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        discription: req.body.description
      };

      // add to experience array
      profile.experience.unshift(newExp);

      profile.save().then(profile => res.json(profile));
    });
  }
);

// @route POST api/profile/education
// @desc add education to profile
// @access private

router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req, body);

    // check validation
    if (!isValid) {
      // return any errors with 400
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        discription: req.body.description
      };

      // add to experience array
      profile.education.unshift(newEdu);

      profile.save().then(profile => res.json(profile));
    });
  }
);

// @route DELETE api/profile/experience/:exp_id
// @desc delete experience from profile
// @access private

router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // get remove index
        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id);

        // splice out of array

        profile.experience.splice(removeIndex, 1);

        // save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route DELETE api/profile/education/:edu
// @desc delete education from profile
// @access private

router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // get remove index
        const removeIndex = profile.education
          .map(item => item.id)
          .indexOf(req.params.edu_id);

        // splice out of array

        profile.education.splice(removeIndex, 1);

        // save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);
// @route DELETE api/profile
// @desc delete user from profile
// @access private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() => {
        res.json({ sucess: true });
      });
    });
  }
);
module.exports = router;
