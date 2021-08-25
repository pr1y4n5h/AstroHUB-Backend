const express = require("express");
const router = express.Router();
const { Likes } = require("../models/likes.model");
const { getLikes } = require("../utils/likes.fetch");
const { authenticateUser } = require("../middleware/authenticate");

router.use(authenticateUser);

const addToLikes = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { videos } = req.body;
    const likesExist = await Likes.findOne({ user: userId });
    console.log(likesExist)
    if (likesExist) {
      const myTestData = await Likes.findOneAndUpdate({ user: userId },{ $addToSet: { videos: videos } }, { new: true }
      );
      return next();
    } else {
      const NewLikes = new Likes({user: userId, videos });
      await NewLikes.save();
      return next()
    }
  } catch (error) {
    console.log(error);
  }
}

router.route("/")
  .get(async (req, res) => {
    try {
      const {userId} = req.user;
      console.log("From GET Likes 1", userId)
      console.log("From GET Likes 2", req.user)
      const data = await getLikes(userId);;
      if(data) {
      res.status(200).json({ success: true, likeData: data })}
      else {
      res.status(400).json({ message: "Error in getting Likes!" })
      }
      } catch (err) {
      console.log(err)
      res.status(500).json({ success: false, message: "Internal Server Error", errorMessage: err.message })
    }
  })
  .post(addToLikes, async (req, res) => {
    try {
      const {userId} = req.user;
      const data = await getLikes(userId);
      res.status(201).json({ success: true, likeData: data })
    } catch (err) {
      res.status(500).json({ success: false, message: "Unable to add videos to Likes", errorMessage: err.message })
    }
  })
  .delete(async (req, res) => {
    try {
      const { userId } = req.user;
      console.log("userId", userId);
      await Likes.findOneAndRemove({ user: userId })
      res.status(200).json({ success: true })
    } catch (error) {
      res.status(500).json({ success: false, message: "Unable to delete item from Likes", errorMessage: error.message })
    }
  })

router.route("/:videoId")
  .delete(async (req, res) => {
    try { 
      const { userId } = req.user;
      const { videoId } = req.params;
      await Likes.findOneAndUpdate({ user: userId }, { $pull: { videos: { _id: videoId }}}
      );
      const data = await getLikes(userId);
      res.status(200).json({ success: true, likeData: data })
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Unable to delete Likes", errorMessage: error.message })
    }
  })

module.exports = router;