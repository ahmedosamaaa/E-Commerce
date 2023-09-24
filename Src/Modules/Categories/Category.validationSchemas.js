import joi from "joi";
import { gerenralFields } from "../../MiddleWares/Validation.js";

//======createCategory=======
export const createCategorySchema = {
  body: joi
    .object({
      name: joi.string().min(4).max(20),
    })
    .required(),
};

//======updateCategory=======
export const updateCategorySchema = {
  body: joi.object({
    name: joi.string().min(4).max(10).optional(),
  }),
  params: joi.object({
    categoryId: gerenralFields._id,
})
};

//======deleteCategory=======
export const deleteCategorySchema = {
  query: joi.object({
      categoryId: gerenralFields._id,
  })
}
