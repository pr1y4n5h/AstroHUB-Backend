const { Likes } = require("../models/likes.model");

const getLikes = async (userid) => await Likes.findOne({ user: userid });

module.exports = {getLikes} 