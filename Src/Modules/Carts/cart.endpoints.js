import { systemRules } from "../../Utils/systemRules.js";

export const cartApisRoles = {
    CREAT_CART: [systemRules.USER],
    DELETE_FROM_CART: [systemRules.USER],
    DELETE_CART: [systemRules.SUPER_ADMIN,systemRules.ADMIN],
}