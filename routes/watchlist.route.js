const express = require("express");
const router = express.Router();
const { Watchlist } = require("../models/watchlist.model");
const { getWatchlist } = require("../utils/watchlist.fetch");
const { authenticateUser } = require("../middleware/authenticate");

router.use(authenticateUser);

const addToWatchlist = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { videos } = req.body;
    const watchlistExist = await getWatchlist(userId);
    if (watchlistExist) {
      await Watchlist.findOneAndUpdate({ user: userId }, { $addToSet: { videos: videos } }
      );
      return next();
    } else {
      const NewWatchlist = new Watchlist({ user: userId, videos });
      await NewWatchlist.save();
      return next()
    }
  } catch (error) {
    console.log(error);
  }
}

router.route("/")
  .get(async (req, res) => {
    try {
      const { userId } = req.user;
      const data = await getWatchlist(userId);
      if (data) {
        res.status(200).json({ success: true, watchlistData: data })
      } else {
        res.status(400).json({ message: "Watch list not created yet" })
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal Server Error", errorMessage: errorMessage.message })
    }
  })
  .post(addToWatchlist, async (req, res) => {
    try {
      const { userId } = req.user;
      const data = await getWatchlist(userId);
      res.status(201).json({ success: true, watchlistData: data })
    } catch (error) {
      res.status(500).json({ success: false, message: "Unable to add videos to Watchlist", errorMessage: error.message })
    }
  })
  .delete(async (req, res) => {
    try {
      const { userId } = req.user;
      await Watchlist.findOneAndRemove({ user: userId })
      res.status(200).json({ success: true })
    } catch (error) {
      res.status(500).json({ success: false, message: "Unable to delete item from Watchlist", errorMessage: error.message })
    }
  })


router.route("/:videoId")
  .delete(async (req, res) => {
    try {
      const { userId } = req.user;
      const { videoId } = req.params;
      await Watchlist.findOneAndUpdate({ user: userId }, { $pull: { videos: { _id: videoId } } }
      );
      const data = await getWatchlist(userId);
      res.status(200).json({ success: true, watchlistData: data })
    } catch (error) {
      res.status(500).json({ success: false, message: "Unable to delete Watchlist", errorMessage: error.message })
    }

  })


module.exports = router;