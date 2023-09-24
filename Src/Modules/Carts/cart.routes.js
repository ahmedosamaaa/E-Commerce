import { Router } from "express";
const router = Router();
import { errorHandling } from "../../Utils/ErrorHandling.js";
import { validationCoreFunction } from "../../MiddleWares/Validation.js";
import * as cc from "./cart.controller.js";
import * as validators from "./cart.validationSchema.js"
import { isAuth } from "../../MiddleWares/Auth.js";
import { cartApisRoles } from "./cart.endpoints.js";


//=======addToCart==========
router.post(
    "/addToCart",
    isAuth(cartApisRoles.CREAT_CART),
    validationCoreFunction(validators.addToCartSchema),
    errorHandling(cc.addToCart)
)

//======deleteFromCart=======
router.delete(
    "/deleteFromCart",
    isAuth(cartApisRoles.DELETE_FROM_CART),
    validationCoreFunction(validators.deleteFromCartSchema),
    errorHandling(cc.deleteFromCart)
)

//======deleteCart=======
router.delete(
    "/deleteCart",
    isAuth(cartApisRoles.DELETE_CART),
    validationCoreFunction(validators.deleteCartSchema),
    errorHandling(cc.deleteCart)
)
export default router