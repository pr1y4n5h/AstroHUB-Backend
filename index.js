const express = require('express');
const mongoose = require("mongoose")
const cors = require('cors')
const { initializeDBConnection } = require("./db/db.connect.js")
const {apiServerErrors} = require("./middleware/api-server-errors.js")
const {routeNotFound} = require("./middleware/404-page.js")


const app = express();
app.use(express.json());  // for POST
app.use(cors());
initializeDBConnection();

// const router = require("./routes/videos.router") // router

// mounting router on URL
app.use("/videos", require("./routes/videos.route"));
app.use("/playlists",require("./routes/playlist.route"));
app.use("/likes", require("./routes/likes.route"));
app.use("/watchlist", require("./routes/watchlist.route"));

app.get('/', (req, res) => {
  res.send('This is AstroVids API')
});

// Error Handler
app.use(apiServerErrors)
app.use(routeNotFound)

app.listen(3000, () => {
  console.log('server started');
});