import joi from "joi";
import { gerenralFields } from "../../MiddleWares/Validation.js";

// ===== createBrandSchema =======
export const createBrandSchema = {
  body: joi
    .object({
      name: joi.string().min(2).max(15),
    })
    .required(),
  query: joi.object({
    categoryId: gerenralFields._id.required(),
    subCategoryId: gerenralFields._id.required(),
  }),
};

// ========= updateBrandSchema  ==========
export const updateBrandSchema = {
  body: joi.object({
    name: joi.string().min(2).max(15).optional(),
  }),
  query: joi.object({
    categoryId: gerenralFields._id.required(),
    subCategoryId: gerenralFields._id.required(),
    brandId: gerenralFields._id.required(),
  }),
};

// ========= deleteBrandSchema  ==========
export const deleteBrandSchema = {
  body: joi
    .object({
      name: joi.string().min(2).max(15),
    })
    .required(),
  query: joi.object({
    subCategoryId: gerenralFields._id.required(),
    brandId: gerenralFields._id.required(),
  }),
};
