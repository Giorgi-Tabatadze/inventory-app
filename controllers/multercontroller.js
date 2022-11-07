const path = require("path");
const multer = require("multer");

const MB = 1;
const fileSize = 1000000;

const checkFileType = function (file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) return cb(null, true);
  else cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

exports.upload = multer({
  storage: storage,
  limits: {
    fileSize,
    file: 1,
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) return cb(null, true);
    else {
      cb(null, false);
      req.fileUploadError = { msg: "File type is not accepted" };
    }
  },
}).single("helmet_photo");

exports.upload_helmet_Intance = multer({
  storage: storage,
  limits: {
    fileSize,
    file: 1,
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) return cb(null, true);
    else {
      cb(null, false);
      req.fileUploadError = { msg: "File type is not accepted" };
    }
  },
}).single("helmet_intance_photo");
