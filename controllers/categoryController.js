const Category = require("../models/category");
const Helmet = require("../models/helmet");
const { body, validationResult } = require("express-validator");

// Display list of all categorys.
exports.category_list_middleware = (req, res, next) => {
  Category.find({}).exec(function (err, category_list) {
    if (err) {
      return next(err);
    }
    //successful, add categories to req object
    res.locals.category_list = category_list;
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
    console.log(helmets_list);
    res.render("helmets_list", {
      title: "List of Helmets",
      error: err,
      data: helmets_list,
    });
  });
};

// Display category create form on GET.
exports.category_create_get = (req, res) => {
  res.render("category_form", {
    title: "Create Category",
  });
};

// Handle category create on POST.
exports.category_create_post = [
  body("name", "Category name Should be at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({ name: req.body.name.toLowerCase() });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Create Category",
        category,
        errors: errors.array(),
      });
      return;
    } else {
      Category.findOne({ name: req.body.name }).exec((err, found_category) => {
        if (err) {
          return next(err);
        }
        if (found_category) {
          res.redirect(found_category.url);
        } else {
          category.save((err) => {
            if (err) {
              return next(err);
            }
            res.redirect(category.url);
          });
        }
      });
    }
  },
];

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
