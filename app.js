const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");
const config = require("./config/database");

// connect to database
mongoose.connect(config.database);

mongoose.connection.on("connected", () => {
  console.log("connected to database " + config.database);
})

mongoose.connection.on("error", (error) => {
  console.error(error)
})
const app = express();

const user = require("./routes/user");

const port = process.env.PORT || 3000;

//set static folders
app.use(express.static("public"));

// SET UP MIDDLEWARES
//what cors does is that it allows us to make a request to our api
//from a different domain name
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport")(passport);
//set the route
app.use("/user", user);

app.get("/", (req, resp) => {
  resp.send("invalid endpoint 1");
});

app.get('*', (req, resp)=> {
  resp.sendFile(path.resolve(__dirname, 'public', 'index.html'));
})

app.listen(port, (err)=>{
  if(err) {
    console.error(err);
    return false;
  }

  console.log("Server running on port " + port);
})
