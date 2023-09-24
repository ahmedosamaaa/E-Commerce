import { systemRules } from "../../Utils/systemRules.js";

export const couponApisRoles = {
    CREAT_COUPON: [systemRules.SUPER_ADMIN,systemRules.ADMIN],
    UPDATE_COUPON: [systemRules.SUPER_ADMIN,systemRules.ADMIN],
    DELETE_COUPON: [systemRules.SUPER_ADMIN,systemRules.ADMIN],
}