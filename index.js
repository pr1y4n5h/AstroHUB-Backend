const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser'); // for POST
const cors = require('cors')
const { initializeDBConnection } = require("./db/db.connect.js")
const {apiServerErrors} = require("./middleware/api-server-errors.js")
const {routeNotFound} = require("./middleware/404-page.js")
const PORT = 3000 || 4000

const app = express();
app.use(express.json());  // for POST
app.use(cors());
initializeDBConnection();

app.get('/', (req, res) => {
  res.send('Welcome to the AstroVids API!')
});

// mounting router on URL
app.use("/videos", require("./routes/videos.route"));
app.use("/playlists",require("./routes/playlist.route"));
app.use("/likes", require("./routes/likes.route"));
app.use("/watchlater", require("./routes/watchlist.route"));
app.use("/sign-up", require("./routes/user.route"))
app.use("/login", require("./routes/login.route"))

// Error Handler
app.use(apiServerErrors)
app.use(routeNotFound)

app.listen(PORT, () => {
  console.log(`Astromart API listening on port ${PORT}!`);
});