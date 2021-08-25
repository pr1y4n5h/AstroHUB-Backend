const mongoose = require("mongoose");
const { Schema } = mongoose;
const { Video } = require("../models/videos.model");


const PlaylistSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  playlist: [{
      name: String, 
      list: { 
        type: Array, 
        videoData: Object 
        }
    }]
})


const Playlist = mongoose.model("Playlist", PlaylistSchema);

module.exports = { Playlist };