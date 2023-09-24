import { systemRules } from "../../Utils/systemRules.js";

export const brandApisRoles = {
    CREAT_BRANDS: [systemRules.SUPER_ADMIN,systemRules.ADMIN],
    UPDATE_BRANDS: [systemRules.SUPER_ADMIN,systemRules.ADMIN],
    DELETE_BRANDS: [systemRules.SUPER_ADMIN,systemRules.ADMIN],
}