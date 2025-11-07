import multer from "multer";
import path from "path";
import fs from "fs";

// Create uploads directory if not exists
const uploadDir = "uploads/offer_letters";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${req.params.studentId}_${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

// File filter - allow only pdf, jpg, png
const fileFilter = (req, file, cb) => {
  const allowedTypes = [".pdf", ".jpg", ".jpeg", ".png"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedTypes.includes(ext)) {
    return cb(new Error("Only PDF, JPG, or PNG files are allowed"));
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

export default upload;
