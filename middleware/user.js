import multer from "multer";
import path from "path";

const TYPE_IMAGE = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/webp": "webp",
  "image/webm": "webm",
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/");
  },
  filename: (req, file, cb) => {
    // const ext = TYPE_IMAGE[file.mimetype]
    cb(null, Date.now() + uniqid() + path.extname(file.originalname));
  },
});

const user = multer({ storage: storage });

module.exports = user;
