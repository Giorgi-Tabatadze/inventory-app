const Helmet = require("../models/helmet");
const HelmetInstance = require("../models/helmetinstance");
const Category = require("../models/category");
const path = require("path");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const fs = require("fs");

const multerController = require("../controllers/multercontroller");
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
  (req, res, next) => {
    multerController.upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          req.fileUploadError = { msg: "exeeded file size limit" };
        }
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          req.fileUploadError = { msg: "File type is not accepted" };
        }
      } else if (err) {
        return next(err);
      }
      next();
    });
  },

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

    const errorsArray = errors.array();
    if (req.fileUploadError) errorsArray.push(req.fileUploadError);
    const helmet = new Helmet({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      code: req.body.code,
      category: req.body.category,
      photo: req.file != undefined ? req.file.filename : undefined,
    });

    if (!errors.isEmpty() || req.fileUploadError) {
      res.render("helmet_form", {
        title: "Create Helmet",
        errors: errorsArray,
        helmet,
      });
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) return next(err);
        });
      }
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
exports.helmet_delete_get = (req, res, next) => {
  async.parallel(
    {
      helmet(callback) {
        Helmet.findById(req.params.id).populate("category").exec(callback);
      },
      helmet_instances(callback) {
        HelmetInstance.find({ helmet: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.helmet == null) {
        res.redirect("/catalog/categories");
      }
      res.render("helmet_delete", {
        title: "Delete Helmet",
        helmet: results.helmet,
        helmet_instances: results.helmet_instances,
      });
    },
  );
};

// Handle helmet delete on POST.
exports.helmet_delete_post = [
  body("password", "incorrect password!")
    .trim()
    .isLength({ min: 1, max: 20 })
    .equals("123")
    .escape(),
  body("helmet_id").trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    async.parallel(
      {
        helmet(callback) {
          Helmet.findById(req.body.helmet_id)
            .populate("category")
            .exec(callback);
        },
        helmet_instances(callback) {
          HelmetInstance.find({ helmet: req.body.helmet_id }).exec(callback);
        },
      },
      (err, results) => {
        if (err) {
          return next(err);
        }
        if (results.helmet_instances.length > 0 || !errors.isEmpty()) {
          res.render("helmet_delete", {
            title: "Delete Helmet",
            helmet: results.helmet,
            helmet_instances: results.helmet_instances,
            errors: errors.array(),
          });
        } else {
          const photoToDelete = results.helmet.deletePhotoUrl;
          Helmet.findByIdAndRemove(req.body.helmet_id, (err) => {
            if (err) {
              return next(err);
            }
            res.redirect(`/catalog/category/${results.helmet.category[0]._id}`);
            if (photoToDelete) {
              fs.unlink(photoToDelete, (err) => {
                if (err) return next(err);
              });
            }
          });
        }
      },
    );
  },
];

// Display helmet update form on GET.
exports.helmet_update_get = (req, res, next) => {
  Helmet.findById(req.params.id).exec((err, helmet) => {
    if (err) {
      return next(err);
    }
    if (helmet == null) {
      const err = new Error("Helmet not found");
      err.status = 404;
      return next(err);
    }
    res.render("helmet_form", {
      title: "Update Helmet",
      helmet,
    });
  });
};

// Handle helmet update on POST.
exports.helmet_update_post = [
  (req, res, next) => {
    multerController.upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          req.fileUploadError = { msg: "exeeded file size limit" };
        }
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          req.fileUploadError = { msg: "File type is not accepted" };
        }
      } else if (err) {
        return next(err);
      }
      next();
    });
  },

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

    const errorsArray = errors.array();
    if (req.fileUploadError) errorsArray.push(req.fileUploadError);

    Helmet.findById(req.params.id).exec((err, helmet_found) => {
      if (err) {
        return next(err);
      }
      const helmet = new Helmet({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        code: req.body.code,
        category: req.body.category,
        photo: req.file != undefined ? req.file.filename : helmet_found.photo,
        _id: req.params.id,
      });

      if (!errors.isEmpty() || req.fileUploadError) {
        res.render("helmet_form", {
          title: "Update Helmet",
          errors: errorsArray,
          helmet,
        });
        if (req.file) {
          fs.unlink(req.file.path, (err) => {
            if (err) return next(err);
          });
        }
      } else {
        Helmet.findByIdAndUpdate(req.params.id, helmet, (err, thehelmet) => {
          if (err) {
            return next(err);
          }
          res.redirect(thehelmet.url);
          if (helmet_found.deletePhotoUrl && req.file) {
            fs.unlink(helmet_found.deletePhotoUrl, (err) => {
              if (err) return next(err);
            });
          }
        });
      }
    });
  },
];
