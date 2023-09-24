import { systemRules } from "../../Utils/systemRules.js";

export const categoryApisRoles = {
    CREAT_CATEGORY: [systemRules.SUPER_ADMIN,systemRules.ADMIN],
    UPDATE_CATEGORY: [systemRules.SUPER_ADMIN,systemRules.ADMIN],
    DELETE_CATEGORY: [systemRules.SUPER_ADMIN,systemRules.ADMIN],
}