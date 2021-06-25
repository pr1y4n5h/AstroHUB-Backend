const mongoose = require("mongoose");
const { Schema } = mongoose;
const { Video } = require("../models/videos.model");


const PlaylistSchema = new Schema({
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