import { systemRules } from "../../Utils/systemRules.js";

export const subCategoryApisRoles = {
    CREAT_SUB_CATEGORY: [systemRules.SUPER_ADMIN,systemRules.ADMIN],
    UPDATE_SUB_CATEGORY: [systemRules.SUPER_ADMIN,systemRules.ADMIN],
    DELETE_SUB_CATEGORY: [systemRules.SUPER_ADMIN,systemRules.ADMIN],
}