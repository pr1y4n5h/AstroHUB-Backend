const mongoose = require("mongoose");
const mySecret = process.env['URI']

function initializeDBConnection() {
mongoose.connect(mySecret , {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
.then(() => console.log("Successfully Connected at", Date()) )
.catch(error => console.error("mongoose connection failed", error))
}

module.exports = { initializeDBConnection }