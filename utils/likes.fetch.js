const express = require("express");
const { Likes } = require("../models/likes.model");

const getLikes = async (likeId)=> await Likes.findById(likeId);

module.exports = {getLikes} 