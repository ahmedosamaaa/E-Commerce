import { Router } from "express";
import * as bc from "./Brands.controller.js";
import { errorHandling } from "../../Utils/ErrorHandling.js";
import { multerCloudFunction } from "../../Services/MulterCloud.js";
import { allowedExtensions } from "../../Utils/allowExtentions.js";
import { isAuth } from "../../MiddleWares/Auth.js";
import { validationCoreFunction } from "../../MiddleWares/Validation.js";
import * as validators from "./Brands.validationSchemas.js"
import { brandApisRoles } from "./Brands.endpoints.js";
const router = Router({ mergeParams: true });


// ===== creatBrand ======
router.post(
  "/createBrand",
  isAuth(brandApisRoles.CREAT_BRANDS),
  multerCloudFunction(allowedExtensions.image).single("logo"),
  validationCoreFunction(validators.createBrandSchema),
  errorHandling(bc.createBrand)
);

// ===== updateBrand ======
router.put(
  "/updateBrand",
  isAuth(brandApisRoles.UPDATE_BRANDS),
  multerCloudFunction(allowedExtensions.image).single("logo"),
  validationCoreFunction(validators.updateBrandSchema),
  errorHandling(bc.updateBrand)
);

// ===== deleteBrand ======
router.delete(
  "/deleteBrand",
  isAuth(brandApisRoles.DELETE_BRANDS),
  validationCoreFunction(validators.deleteBrandSchema),
  errorHandling(bc.deleteBrand)
);

//====== getBrands =====
router.get(
  "/getBrands", 
  errorHandling(bc.getBrands)
);

export default router;
