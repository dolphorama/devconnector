const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Post = require("../../models/Post");

const Profile = require("../../models/Profile");
// validation
const validatePostInput = require("../../validation/post");

// @route GET api/posts/test
// @desc test post route
// @access public

router.get("/test", (req, res) => res.json({ msg: "posts works" }));

// @route GET api/posts
// @desc test post
// @access public

router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err =>
      res.status(404).json({ nopostsfound: "No posts found with that ID" })
    );
});

// @route GET api/posts/:id
// @desc test post by id
// @access public

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: "No post found with that ID" })
    );
});

// @route Post api/posts
// @desc create posts
// @access private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    // check validation
    if (!isValid) {
      // if any errors, send 400 with errors object
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

// @route DELETE api/posts/:id
// @desc DELETE post
// @access private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // check for post owner
          if (post.user.toString() !== req.user.id) {
            res.status(401).json({ notAuthorized: "user not authorized" });
          }
          // delete
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ postnotfound: "no post found" }));
    });
  }
);

// @route POST api/posts/like/:id
// @desc like post
// @access private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "user already liked this post" });
          }

          // add user id to likes array
          post.likes.unshift({ user: req.user.id });
          // save to db
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: "no post found" }));
    });
  }
);

// @route POST api/posts/unlike/:id
// @desc unlike post
// @access private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "you have not liked this post" });
          }

          // get remove index
          const removeIndex = post.like
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          // splice out of array
          post.likes.splice(removeIndex, 1);
          // save
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: "no post found" }));
    });
  }
);
// @route POST api/posts/comment/:id
// @desc comment on post
// @access private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, iValid } = validatePostInput(req.body);
    // check validation
    if (!isValid) {
      // if any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.bodt.avatar,
          user: req.user.id
        };

        //   add to comments arrary
        post.comments.unshift(newComment);

        // save
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

// @route DElETE api/posts/comment/:id/:comment_id
// @desc delete comment from post
// @access private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, iValid } = validatePostInput(req.body);
    // check validation
    if (!isValid) {
      // if any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        //   check if comment exsist
        if (
          post.comennts.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexist: "Comment does not exist" });
        }

        // GET remove index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        // splice out of array
        post.comments.splice(removeIndex, 1);

        // save
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

module.exports = router;
