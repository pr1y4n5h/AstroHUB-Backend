const { Playlist } = require("../models/playlist.model");

const getPlaylist = async (userid) => await Playlist.findOne({user:userid});

module.exports = { getPlaylist }