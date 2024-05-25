const express = require("express");
const path = require("path");
const logger = require("morgan");
const winston = require("./logger").logger;
const fileUpload = require("express-fileupload");


const app = express();

// Enable File uploads
app.use(
  fileUpload({
    createParentPath: true,
    limits: {
      fileSize: 2 * 1024 * 1024 * 1024, //2MB max file(s) size
    },
  })
);

// Initialize logging system
app.use(logger("combined", { stream: winston.stream }));

// Use required parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * * Description - Set directory for views and view engine
 *
 *   @Date - 2023-08-31
 *   @Author - Micheal Ogden
 */

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "public/views"));

// Set view engine

app.set("view engine", "ejs");

/**
 * * Description - ROUTES: VIEWS - Routes for views
 *
 */
app.get("/bio", async (req, res) => {
  res.render("bio", {title: "Wides | Bio", status: 200})
})

app.get("/error", async (req, res) => {
  const err = new Error("This is a test error");
  await res.render("err-page", {
    title: `Error: ${err.status || "error"} || 500`,
    status: err.status || 500,
    msg: err.message || "Internal Server Error",
  });
});

app.get("/", async (req, res) => {
  res.render("home", { title: "Home", status: 200 });
});

// catch 404 and forward to error handler
app.all("*", async (req, res) => {
  res
    .status(404)
    .render("404", { url: req.url, status: 404, msg: "Page not found" });
});

// Server wide error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).render("err-page", {
    title: `Error: ${err.status} || 500`,
    status: err.status,
    msg: err.message,
  });
});

module.exports = app;
