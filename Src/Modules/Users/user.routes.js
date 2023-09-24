import { Router } from "express";
const router = Router();
import { errorHandling } from "../../Utils/ErrorHandling.js";
import { validationCoreFunction } from "../../MiddleWares/Validation.js";
import * as uc from "./user.controller.js";
import * as validators from "./user.validationSchema.js"



export default router