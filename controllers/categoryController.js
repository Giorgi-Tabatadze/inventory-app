const Category = require("../models/category");
const Helmet = require("../models/helmet");

// Display list of all categorys.
exports.category_list_middleware = (req, res, next) => {
  Category.find({}, "name").exec(function (err, category_list) {
    if (err) {
      return next(err);
    }
    //successful, add categorys to req object
    () => {
      req.category_list = category_list;
    };
    req.category_list = category_list;
    next();
  });
};

//Display all helmets without category
exports.category_all_get = (req, res) => {
  Helmet.find({}).exec(function (err, helmets_list) {
    if (err) {
      return next(err);
    }
    // successful, render list of all helmets
    res.render("helmets_list", {
      title: "List of Helmets",
      error: err,
      data: helmets_list,
      category_list: req.category_list,
    });
  });
};

// Display detail page for a specific category.
exports.category_specific_get = (req, res) => {
  Helmet.find({ category: req.params.id }).exec(function (err, helmets_list) {
    if (err) {
      return next(err);
    }
    // successful, render list of all helmets
    res.render("helmets_list", {
      title: "List of Helmets",
      error: err,
      data: helmets_list,
      category_list: req.category_list,
    });
  });
};

// Display category create form on GET.
exports.category_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: category create GET");
};

// Handle category create on POST.
exports.category_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: category create POST");
};

// Display category delete form on GET.
exports.category_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: category delete GET");
};

// Handle category delete on POST.
exports.category_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: category delete POST");
};

// Display category update form on GET.
exports.category_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: category update GET");
};

// Handle category update on POST.
exports.category_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: category update POST");
};
