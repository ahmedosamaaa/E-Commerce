import joi from "joi";
import { gerenralFields } from "../../MiddleWares/Validation.js";

export const createProductSchhema = {
    body: joi.object({
        title: joi.string().min(5).max(55).required(),
        desc: joi.string().min(5).max(255).required(),
        colors: joi.array().items(joi.string().required()).optional(),
        sizes: joi.array().items(joi.string().required()).optional(),
        price: joi.number().positive().min(1).required(),
        appliedDiscount: joi.number().positive().min(1).max(100).optional(),
        stock: joi.number().positive().min(1).required(),
    }),

    query: joi.object({
        categoryId: gerenralFields._id,
        subCategoryId: gerenralFields._id,
        brandId: gerenralFields._id,
    }).required().options({ presence: "required" }),
}

//==========updateProduct========
export const updateProductSchhema = {
    body: joi.object({
        title: joi.string().min(5).max(55).optional(),
        desc: joi.string().min(5).max(255).optional(),
        colors: joi.array().items(joi.string().required()).optional(),
        sizes: joi.array().items(joi.string().required()).optional(),
        price: joi.number().positive().min(1).optional(),
        appliedDiscount: joi.number().positive().min(1).max(100).optional(),
        stock: joi.number().positive().min(1).optional(),
    }),

    query: joi.object({
        categoryId: gerenralFields._id,
        subCategoryId: gerenralFields._id,
        brandId: gerenralFields._id,
        productId: gerenralFields._id,
    }),
}

//===============deleteProduct===================
export const deleteProductSchhema = {
    query: joi.object({
        categoryId: gerenralFields._id,
        subCategoryId: gerenralFields._id,
        brandId: gerenralFields._id,
    }),
    params: joi.object({
        productId: gerenralFields._id,
    })
}