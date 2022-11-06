const Helmet = require("../models/helmet");
const HelmetInstance = require("../models/helmetinstance");
const Category = require("../models/category");
const path = require("path");
const { body, validationResult } = require("express-validator");

const async = require("async");

exports.index = (req, res) => {
  async.parallel(
    {
      helmet_count(callback) {
        Helmet.countDocuments({}, callback);
      },
      helmet_variation_count(callback) {
        HelmetInstance.aggregate([
          {
            $group: {
              _id: null,
              amount: {
                $sum: "$amount",
              },
            },
          },
        ]).exec(callback);
      },
      category_count(callback) {
        Category.countDocuments({}, callback);
      },
    },
    (err, results) => {
      res.render("index", {
        title: "Helmet Inventory",
        error: err,
        data: results,
      });
    },
  );
};

// Display detail page for a specific helmet.
exports.helmet_detail = (req, res) => {
  async.parallel(
    {
      helmet(callback) {
        Helmet.findById(req.params.id).populate("category").exec(callback);
      },
      helmet_instance(callback) {
        HelmetInstance.find({ helmet: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.helmet == null) {
        const err = new Error("Helmet not found");
        err.status = 404;
        return next(err);
      } // successful, so render
      console.log(results.helmet_instance);
      res.render("helmet_detail", {
        title: results.helmet.name,
        helmet: results.helmet,
        helmet_instances: results.helmet_instance,
      });
    },
  );
};

// Display helmet create form on GET.
exports.helmet_create_get = (req, res, next) => {
  res.render("helmet_form", {
    title: "Create Helmet",
  });
};
// Handle helmet create on POST.
exports.helmet_create_post = [
  body("name", "Name must have at least 3 characters.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("price")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Price must be specified")
    .isNumeric()
    .withMessage("Price must be a number"),
  body("description").trim().escape(),
  body("code", "Code must not be empty").trim().isLength({ min: 1 }).escape(),
  body("category").trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const helmet = new Helmet({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      code: req.body.code,
      category: req.body.category,
    });

    if (!errors.isEmpty()) {
      res.render("helmet_form", {
        title: "Create Helmet",
        errors: errors.array(),
        helmet,
      });
    } else {
      helmet.save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect(helmet.url);
      });
    }
  },
];

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
