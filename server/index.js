const mongoose = require("mongoose");
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
//  middleware for parsing json objects - eg; able to acess req.body
app.use(bodyParser.json());

// middleware for parsing bodies from URL
app.use(bodyParser.urlencoded({ extended: true }));

//Environment variables
//https://www.twilio.com/blog/working-with-environment-variables-in-node-js-html
if (process.env.NODE_ENV !== "production") {
    //We don't need dotenv when in production
    require("dotenv").config();
}
console.log("NODE_ENV", process.env.NODE_ENV);
//Connect to database
mongoose.connect(process.env.mongoURI, { useNewUrlParser: true });

//Models
require("./models/Artists");
//Routes
require("./routes/artistRoutes")(app);

const PORT = process.env.PORT || 5000;

//Production
if (process.env.NODE_ENV === "production") {
    console.log("I'M IN PRODUCTION");
    //If Express recognize the route:
    // Express will serve up production assets
    // like our build/main.js file, or build/main.css file
    app.use(express.static("client/build"));

    // if Express does NOT recognize the route
    // (i.e react's routers' route rather than express's route)
    // Express will serve up the index.html file
    const path = require("path");
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

app.listen(PORT);
