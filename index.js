const express = require('express');
const bodyParser = require('body-parser') // for POST
const cors = require('cors')
const mongoose = require("mongoose")

const {apiServerErrors} = require("./middleware/api-server-errors.js")

const {routeNotFound} = require("./middleware/404-page.js")

const app = express();


// Connecting to DB
mongoose.connect("mongodb+srv://priyansh:PriyAnsh@priyansh-cluster.objrz.mongodb.net/inventory?retryWrites=true&w=majority", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
.then(() => console.log("Successfully Connected at", Date()) )
.catch(error => console.error("mongoose connection failed", error))



//Step 3 : To read something from Mongoose, we can use the model we created

// Product.find({}).then(data => console.log(data));

// Using find in our route handler and returning data after reading it from database


// Using save in our route handler and saving the document in the database

// app.post("/products", )

app.use(bodyParser.json());  // for POST
app.use(cors());

const router = require("./product.router.js") // router

app.use("/products", router)  // mounting router on URL
// app.use("/categories", router) 

app.get('/', (req, res) => {
  res.json({ hello: "world" })
});


// This should be the last route >> Don't MOVE
//404 Route handler

app.use(apiServerErrors)
// Don't Move

app.use(routeNotFound)

app.listen(3000, () => {
  console.log('server started');
});