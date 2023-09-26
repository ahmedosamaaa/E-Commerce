import joi from "joi";
import { gerenralFields } from "../../MiddleWares/Validation.js";


export const addReviewSchema = {
    body: joi.object({
        reviewRate: joi.number().min(1).max(5).required(),
        reviewComment: joi.string().min(3).max(255).optional(),
    }),
    query: joi.object({
        productId: gerenralFields._id
    })
}