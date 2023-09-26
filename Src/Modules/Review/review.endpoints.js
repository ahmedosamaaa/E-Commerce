import { systemRules } from "../../Utils/systemRules.js";

export const reviewApisRoles = {
    CREATE_REVIEW: [systemRules.USER,systemRules.ADMIN,systemRules.SUPER_ADMIN],
}