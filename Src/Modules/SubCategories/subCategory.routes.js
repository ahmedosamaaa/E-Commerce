import { Router } from "express";
import * as sc from "../SubCategories/subCategory.controller.js";
import { multerCloudFunction } from "../../Services/MulterCloud.js";
import { allowedExtensions } from "../../Utils/allowExtentions.js";
import { validationCoreFunction } from "../../MiddleWares/Validation.js";
// import brandRouter from "../Brands/Brands.routes.js";
import * as validators from "./subCategory.validationSchemas.js";
import { errorHandling } from "../../Utils/ErrorHandling.js";
import { isAuth } from "../../MiddleWares/Auth.js";
import { subCategoryApisRoles } from "./subCategory.endpoints.js";
const router = Router({ mergeParams: true });

// router.use(":/subCategoryId", brandRouter);

//===== createSubCategory ====
router.post(
  "/createSubCategory",
  isAuth(subCategoryApisRoles.CREAT_SUB_CATEGORY),
  multerCloudFunction(allowedExtensions.image).single("image"),
  validationCoreFunction(validators.createSubCategorySchema),
  errorHandling(sc.createSubCategory)
);

//===== updateSubCategory =====
router.put(
  "/updateSubCategory",
  isAuth(subCategoryApisRoles.UPDATE_SUB_CATEGORY),
  multerCloudFunction(allowedExtensions.image).single("image"),
  validationCoreFunction(validators.updateSubCategorySchema),
  errorHandling(sc.updateSubCategory),
);

//===== deleteSubCategory =====
router.delete(
  "/deleteSubCategory",
  isAuth(subCategoryApisRoles.DELETE_SUB_CATEGORY),
  validationCoreFunction(validators.deleteSubCategorySchema),
  errorHandling(sc.deleteSubCategory)
);

//===== getAllSubCategories =====
router.get(
  "/getAllSubCategories", 
  errorHandling(sc.getAllSubCategories)
);
export default router;
