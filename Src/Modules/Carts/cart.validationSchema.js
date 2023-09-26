import joi from "joi";
import { gerenralFields } from "../../MiddleWares/Validation.js";


//========= addToCart =========
export const addToCartSchema = {
    body: joi.object({
        quantity: joi.number().required(),
        productId: gerenralFields._id,
    })   
}
//========= deleteFromCart =========
export const deleteFromCartSchema = {
    body: joi.object({
        productId: gerenralFields._id,
    })   
}
//========= deleteCart =========
export const deleteCartSchema = {
    query: joi.object({
        cartId: gerenralFields._id,
    })   
}