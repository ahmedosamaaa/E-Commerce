import { systemRules } from "../../Utils/systemRules.js";

export const orderApisRoles = {
    CREAT_ORDER: [systemRules.USER,systemRules.ADMIN,systemRules.SUPER_ADMIN],
    ORDER_DELIVERED: [systemRules.ADMIN,systemRules.SUPER_ADMIN],
}