import { Router } from "express";
const router = Router();
import { errorHandling } from "../../Utils/ErrorHandling.js";
import { validationCoreFunction } from "../../MiddleWares/Validation.js";
import * as ac from "./auth.controller.js";
import * as validators from "./auth.validationSchema.js"
import { isAuth } from "../../MiddleWares/Auth.js";

//=======signUp=======
router.post(
    "/signUp",
    validationCoreFunction(validators.signUpSchema),
    errorHandling(ac.signUp),
)

//=======confirmEmail=======
router.get(
    "/confirmEmail/:token",
    errorHandling(ac.confirmEmail),
)

//=======signIn=======
router.post(
    "/signIn",
    validationCoreFunction(validators.signInSchema),
    errorHandling(ac.signIn),
)

//====forgetPassword====
router.post(
    "/forgetPassword",
    validationCoreFunction(validators.forgertPasswordSchema),
    errorHandling(ac.forgetPassword)
)

//====resetPassword====
router.post(
    "/resetPassword/:token",
    validationCoreFunction(validators.resetPasswordSchema),
    errorHandling(ac.resetPassword)
)

//=============socialLogin==============
router.post(
    '/loginWithGmail',
    errorHandling(ac.loginwithGmail)
)
export default router