const HelmetInstance = require("../models/helmetinstance");
const Helmet = require("../models/helmet");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const fs = require("fs");

const multerController = require("../controllers/multercontroller");
const async = require("async");

// Display list of all helmetInstances.
exports.helmetinstance_list = (req, res) => {
  res.send("NOT IMPLEMENTED: helmetInstance list");
};

// Display detail page for a specific helmetInstance.
exports.helmetinstance_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: helmetInstance detail: ${req.params.id}`);
};

// Display helmetInstance create form on GET.
exports.helmetinstance_create_get = (req, res, next) => {
  Helmet.find().exec(function (err, helmet_list) {
    if (err) {
      return next(err);
    }
    const helmet_instance = { helmet: req.params.id };
    res.render("helmet_instance_form", {
      title: "Create Helmet Instance",
      helmet_list,
      helmet_instance,
    });
  });
};

// Handle helmetInstance create on POST.
exports.helmetinstance_create_post = [
  (req, res, next) => {
    multerController.upload_helmet_Intance(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        console.log(err);

        if (err.code === "LIMIT_FILE_SIZE") {
          req.fileUploadError = { msg: "exeeded file size limit" };
        }
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          req.fileUploadError = { msg: "File type is not accepted" };
        }
      } else if (err) {
        console.log("regular error" + err);
        return next(err);
      }
      next();
    });
  },

  body("size", "Size must be min: 1 character and max: 20 characters long")
    .trim()
    .isLength({ min: 1, max: 20 })
    .escape(),
  body("amount")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("amount must be specified")
    .isNumeric()
    .isInt({ min: 1 })
    .withMessage("Price must be a whole number"),
  body("color", "Color must be min: 1 character and max: 20 characters long")
    .trim()
    .isLength({ min: 1, max: 40 })
    .escape(),
  body("helmet", "Helmet must be selected")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const errorsArray = errors.array();
    if (req.fileUploadError) errorsArray.push(req.fileUploadError);
    const helmet_instance = new HelmetInstance({
      helmet: req.body.helmet,
      amount: req.body.amount,
      size: req.body.size,
      color: req.body.color,
      amount: req.body.amount,
      photo: req.file != undefined ? req.file.filename : undefined,
    });

    if (!errors.isEmpty() || req.fileUploadError) {
      Helmet.find().exec(function (err, helmet_list) {
        if (err) {
          return next(err);
        }
        res.render("helmet_instance_form", {
          title: "Create Helmet Instance",
          helmet_list,
          helmet_instance,
          errors: errors.array(),
        });
        if (req.file) {
          fs.unlink(req.file.path, (err) => {
            if (err) return next(err);
          });
        }
      });
    } else {
      helmet_instance.save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect(`/catalog/helmet/${req.body.helmet}`);
      });
    }
  },
];

// Display helmetInstance delete form on GET.
exports.helmetinstance_delete_get = (req, res, next) => {
  HelmetInstance.findById(req.params.id)
    .populate("helmet")
    .exec(function (err, helmet_instance) {
      if (err) {
        return next(err);
      }
      if (helmet_instance == null) {
        res.redirect("/catalog/categories");
      }
      res.render("helmet_instance_delete", {
        title: helmet_instance.helmet.name,
        helmet_instance,
      });
    });
};

// Handle helmetInstance delete on POST.
exports.helmetinstance_delete_post = [
  body("password", "incorrect password!")
    .trim()
    .isLength({ min: 1, max: 20 })
    .equals("123")
    .escape(),
  body("helmet_intance_id").trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    HelmetInstance.findById(req.body.helmet_intance_id)
      .populate("helmet")
      .exec(function (err, helmet_instance) {
        if (err) {
          return next(err);
        }
        if (!errors.isEmpty()) {
          res.render("helmet_instance_delete", {
            title: helmet_instance.helmet.name,
            helmet_instance,
            errors: errors.array(),
          });
        } else {
          const photoToDelete = helmet_instance.deletePhotoUrl;
          HelmetInstance.findByIdAndRemove(
            req.body.helmet_intance_id,
            (err) => {
              if (err) {
                return next(err);
              }
              res.redirect(`/catalog/helmet/${helmet_instance.helmet._id}`);
              if (photoToDelete) {
                fs.unlink(photoToDelete, (err) => {
                  if (err) return next(err);
                  console.log("file deleted");
                });
              }
            },
          );
        }
      });
  },
];

// Display helmetInstance update form on GET.
exports.helmetinstance_update_get = (req, res, next) => {
  async.parallel(
    {
      helmet_list(callback) {
        Helmet.find().exec(callback);
      },
      helmet_instance(callback) {
        HelmetInstance.findById(req.params.id).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render("helmet_instance_form", {
        title: "Update Helmet Instance",
        helmet_list: results.helmet_list,
        helmet_instance: results.helmet_instance,
      });
    },
  );
};

// Handle helmetinstance update on POST.
exports.helmetinstance_update_post = [
  (req, res, next) => {
    multerController.upload_helmet_Intance(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        console.log(err);

        if (err.code === "LIMIT_FILE_SIZE") {
          req.fileUploadError = { msg: "exeeded file size limit" };
        }
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          req.fileUploadError = { msg: "File type is not accepted" };
        }
      } else if (err) {
        console.log("regular error" + err);
        return next(err);
      }
      next();
    });
  },

  body("size", "Size must be min: 1 character and max: 20 characters long")
    .trim()
    .isLength({ min: 1, max: 20 })
    .escape(),
  body("amount")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("amount must be specified")
    .isNumeric()
    .isInt({ min: 1 })
    .withMessage("Price must be a whole number"),
  body("color", "Color must be min: 1 character and max: 20 characters long")
    .trim()
    .isLength({ min: 1, max: 40 })
    .escape(),
  body("helmet", "Helmet must be selected")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const errorsArray = errors.array();
    if (req.fileUploadError) errorsArray.push(req.fileUploadError);

    async.parallel(
      {
        helmet_list(callback) {
          Helmet.find().exec(callback);
        },
        helmet_instance(callback) {
          HelmetInstance.findById(req.params.id).exec(callback);
        },
      },
      (err, results) => {
        if (err) {
          next(err);
        }
        const helmet_instance = new HelmetInstance({
          helmet: req.body.helmet,
          amount: req.body.amount,
          size: req.body.size,
          color: req.body.color,
          amount: req.body.amount,
          photo:
            req.file != undefined
              ? req.file.filename
              : results.helmet_instance.photo,
          _id: req.params.id,
        });

        if (!errors.isEmpty() || req.fileUploadError) {
          res.render("helmet_instance_form", {
            title: "Update Helmet Instance",
            helmet_list: results.helmet_list,
            helmet_instance,
            errors: errors.array(),
          });
          if (req.file) {
            fs.unlink(req.file.path, (err) => {
              if (err) return next(err);
            });
          }
        } else {
          HelmetInstance.findByIdAndUpdate(
            req.params.id,
            helmet_instance,
            (err, thehelmet_instance) => {
              if (err) {
                return next(err);
              }
              res.redirect(`/catalog/helmet/${thehelmet_instance.helmet}`);
              if (results.helmet_instance.deletePhotoUrl && req.file) {
                fs.unlink(results.helmet_instance.deletePhotoUrl, (err) => {
                  if (err) return next(err);
                });
              }
            },
          );
        }
      },
    );
  },
];
