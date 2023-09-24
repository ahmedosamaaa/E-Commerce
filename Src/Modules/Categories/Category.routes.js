import { Router } from "express";
import { multerCloudFunction } from "../../Services/MulterCloud.js";
import { allowedExtensions } from "../../Utils/allowExtentions.js";
import { errorHandling } from "../../Utils/ErrorHandling.js";
import * as cc from "./Category.controller.js";
import { validationCoreFunction } from "../../MiddleWares/Validation.js";
import * as validators from "./Category.validationSchemas.js";
import subCategoryRouter from "../SubCategories/subCategory.routes.js";
import brandRouter from "../Brands/Brands.routes.js";
import { isAuth } from "../../MiddleWares/Auth.js";
import { systemRules } from "../../Utils/systemRules.js";
import { categoryApisRoles } from "./category.endpoints.js";

const router = Router();

router.use("/:categoryId", subCategoryRouter);
// router.use("/:categoryId/:subCategoryId", brandRouter);

// ==== createCategory ====
router.post(
  "/createCategory",
  isAuth(categoryApisRoles.CREAT_CATEGORY),
  multerCloudFunction(allowedExtensions.image).single("image"),
  validationCoreFunction(validators.createCategorySchema),
  errorHandling(cc.createCategory)
);

// ==== updateCategory ====
router.put(
  "/updateCategory/:categoryId",
  isAuth(categoryApisRoles.UPDATE_CATEGORY),
  multerCloudFunction(allowedExtensions.image).single("image"),
  validationCoreFunction(validators.updateCategorySchema),
  errorHandling(cc.updateCategory),
);

// ==== getAllCategories ====
router.get(
  "/getAllCategories",
  errorHandling(cc.getAllCategories));

// ==== getCategoriesWithSub ====
router.get(
  "/getCategoriesWithSub",
  errorHandling(cc.getCategoriesWithSub));

// ==== deleteCategory ====
router.delete(
  "/deleteCategory",
  isAuth(categoryApisRoles.DELETE_CATEGORY),
  validationCoreFunction(validators.deleteCategorySchema),
  errorHandling(cc.deleteCategory));


export default router;
