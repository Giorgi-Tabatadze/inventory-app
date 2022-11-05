const Helmet = require("../models/helmet");
const HelmetInstance = require("../models/helmetinstance");
const Category = require("../models/category");
const path = require("path");

const async = require("async");

exports.index = (req, res) => {
  async.parallel(
    {
      helmet_count(callback) {
        Helmet.countDocuments({}, callback);
      },
      helmet_variation_count(callback) {
        HelmetInstances.aggregate([
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
      console.log(req.category_list);
      res.render("index", {
        title: "Helmet Inventory",
        error: err,
        data: results,
        category_list: req.category_list,
      });
    },
  );
};

// Display detail page for a specific helmet.
exports.helmet_detail = (req, res) => {
  async.parallel({
    helmet(callback) {
      Helmet.findById(req.params.id).populate("category").exec(callback);
    },
    helmet_instance(callback) {
      HelmetInstance.find({ helmet: req.params.id }).exec(callback);
    },
  }),
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.helmet == null) {
        const err = new Error("Helmet not found");
        err.status = 404;
        return next(err);
      } // successful, so render
      res.render("helmet_detail", {
        category_list: req.category_list,
        title: results.helmet.name,
        helmet: results.helmet,
        helmet_instances: results.helmet_instance,
      });
    };
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
