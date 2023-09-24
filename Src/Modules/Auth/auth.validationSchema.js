import joi from "joi";
import { gerenralFields } from "../../MiddleWares/Validation.js";
export const signUpSchema = {
  body: joi
    .object({
      username: joi.string().min(3).max(10).required(),
      email: gerenralFields.email,
      password: gerenralFields.password,
      cPassword: joi.valid(joi.ref("password")).required(),
      status : joi.required(),
      gender: joi.required(),
      age: joi.required()
    })
    .required(),
};

export const signInSchema = {
  body: joi.object({
    email: gerenralFields.email.required(),
    password: gerenralFields.password.required(),
  }),
};

export const forgertPasswordSchema = {
  body: joi.object({
    email: gerenralFields.email,
  }),
};
export const resetPasswordSchema = {
  body: joi.object({
    newPassword: joi.required(),
  }),
};




