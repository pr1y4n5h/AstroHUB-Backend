const express = require("express");
const router = express.Router();
const { User } = require("../models/user.model");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

router
  .route("/")
  .get(async (req, res) => {
    res.send("This is a login page");
  })

  .post(async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(409).json({
          success: false,
          message: "Please fill complete credentials!",
        });
      }

      const userData = await User.findOne({ username: username });
      if (userData) {
        const isMatched = await bcrypt.compare(password, userData.password);
        if (isMatched) {
          console.log("From Login", req.user)
          const token = jwt.sign(
            { userId: userData._id },
            process.env.API_SECRET,
            { expiresIn: "24h" }
          ); 
          res.status(200).json({
            userData,
            success: true,
            message: "User login successfully!",
            token,
          });
        } else {
          res
            .status(401)
            .json({ success: false, message: "Invalid Credentials!" });
        }
      } else {
        res.status(401).json({
          success: false,
          message: "Please check your credentials again!",
        });
      }
    } catch (err) {
      console.log(err);
    }
  });

module.exports = router;