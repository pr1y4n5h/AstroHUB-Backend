const express = require('express');
const router = express.Router();
const { getPlaylist } = require("../utils/playlist.fetch")
const { Playlist } = require("../models/playlist.model");
const { authenticateUser } = require("../middleware/authenticate");

router.use(authenticateUser);

const addToPlaylist = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { playlist } = req.body;
    const playlistExists = await Playlist.findOne({ user: userId });
    if (playlistExists) {
      await Playlist.findOneAndUpdate({user:userId}, { $push: { playlist: playlist } }
      );
      return next()
    } else {
      const NewPlaylist = new Playlist({ user: userId, playlist });
      await NewPlaylist.save();
      return next()
    }
  } catch (error) {
    console.log(error);
  }
}

// create and get initial playlist
router.route("/")
  .get(async (req, res) => {
    try {
      const { userId } = req.user;
      const data = await getPlaylist(userId);
      if(data){
        res.status(200).json({ success: true, playlistData: data })
      }else{
         res.status(400).json({ message:"Playlist not created yet" })
      }
    }
    catch (error) {
      res.status(500).json({ success: false, message: "Could not fetch data", errorMessage: error.message })
    }
  })
  .post(addToPlaylist, async (req, res) => {
    try {
      const { userId } = req.user;
      const data = await getPlaylist(userId);
      res.status(201).json({ success: true, playlistData: data })
    } catch (error) {
      res.status(500).json({ success: false, message: "Unable to add products to Wishlist", errorMessage: error.message })
    }
  })


// playlist management
router.route("/:playlistid")
  .get(async (req, res) => {
    try {
      const { playlistid } = req.params;
      const [data] = await Playlist.find({ "playlist._id": playlistid }, {
        playlist: {
          $elemMatch: {
            _id: playlistid
          }
        }
      })
      res.status(200).json({ success: true, playlistData: data })
    } catch (error) {
      res.status(500).json({ success: false, message: "Unable to create new playlist", errorMessage: error.message })
    }
  })
  .post(async (req, res) => {
    try {
      const { playlistid } = req.params;
      const { videos } = req.body;
      const { userId } = req.user;
      await Playlist.updateOne({ "user": userId, "playlist._id": playlistid }, { "$addToSet": { "playlist.$.list": videos } });
      const data = await getPlaylist(userId);
      res.status(201).json({ success: true, playlistData: data })
    } catch (error) {
      res.status(500).json({ success: false, message: "Unable to create new playlist", errorMessage: error.message })
    }
  })
  .delete(async (req, res) => {
    try {
      const { playlistid } = req.params;
      const { userId } = req.user;
      console.log(playlistid,userId)
      await Playlist.findOneAndUpdate({user:userId}, { $pull: { playlist: { _id: playlistid } } }
      );
      const data = await getPlaylist(userId);
      res.status(200).json({ success: true, playlistData: data })
    } catch (error) {
      res.status(500).json({ success: false, message: "Unable to create new playlist", errorMessage: error.message })
    }
  })


router.route("/:playlistid/:videoid")
  .delete(async (req, res) => {
    try {
      const { playlistid, videoid } = req.params;
      const { userId } = req.user;
      await Playlist.updateOne({ "user": userId, "playlist._id": playlistid }, { "$pull": { "playlist.$.list": { "_id": videoid } } });
      const data = await getPlaylist(userId);
      res.status(201).json({ success: true, playlistData: data })
    } catch (error) {
      res.status(500).json({ success: false, message: "Unable to create new playlist", errorMessage: error.message })
    }
  })

module.exports = router;