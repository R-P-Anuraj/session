const express = require("express");
const connectDB = require("./config/db");
const session = require("express-session");
const  userRoutes=require('./routes/userRoutes')
require("dotenv").config();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Configure session
app.use(
  session({
    secret: process.env.secret, //REplace with a secure key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set true in production with HTTPS
  })
);

connectDB();

app.use('/user',userRoutes)

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
