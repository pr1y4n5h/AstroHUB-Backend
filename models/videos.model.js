const mongoose = require("mongoose");
const data = require("../data");

//To create DB entries with Mongoose
//Step 1 : Mongoose Schema

const { Schema } = mongoose;
const VideoSchema = new Schema({
      _id: String,
      name: String,
      category: String,
      description: String,
      credits: String
})

//Step 2 : Model creation using schema

const Video = mongoose.model("Video", VideoSchema);

module.exports = {Video};





// async function addToProductsCollection() {
//   try {
//     data.forEach((video) => {
//       const newVideo = new Video(video);
//       const savedVideo = newVideo.save();
//       console.log(savedVideo);
//     });
//   } catch (e) {
//     console.log("Error is", e);
//   }
// }