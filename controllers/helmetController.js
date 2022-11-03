const Helmet = require("../models/helmet");
const path = require("path");

exports.index = (req, res) => {
  res.render("index", {
    title: "Statistics Page",
    imgLink: path.join("../images/c91.jpeg"),
  });
};

// Display list of all helmets.
exports.helmet_list = (req, res) => {
  res.send("NOT IMPLEMENTED: helmet list");
};

// Display detail page for a specific helmet.
exports.helmet_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: helmet detail: ${req.params.id}`);
};

// Display helmet create form on GET.
exports.helmet_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: helmet create GET");
};

// Handle helmet create on POST.
exports.helmet_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: helmet create POST");
};

// Display helmet delete form on GET.
exports.helmet_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: helmet delete GET");
};

// Handle helmet delete on POST.
exports.helmet_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: helmet delete POST");
};

// Display helmet update form on GET.
exports.helmet_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: helmet update GET");
};

// Handle helmet update on POST.
exports.helmet_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: helmet update POST");
};
