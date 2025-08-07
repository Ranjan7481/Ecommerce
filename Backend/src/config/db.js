const mongoose = require("mongoose")

const connectDB = async () =>{

    await mongoose.connect( "mongodb+srv://rk4765505:Knb3QJ4YMEZZSjyV@cluster0.etpxc.mongodb.net");
};

module.exports=connectDB;
//Knb3QJ4YMEZZSjyV