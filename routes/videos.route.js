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