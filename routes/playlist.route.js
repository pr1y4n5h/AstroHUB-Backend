const express = require('express');
const router = express.Router();
const { Playlist } = require("../models/playlist.model");

// create and get initial playlist
router.route("/")
  .get(async (req, res) => {
    try {
      const data = Playlist.find({});
      res.status(200).json({ success: true, videoData: data })
    }
    catch (error) {
      res.status(500).json({ success: false, message: "Could not fetch data", errorMessage: error.message })
    }
  })
  .post(async (req, res) => {
    try {
      const playlist = req.body;
      const NewPlaylist = new Playlist(playlist);
      const savePlaylistItem = await NewPlaylist.save();
      res.status(201).json({ success: true, playlistData: savePlaylistItem })
    } catch (error) {
      res.status(500).json({ success: false, message: "Unable to add products to Wishlist", errorMessage: error.message })
    }
  })

// create and get playlist
router.route("/:allPlaylistId")
  .get(async (req, res) => {
    try {
      const { allPlaylistId } = req.params;
      const data = await Playlist.findById(allPlaylistId);
      res.status(200).json({ success: true, playlistData: data })
    } catch (error) {
      res.status(500).json({ success: false, message: "Unable to add products to Wishlist", errorMessage: error.message })
    }
  })
  .post(async (req, res) => {
    try {
      const { allPlaylistId } = req.params;
      const { playlist } = req.body;
      await Playlist.findByIdAndUpdate(allPlaylistId, { $push: { playlist: playlist } });
      const data = await Playlist.findById(allPlaylistId);
      res.status(201).json({ success: true, playlistData: data })
    } catch (error) {
      res.status(500).json({ success: false, message: "Unable to create new playlist", errorMessage: error.message })
    }
  })


// playlist management
router.route("/:allPlaylistId/:playlistId")
  .get(async (req, res) => {
    try {
      const { allPlaylistId, playlistId } = req.params;
      const [data] = await Playlist.find({"playlist._id":playlistId},{playlist:{$elemMatch:{
        _id:playlistId
      }}})
      res.status(200).json({ success: true, playlistData: data })
    } catch (error) {
      res.status(500).json({ success: false, message: "Unable to create new playlist", errorMessage: error.message })
    }
  })
  .post(async (req, res) => {
    try {
      const { allPlaylistId, playlistId } = req.params;
      const { videodata } = req.body;
      await Playlist.updateOne({ "_id": allPlaylistId, "playlist._id": playlistId }, { "$addToSet": { "playlist.$.list": videodata } });
      const data = await Playlist.findById(allPlaylistId);
      res.status(201).json({ success: true, playlistData: data })
    } catch (error) {
      res.status(500).json({ success: false, message: "Unable to create new playlist", errorMessage: error.message })
    }
  })
  .delete(async (req, res) => {
    try {
      const { allPlaylistId, playlistId } = req.params;
      await Playlist.findByIdAndUpdate(allPlaylistId, { $pull: { playlist: { _id: playlistId } } }
      );
      const data = await Playlist.findById(allPlaylistId);
      res.status(200).json({ success: true, playlistData: data })
    } catch (error) {
      res.status(500).json({ success: false, message: "Unable to create new playlist", errorMessage: error.message })
    }
  })


router.route("/:allPlaylistId/:playlistId/:videoId")
  .delete(async (req, res) => {
    try {
      const { allPlaylistId, playlistId, videoId } = req.params;
      await Playlist.updateOne({ "_id": allPlaylistId, "playlist._id": playlistId }, { "$pull": { "playlist.$.list": { "_id": videoId } } });
      const data = await Playlist.findById(allPlaylistId);
      res.status(201).json({ success: true, playlistData: data })
    } catch (error) {
      res.status(500).json({ success: false, message: "Unable to create new playlist", errorMessage: error.message })
    }
  })
  
module.exports = router;