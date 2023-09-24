import { userModel } from "../../DB/Models/UserModel.js";
import { generateToken, verifyToken } from "../Utils/tokenFunctions.js";

export const isAuth = (roles) => {
  return async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        return next (new Error('Please login first', { cause: 400 }))
      }
      if (!authorization.startsWith("e-comm")) {
        return next(new Error('invalid token prefix', { cause: 400 }))
      }
      const splitedToken = authorization.split(" ")[1];
      try {
        const decodedData = verifyToken({ token: splitedToken, signature: process.env.SIGN_IN_TOKEN_SECRET })
        console.log(decodedData);
        const findUser = await userModel.findById(decodedData.id, 'email userName role');
        if (!findUser) {
          return next(new Error('Please SignUp', { cause: 400 }))
        }

        //========userRole=========
        if(!roles.includes(findUser.role)){
          return next(new Error('Not Authorized', { cause: 401 }))
        }
        req.authUser = findUser;
        next();
      } catch (error) {
        if (error == 'TokenExpiredError: jwt expired'){
          const user = await userModel.findOne({ token: splitedToken })
          if(!user){
            return next (new Error(' wrong token', { cause: 400 }))
          }
          const userToken = generateToken ({
            payload: {
              email: user.email,
              id: user._id
            }, 
            signature: process.env.SIGN_IN_TOKEN_SECRET,
            expiresIn:"1h",
          })
          if (!userToken) {
            return next(
              new Error('token generation fail, payload canot be empty', {
                cause: 400,
              }),
            )
          }
          // user.token = userToken;
          // await user.save();
          await userModel.findOneAndUpdate(
            { token: splitedToken },
            { token: userToken },
          )
          return res.status(200).json({ message: 'Token refreshed', userToken })
        }
        return next(new Error('invalid token', { cause: 500 }))
      }
    } catch (error) {
      console.log(error);
      return next (new Error('catch error in auth'))
    }
  };
};
