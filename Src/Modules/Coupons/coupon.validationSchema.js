import joi from "joi";
import { gerenralFields } from "../../MiddleWares/Validation.js";


//=========createCoupon=========
export const createCouponSchema = {
    body: joi.object({
        couponCode: joi.string().lowercase().min(5).max(55).required(),
        couponAmount: joi.number().positive().min(1).max(100).required(),
        fromDate: joi.date().greater(Date.now()-( 24 * 60 * 60 * 1000 )).required(),
        toDate: joi.date().greater(joi.ref('fromDate')),
        isPercentage: joi.boolean().optional(),
        isFixedAmount: joi.boolean().optional(),
        couponAssginedToUsers: joi.array().items().optional(),
    })
}

//=========updateCoupon=========
export const updateCouponSchema = {
    body: joi.object({
        couponCode: joi.string().lowercase().min(5).max(55).optional(),
        couponAmount: joi.number().positive().min(1).max(100).optional(),
        fromDate: joi.date().greater(Date.now()-( 24 * 60 * 60 * 1000 )).optional(),
        toDate: joi.date().greater(joi.ref('fromDate')),
        isPercentage: joi.boolean().optional(),
        isFixedAmount: joi.boolean().optional(),
        couponStatus: joi.string().valid('Expired', 'Valid').optional()
    })
}

//==========deleteCoupon==========
export const deleteCouponSchema = {
    params: joi.object({
        couponId: gerenralFields._id,
    })
}