import express, { json } from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import "dotenv/config";
// import models
import { userModel } from "./models/userModel.js";
import { foodModel } from "./models/foodModel.js";
import { trackingModel } from "./models/trackingModel.js";
import { verifyToken } from "./verifyToken.js";

const secretKey = process.env.SECRET_KEY;
const DBurl = "mongodb+srv://newtrition:9sDVkUm25WBtoCkW@cluster0.lmkutuc.mongodb.net/Newtrition?retryWrites=true&w=majority";
const port = 10000;

// database connection
mongoose
  .connect(DBurl)
  .then((req, res) => {
    console.log("DB Connected Successfully");
  })
  .catch((err) => {
    console.log(err);
  });

// initiating express for endpoints
const app = express();

// middleware to take care of parse and stringify and data chunking in the background with http
app.use(express.json());
app.use(cors());

const frontend = process.env.FRONTEND_URL;

// endpoint for registering new user
app.post(`${frontend}/register`, (req, res) => {
  let user = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    if (!err) {
      bcrypt.hash(user.password, salt, async (err, hashPass) => {
        if (!err) {
          user.password = hashPass;

          try {
            let doc = await userModel.create(user);
            res.status(201).send({ message: "User registered" });
          } catch (err) {
            console.log(err);
            res.status(500).send({ message: "some problem" });
          }
        }
      });
    }
  });
});

// endpoint for login
app.post(`${frontend}/login`, async (req, res) => {
  let userCred = req.body;

  try {
    const user = await userModel.findOne({ email: userCred.email });
    if (user !== null) {
      bcrypt.compare(userCred.password, user.password, (err, success) => {
        if (success == true) {
          jwt.sign({ email: userCred.email }, secretKey, (err, token) => {
            if (!err) {
              res.send({
                message: "Login Successful",
                token: token,
                userid: user._id,
                name: user.name,
              });
            }
          });
          //   res.send({ message: "Login successful" });
        } else {
          res.status(401).send({ message: "Incorrect password" });
        }
      });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Login Problem" });
  }
});

// endpoint to fetch all foods
app.get(`${frontend}/foods`, verifyToken, async (req, res) => {
  try {
    let foods = await foodModel.find();
    res.send(foods);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error Occurred!" });
  }
});

// endpoint to add a food item
app.post(`${frontend}/foods`, verifyToken, async (req, res) => {
  let food = req.body;

  try {
    let doc = await foodModel.create(food);
    res.status(201).send({ message: "Food Added to DB" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "some problem" });
  }
});

// endpoint search food by name
app.get(`${frontend}/foods/:name`, verifyToken, async (req, res) => {
  try {
    // $regex makes a wider relative search returning all similar search results and 'i' makes the search case insensitive
    let foods = await foodModel.find({
      name: { $regex: req.params.name, $options: "i" },
    });
    if (foods.length !== 0) {
      res.send(foods);
    } else {
      res.status(404).send({ message: "food not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Problem finding food" });
  }
});

// endpoint for tracking food + quantity
app.post(`${frontend}/tracking`, verifyToken, async (req, res) => {
  let trackData = req.body;
  try {
    let data = await trackingModel.create(trackData);
    console.log("Tracking route data from server", data);
    res.status(201).send({ message: "food and quantity added" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error Occurred" });
  }
});

// endpoint to fetch all foods eaten by a person
// endpoint to fetch all foods eaten by a person

app.get(`${frontend}/tracking/:userid/:date`, async (req, res) => {
  let userid = req.params.userid;
  let date = new Date(req.params.date);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

  // Format the date with leading zeros using toLocaleDateString
  let strDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  try {
    let foods = await trackingModel
      .find({ userId: userid, eatenDate: strDate })
      .populate("userId")
      .populate("foodId");
    res.send(foods);

    console.log(
      "UserID: ",
      userid,
      "Raw Date: ",
      date,
      "Formatted Date: ",
      strDate,
      "Formatted Foods: ",
      foods
    );
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Some Problem in getting the food" });
  }
});

// starting the server
app.listen(port, () => {
  console.log(`Server up and running on port:, ${port}`);
});
