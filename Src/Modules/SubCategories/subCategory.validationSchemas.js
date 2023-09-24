import joi from "joi";
import { gerenralFields } from "../../MiddleWares/Validation.js";

// ===== createSubCategorySchema =======
export const createSubCategorySchema = {
  body: joi
    .object({
      name: joi.string().min(2).max(15),
    })
    .required(),
    params: joi
    .object({
      categoryId: gerenralFields._id.required(),
    }),
};

// ========= updateSubCategorySchema  ==========
export const updateSubCategorySchema = {
  body: joi
    .object({
      name: joi.string().min(2).max(15).optional(),
    }),
  query: joi
  .object({
    categoryId: gerenralFields._id.required(),
    subCategoryId: gerenralFields._id.required(),
  })
};

// ========= deleteSubCategorySchema  ==========
export const deleteSubCategorySchema = {
  body: joi
    .object({
      name: joi.string().min(2).max(15),
    })
    .required(),
  query: joi
  .object({
    categoryId: gerenralFields._id.required(),
    subCategoryId: gerenralFields._id.required(),
  })
};
