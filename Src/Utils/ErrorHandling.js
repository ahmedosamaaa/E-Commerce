import cloudinary from "./CloudinaryConfig.js";

export const errorHandling = (API) => {
  return (req, res, next) => {
    API(req, res, next).catch(async(err) => {
      console.log(err);
      console.log(req.imagePath);
      if(req.imagePath){
        //deleteFiles
        await cloudinary.api.delete_resources_by_prefix(req.imagePath);
        //deleteFolder
        await cloudinary.api.delete_folder(req.imagePath);
      }
      return next(new Error("Fail"));
    });
  };
};
export const globalResponse = (err, req, res, next) => {
  if (err) {
    if(req.validationErrorArr){
      return res.status(err["cause"] || 400).json({ message: req.validationErrorArr });
    }
    console.log(err);
    return res.status(err["cause"] || 500).json({ message: err.message });
  }
};
