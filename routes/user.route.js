const express = require('express');
const router = express.Router();
const { User } = require("../models/user.model");

router.route("/")
.post(async (req, res) => {
  const {name, username, email, password} = req.body;
  if(!name || !username || !email || !password) {
    return res.status(409).json({success: false, message: "Please fill all the entries!"})
  }

  try {
    const emailExists = await User.findOne({ email: email });
    const userExists = await User.findOne({ username: username })

    if(userExists || emailExists) {
      return res.status(422).json({message: "User already exists"});
    }

    const user = new User({name, username, email, password})
    
    await user.save();
    
    res.status(200).json({success: true, message: "User registered successfully!"});
    
  }
  catch(error) {
    console.log(error);
    res.status(400).json({message: "Error in registering user"})
  }
});


module.exports = router