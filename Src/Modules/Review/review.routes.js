import { Router } from "express";
import { errorHandling } from "../../Utils/ErrorHandling.js";
import { validationCoreFunction } from "../../MiddleWares/Validation.js";
import * as rc from "./review.controller.js";
import * as validators from "./review.validationSchema.js"
import { isAuth } from "../../MiddleWares/Auth.js";
import { reviewApisRoles } from "./review.endpoints.js";
const router = Router();

//=======addReview=========
router.post(
    "/addReview",
    isAuth(reviewApisRoles.CREATE_REVIEW),
    validationCoreFunction(validators.addReviewSchema),
    errorHandling(rc.addReview),
)
export default router