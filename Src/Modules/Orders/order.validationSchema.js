import joi from "joi";
import { gerenralFields } from "../../MiddleWares/Validation.js";


//========= createOrder =========
export const createOrderSchema = {
    body: joi.object({
        couponCode: joi.string().lowercase().min(5).max(55).optional(),
        productId: gerenralFields._id.required(),
        quantity: joi.number().required(),
        address: joi.required(),
        phoneNumbers: joi.required(),
        paymentMethod: joi.string().valid('card','cash').required(),
    }),    
    
}
//========= cartToOrder ========
export const cartToOrderSchema = {
    body: joi.object({
        couponCode: joi.string().lowercase().min(5).max(55).optional(),
        address: joi.required(),
        phoneNumbers: joi.required(),
        paymentMethod: joi.string().valid('card','cash').required(),
    }),
    query: joi.object({
        cartId: gerenralFields._id.required(),
    })    
    
}
//========= orderDelivered ========
export const orderDeliveredSchema = {
    query: joi.object({
        orderId: gerenralFields._id.required(),
    })    
    
}

