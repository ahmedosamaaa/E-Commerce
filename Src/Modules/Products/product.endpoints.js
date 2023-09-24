import { systemRules } from "../../Utils/systemRules.js";

export const productApisRoles = {
    CREAT_PRODUCT: [systemRules.SUPER_ADMIN,systemRules.ADMIN],
    UPDATE_PRODUCT: [systemRules.SUPER_ADMIN,systemRules.ADMIN],
    DELETE_PRODUCT: [systemRules.SUPER_ADMIN,systemRules.ADMIN],
}