import { systemRules } from "../../Utils/systemRules.js";

export const orderApisRoles = {
    CREAT_ORDER: [systemRules.SUPER_ADMIN,systemRules.ADMIN],
    CART_TO_ORDER: [systemRules.SUPER_ADMIN,systemRules.ADMIN],
}