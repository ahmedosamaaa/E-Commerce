import joi from "joi";
import { gerenralFields } from "../../MiddleWares/Validation.js";
export const signUpSchema = {
  body: joi
    .object({
      userName: joi.string().min(3).max(10).required(),
      email: gerenralFields.email,
      password: gerenralFields.password,
      cPassword: joi.valid(joi.ref("password")).required(),
      gender: joi.required(),
      age: joi.required(),
      phoneNumber: joi.string().min(9).max(12).required(),
      address: joi.required()
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




