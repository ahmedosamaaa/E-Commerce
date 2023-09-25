import { systemRules } from "../../Utils/systemRules.js";

export const orderApisRoles = {
    CREAT_ORDER: [systemRules.USER],
    CART_TO_ORDER: [systemRules.USER],
}