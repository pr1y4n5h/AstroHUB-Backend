const mongoose = require("mongoose");

const { Schema } = mongoose;
const VideoSchema = new Schema({
      _id: {
        type: String,
        required: "Video id can't be void",
        unique: true,
        trim: true,
      },

      name: {
        type: String,
        required: "Video name can't be void",
        trim: true,
      },

      category: {
        type: String,
        required: "Category can't be void",
        trim: true,
      },
      
      description: {
        type: String,
        minlength: [100, "Description is too short"]
    },

      credits: {
        type: String,
        required: "Credits can't be void",
        trim: true,
      },
})

const Video = mongoose.model("Video", VideoSchema);

module.exports = {Video};
