const Category = require("../models/category");
const Helmet = require("../models/helmet");
const { body, validationResult } = require("express-validator");

const async = require("async");
const category = require("../models/category");

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
      helmets_list: helmets_list,
    });
  });
};

// Display detail page for a specific category.
exports.category_specific_get = (req, res, next) => {
  async.parallel(
    {
      helmets_list(callback) {
        Helmet.find({ category: req.params.id }).exec(callback);
      },
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.category == null) {
        res.redirect("/catalog/categories");
      }
      res.render("helmets_list", {
        title: results.category.name,
        error: err,
        helmets_list: results.helmets_list,
        category: results.category,
      });
    },
  );
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
exports.category_delete_get = (req, res, next) => {
  async.parallel(
    {
      helmets_list(callback) {
        Helmet.find({ category: req.params.id }).exec(callback);
      },
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.category == null) {
        res.redirect("/catalog/categories");
      }
      res.render("category_delete", {
        title: results.category.name,
        helmets_list: results.helmets_list,
        category: results.category,
      });
    },
  );
};

// Handle category delete on POST.
exports.category_delete_post = [
  body("password", "incorrect password!")
    .trim()
    .isLength({ min: 1, max: 20 })
    .equals("123")
    .escape(),
  body("category_id").trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    async.parallel(
      {
        helmets_list(callback) {
          Helmet.find({ category: req.body.category_id }).exec(callback);
        },
        category(callback) {
          Category.findById(req.body.category_id).exec(callback);
        },
      },
      (err, results) => {
        if (err) {
          return next(err);
        }
        if (results.helmets_list > 0 || !errors.isEmpty()) {
          res.render("category_delete", {
            title: results.category.name,
            helmets_list: results.helmets_list,
            category: results.category,
            errors: errors.array(),
          });
        } else {
          Category.findByIdAndRemove(req.body.category_id, (err) => {
            if (err) {
              return next(err);
            }
            res.redirect("/catalog/categories");
          });
        }
      },
    );
  },
];

// Display category update form on GET.
exports.category_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: category update GET");
};

// Handle category update on POST.
exports.category_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: category update POST");
};
