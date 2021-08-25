const { Watchlist } = require("../models/watchlist.model");

const getWatchlist = async (userid) => await Watchlist.findOne({ user: userid });

module.exports = {getWatchlist}