const express = require('express');
const router = express.Router();
const { Video } = require("../models/videos.model");

router.route("/")
  .get(async (req, res) => {
    try {
      const data = await Video.find({});
      res.status(200).json({ success: true, videoData: data })
    }
    catch (err) {
      res.status(404).json({ success: false, message: "Can't fetch the requested item", errorMessage: err.mesage })
    }
  })
  // .post(async (req, res) => {
  //   try {
  //     const { _id, name, category, description, credits } = req.body;
  //     const videoInDb = await Video.findOne({ _id });
  //     if (videoInDb) {
  //       return res.json({ success: false, message: "Data already Exists" })
  //     }
  //     else {
  //       const newVideo = new Video({ _id, name, category, description, credits });
  //       newVideo.save();
  //       return res.json({ success: true, newVideo });
  //     }
  //   }
  //   catch (err) {
  //     res.json({ success: false, message: "Unable to add data to the server." });
  //   }
  // })

router.route("/:videoId")
  .get(async (req, res) => {
    try {
      const { videoId } = req.params; // To read by id
      const data = await Video.findById(videoId);
      res.status(200).json({ success: true, videoData: data });
    }
    catch (err) {
      res.status(404).json({ success: false, message: "Can't fetch the requested item", errorMessage: err.mesage })
    }
  })

module.exports = router