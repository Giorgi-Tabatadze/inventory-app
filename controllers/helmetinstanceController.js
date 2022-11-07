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
        });
        if (req.file) {
          fs.unlink(req.file.path, (err) => {
            if (err) next(err);
            console.log("file deleted");
          });
        }
      });
    } else {
      helmet_instance.save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect(helmet_instance.helmet.url);
      });
    }
  },
];

// Display helmetInstance delete form on GET.
exports.helmetinstance_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: helmetInstance delete GET");
};

// Handle helmetInstance delete on POST.
exports.helmetinstance_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: helmetInstance delete POST");
};

// Display helmetInstance update form on GET.
exports.helmetinstance_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: helmetInstance update GET");
};

// Handle helmetinstance update on POST.
exports.helmetinstance_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: helmetInstance update POST");
};
