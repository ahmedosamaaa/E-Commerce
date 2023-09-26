import { Router } from "express";
const router = Router();
import { errorHandling } from "../../Utils/ErrorHandling.js";
import { validationCoreFunction } from "../../MiddleWares/Validation.js";
import * as oc from "./order.controller.js";
import * as validators from "./order.validationSchema.js"
import { isAuth } from "../../MiddleWares/Auth.js";
import { orderApisRoles } from "./order.endpoints.js";

router.post(
    "/createOrder",
    isAuth(orderApisRoles.CREAT_ORDER),
    validationCoreFunction(validators.createOrderSchema),
    errorHandling(oc.createOrder),
)
router.post(
    "/cartToOrder",
    isAuth(orderApisRoles.CART_TO_ORDER),
    validationCoreFunction(validators.cartToOrderSchema),
    errorHandling(oc.cartToOrder),
)

router.get(
    "/successOrder",
    errorHandling(oc.successPayment),
)
router.get(
    "/cancelOrder",
    errorHandling(oc.cancelPayment),
)
router.post(
    "/orderDelivered",
    isAuth(orderApisRoles.ORDER_DELIVERED),
    errorHandling(oc.orderDelivered),
)
export default router