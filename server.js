// import express
var express = require("express");
require("dotenv").config();

var db = require("./db-connections.js");

// set variable app to be an instance of express
var app = express();

// recognise incoming Request Object from the web client as a JSON Object.
app.use(express.json());

// static files served from public folder
app.use(express.static("./public"));

// Get all products
app.route("/login").get(function (req, res) {
  res.json({ password: "admin123" });
});

// Get all products
app.route("/product").get(function (req, res) {
  var sql =
    "SELECT product.id,product.name, product.description,product.price,product.picture,category.name AS category FROM product JOIN category ON product.category_id = category.id";

  db.query(sql, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

// Get specific product based on id
app.route("/product/:id").get(function (req, res) {
  var sql =
    "SELECT product.id,product.name, product.description,product.price,product.picture,category.name AS category FROM product JOIN category ON product.category_id = category.id WHERE product.id=?";
  var parameter = [req.params.id];

  db.query(sql, parameter, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

// Get products based on category
app.route("/sort").get(function (req, res) {
  var sql =
    "SELECT product.id,product.name, product.description,product.price,product.picture,category.name AS category FROM product JOIN category ON product.category_id = category.id WHERE category.name=?";
  var parameter = [req.query.category];

  db.query(sql, parameter, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

// Search product based on input in search bar
app.route("/search").get(function (req, res) {
  var sql = `SELECT product.id,product.name, product.description,product.price,product.picture,category.name AS category FROM product JOIN category ON product.category_id = category.id WHERE product.name LIKE CONCAT('%', ?, '%')`;

  var parameter = [req.query.keyword];
  db.query(sql, parameter, function (err, result) {
    if (err) throw err;

    res.json(result);
  });
});

// Add product
app.route("/product").post(function (req, res) {
  var sql =
    "INSERT INTO product (name,description,price,category_id,picture) VALUES (?,?,?,?,?)";

  var parameter = [
    req.body.name,
    req.body.description,
    req.body.price,
    req.body.category_id,
    req.body.picture,
  ];

  db.query(sql, parameter, function (err, result) {
    if (err) throw err;
    res.json({ message: "Inserted Successfully", id: result["insertId"] });
  });
});

// Update product
app.route("/product/:id").put(function (req, res) {
  var sql =
    "UPDATE product SET name=?, description=?, price=?, category_id=?, picture=? WHERE id = ?";

  var parameter = [
    req.body.name,
    req.body.description,
    req.body.price,
    req.body.category_id,
    req.body.picture,
    req.params.id,
  ];

  db.query(sql, parameter, function (err, result) {
    if (err) throw err;
    res.send("Updated Successfully!");
  });
});

// Delete product
app.route("/product/:id").delete(function (req, res) {
  var sql = "DELETE FROM product WHERE id = ?";

  var parameter = [req.params.id];

  db.query(sql, parameter, function (err, result) {
    if (err) throw err;
    res.send("Deleted Successfully!");
  });
});

// Get all categories
app.route("/category").get(function (req, res) {
  var sql = "SELECT * FROM category";

  db.query(sql, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

// Get specific category baseed on id
app.route("/category/:id").get(function (req, res) {
  var sql = "SELECT name FROM category WHERE id = ?";

  var parameter = [req.params.id];
  db.query(sql, parameter, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

// start the nodejs to be listening for
// incoming request @ port 8080
app.listen(3000, "127.0.0.1");

console.log("web server running @ http://127.0.0.1:3000"); // output to console
