import { Router } from "express";
const router = Router();
import { errorHandling } from "../../Utils/ErrorHandling.js";
import { validationCoreFunction } from "../../MiddleWares/Validation.js";
import * as cc from "./coupon.controller.js";
import * as validators from "./coupon.validationSchema.js"
import { isAuth } from "../../MiddleWares/Auth.js";
import { couponApisRoles } from "./coupon.endpoints.js";


//=======createCoupon==========
router.post(
    "/createCoupon",
    isAuth(couponApisRoles.CREAT_COUPON),
    validationCoreFunction(validators.createCouponSchema),
    errorHandling(cc.createCoupon)
)

//========updateCoupon========
router.put(
    "/updateCoupon/:couponId",
    isAuth(couponApisRoles.UPDATE_COUPON),
    validationCoreFunction(validators.updateCouponSchema),
    errorHandling(cc.updateCoupon)
)

//========getCoupons========
router.get(
    "/getCoupons",
    errorHandling(cc.getCoupons)
)

//======deleteCoupon=======
router.delete(
    "/deleteCoupon/:couponId",
    isAuth(couponApisRoles.DELETE_COUPON),
    validationCoreFunction(validators.deleteCouponSchema),
    errorHandling(cc.deleteCoupon)
)
export default router