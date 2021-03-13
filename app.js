require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
const cors = require("cors");
const { aggregate } = require("./models/User");

//Mongoose Setup
mongoose
  .connect(
    "mongodb+srv://Cristhian:M1234567@cluster0.bgzqh.mongodb.net/database?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo", err);
  });

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://ppmanager.herokuapp.com/",
      "https://ppmanager.herokuapp.com/project/create",
      "https://ppmanagers.herokuapp.com/",
    ],
    credentials: true,
  })
);
app.use(express.static("public"));

// Enable authentication using session + passport
//new lineeeeeeee
app.use(
  session({
    secret: "irongenerator",
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);
app.use(flash());
require("./passport")(app);

app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/signup", require("./routes/auth"));
app.use("/login", require("./routes/auth"));
app.use("/profile", require("./routes/index"));
app.use("/project", require("./routes/index"));
app.use("/resource/:resourceId", require("./routes/index"));
app.use("/actions", require("./routes/index"));
app.use("/resourcevis", require("./routes/index"));
app.use("/pricing", require("./routes/index"));
app.use("/product", require("./routes/index"));
app.use("/admin", require("./routes/index"));
app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

module.exports = app;
