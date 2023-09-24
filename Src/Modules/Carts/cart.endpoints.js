import { systemRules } from "../../Utils/systemRules.js";

export const cartApisRoles = {
    CREAT_CART: [systemRules.SUPER_ADMIN,systemRules.ADMIN],
    DELETE_FROM_CART: [systemRules.SUPER_ADMIN,systemRules.ADMIN],
    DELETE_CART: [systemRules.SUPER_ADMIN,systemRules.ADMIN],
}