const express = require("express");
const router = express.Router();

const helmet_controller = require("../controllers/helmetController");
const category_controller = require("../controllers/categoryController");
const helmet_instance_controller = require("../controllers/helmetinstanceController");
const multer_controller = require("../controllers/multercontroller");
const helmet = require("../models/helmet");
const category = require("../models/category");

// Fetch Category Data for sidebar
router.use(category_controller.category_list_middleware);

/// HELMET ROUTES ///

// GET Home page
router.get("/", helmet_controller.index);

// GET Create Helmet
router.get("/helmet/create", helmet_controller.helmet_create_get);

// POST Create Helmet
router.post("/helmet/create", helmet_controller.helmet_create_post);

// GET Delete Helmet
router.get("/helmet/:id/delete", helmet_controller.helmet_delete_get);

// POST Delete Helmet
router.post("/helmet/:id/delete", helmet_controller.helmet_delete_post);

// GET Update Helmet
router.get("/helmet/:id/update", helmet_controller.helmet_update_get);

// POST Update Helmet
router.post("/helmet/:id/update", helmet_controller.helmet_update_post);

// Get request for viewing one helmet
router.get("/helmet/:id", helmet_controller.helmet_detail);

/// CATEGORY ROUTES ///

// Get Request for creating Category
router.get("/category/create", category_controller.category_create_get);

// POST Request for creating Category
router.post("/category/create", category_controller.category_create_post);

// Get Request for deleting category
router.get("/category/:id/delete", category_controller.category_delete_get);

// Post Request for deleting category
router.post("/category/:id/delete", category_controller.category_delete_post);

// Get request for updating category
router.get("/category/:id/update", category_controller.category_update_get);

// Post request for updating category
router.post("/category/:id/update", category_controller.category_update_post);

// Get request for viewing helmets in one category
router.get("/category/:id", category_controller.category_specific_get);

// GET request for viewing all the helmets
router.get("/categories", category_controller.category_all_get);

/// HELMET INSTANCES ROUTES ///

// GET request for creating helmet instance
router.get(
  "/helmetinstance/create/:id",
  helmet_instance_controller.helmetinstance_create_get,
);
router.get(
  "/helmetinstance/create",
  helmet_instance_controller.helmetinstance_create_get,
);
// POST request for creating helmet instance
router.post(
  "/helmetinstance/create/:id",
  helmet_instance_controller.helmetinstance_create_post,
);
router.post(
  "/helmetinstance/create",
  helmet_instance_controller.helmetinstance_create_post,
);

// GET request for deleting helmet instance
router.get(
  "/helmetinstance/:id/delete",
  helmet_instance_controller.helmetinstance_delete_get,
);
// POST request for deleting helmet instance
router.post(
  "/helmetinstance/:id/delete",
  helmet_instance_controller.helmetinstance_delete_post,
);
// GET request for updating helmet instance
router.get(
  "/helmetinstance/:id/update",
  helmet_instance_controller.helmetinstance_update_get,
);
// POST request for updating helmet instance
router.post(
  "/helmetinstance/:id/update",
  helmet_instance_controller.helmetinstance_update_post,
);
// GET request for viewing one Helmet instance
router.get(
  "/helmetinstance/:id",
  helmet_instance_controller.helmetinstance_detail,
);

module.exports = router;
