const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { validateEditProfileData} = require("../utils/validate");
const { userAuth } = require("../middleware/Auth");

const profileRouter = express.Router();
const multer = require("multer");
 const storage = multer.memoryStorage();
const upload = multer({ storage });

profileRouter.get("/profile", userAuth, (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(401).send({ error: +err.message });
  }
});


profileRouter.patch("/profile/update", userAuth,  async (req , res ) => {

   try {

    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;


    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfuly`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
})

module.exports = profileRouter;
