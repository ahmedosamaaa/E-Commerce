import multer from "multer";
import { allowedExtensions } from "../Utils/allowExtentions.js";

export const multerCloudFunction = (allowedExtensionsArr) => {

  if(!allowedExtensionsArr){
  allowedExtensionsArr=allowedExtensions.image
}

  // ================= storage =======================
  const storage = multer.diskStorage({});

  // ==================== FileFilter ===============
  const fileFilter = function (req, file, cb) {
    console.log(file.mimetype);
    if (allowedExtensionsArr.includes(file.mimetype)) {
      return cb(null, true);
    }
    cb(new Error("invalid extension"), false);
  };

  const fileUpload = multer({
    fileFilter,
    storage: storage,
  });
  return fileUpload;
};
