const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { validateUser } = require("../utils/validate");

const authrouter = express.Router();

const multer = require("multer");
 const storage = multer.memoryStorage();
const upload = multer({ storage }); // correct way


authrouter.post("/signup", upload.single('photo'),async (req, res) => {
  try {
   
     const { isValid, errors } = validateUser(req.body);
     const phtotbase64 = req.file ? req.file.buffer.toString("base64") : null;
    

    if (!isValid) {
      return res.status(400).json({ errors });
    }
    const { FullName, emailId, password, address, age, phone ,role} = req.body;

    const emailExists = await User.findOne({ emailId });

    if (emailExists) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      FullName,
      emailId,
      password: passwordHash,
      address,
      age,
      phone,
      role,
      photo: phtotbase64 ,
    });

   const savedUser= await user.save();

    const token =  savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

  res.json({
  message: "User added successfully!",
  data: {
    _id: savedUser._id,
    FullName: savedUser.FullName,
    emailId: savedUser.emailId,
    address: savedUser.address,
    age: savedUser.age,
    phone: savedUser.phone,
    role: savedUser.role,
    photo: `data:image/jpeg;base64,${savedUser.photo}`, // ⬅️ usable in <img />
  },
});
  } catch (err) {
     res.status(400).send("ERROR : " + err.message);
  }
});

authrouter.post("/login",async (req , res) =>{

  try{

    const {emailId, password} = req.body;  

    const user = await User.findOne({emailId});

    if(!user){

      return res.status(400).json({error: "user not found"});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){

      return res.status(400).json({error: "Invalid credentials"});
    }
    const token = user.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res.json({message: "Login successful", data: user});


  }catch(err){

    res.status(400).send("error :" + err.message);
  }
});


authrouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Successful!!");
});
module.exports = authrouter;
