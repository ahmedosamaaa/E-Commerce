import joi from "joi";
import { gerenralFields } from "../../MiddleWares/Validation.js";


//========= createOrder =========
export const createOrderSchema = {
    body: joi.object({
        couponCode: joi.string().lowercase().min(5).max(55).required(),
        productId: gerenralFields._id.required(),
        quantity: joi.number().required(),
        address: joi.required(),
        // phoneNumbers: joi.string().min(10).max(15).required(),
        paymentMethod: joi.string().valid('card','cash').required(),
    }),    
    
}
//========= cartToOrder =========
export const cartToOrderSchema = {
    body: joi.object({
        couponCode: joi.string().lowercase().min(5).max(55).required(),
        address: joi.required(),
        // phoneNumbers: joi.string().min(10).max(15).required(),
        paymentMethod: joi.string().valid('card','cash').required(),
    }),
    query: joi.object({
        cartId: gerenralFields._id,
    })    
    
}

