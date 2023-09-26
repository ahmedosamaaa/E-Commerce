import { systemRules } from "../../Utils/systemRules.js";

export const cartApisRoles = {
    CREAT_CART: [systemRules.USER,systemRules.ADMIN,systemRules.SUPER_ADMIN],
    DELETE_FROM_CART: [systemRules.USER,systemRules.ADMIN,systemRules.SUPER_ADMIN],
    DELETE_CART: [systemRules.SUPER_ADMIN,systemRules.ADMIN],
}