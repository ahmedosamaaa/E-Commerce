import { Router } from "express";
const router = Router();
import * as pc from "./Product.controller.js";
import { errorHandling } from "../../Utils/ErrorHandling.js";
import { multerCloudFunction } from "../../Services/MulterCloud.js";
import { allowedExtensions } from "../../Utils/allowExtentions.js";
import * as validators from "../Products/product.validationSchemas.js"
import { validationCoreFunction } from "../../MiddleWares/Validation.js";
import { isAuth } from "../../MiddleWares/Auth.js";
import { productApisRoles } from "./product.endpoints.js";

// ================= createProduct===============
router.post(
  "/createProduct",
  isAuth(productApisRoles.CREAT_PRODUCT),
  multerCloudFunction(allowedExtensions.image).array("images", 3),
  validationCoreFunction(validators.createProductSchhema),
  errorHandling(pc.createProduct)
);

// =============== updateProduct===============
router.put(
  "/updateProduct",
  isAuth(productApisRoles.UPDATE_PRODUCT),
  multerCloudFunction(allowedExtensions.image).array("images", 3),
  validationCoreFunction(validators.updateProductSchhema),
  errorHandling(pc.updateProduct)
  );

//============deleteProduct================
router.delete(
  "/deleteProduct/:productId",
  isAuth(productApisRoles.DELETE_PRODUCT),
  validationCoreFunction(validators.deleteProductSchhema),
  errorHandling(pc.deleteProduct)
  );
  
// ============getProductsPaginated========
// router.get("/listProduct", errorHandling(pc.listProduct));
  
// ==============getProductsWithApiFeatures==========
router.get(
  "/getProducts",
  errorHandling(pc.getProducts)
  );

// ==============getProductsWithReviews==========
router.get(
  "/getProductsWithReviews",
  errorHandling(pc.getProductsWithReviews)
  );

//====================searchProduct=================
router.get(
  "/searchProduct",
  errorHandling(pc.searchProduct)
  );


export default router;
