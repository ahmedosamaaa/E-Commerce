import { nanoid } from "nanoid";
import { userModel } from "../../../DB/Models/UserModel.js"
import { sendEmailService } from "../../Services/SendEmailService.js"
import { emailTemplate } from "../../Utils/emailTemplate.js"
import { generateToken, verifyToken } from "../../Utils/tokenFunctions.js"
import bcrypt from "bcrypt";
import {OAuth2Client} from 'google-auth-library';

//==============signUp=============
export const signUp = async (req,res,next) => {
    const{
        userName,
        email,
        password,
        phoneNumber,
        address,
        status,
        gender,
        age,
    } =req.body

    //checkIfEmailDublicate
    const isEmailDublicate = await userModel.findOne({email})
    if(isEmailDublicate){
        return next(new Error('try again with anther email',{ cause: 400 }))
    }
    //toDoHashPass
    const token = generateToken({
        payload: {
            email,
        },
        signature: process.env.CONFIRMATION_EMAIL_TOKEN,
        expiresIn: "1h", 
    })
    const confirmLink = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${ token }`
    const isEmailSent = sendEmailService({
        to:email,
        subject:`Confirmation Email`,
        message: emailTemplate(
        {
            link: confirmLink,
            subject: "Confirmation Email",
            linkData: "Click here to confirm"
        }),
    })
    if (!isEmailSent) {
        return next( new Error("Please try again later or contact teh support team", { cause: 400 }))
    }
    const hashedPassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS);
    const user = new userModel({
        userName,
        email,
        password: hashedPassword,
        phoneNumber,
        address,
        status,
        gender,
        age
    })
    const savedUser = await user.save();
    res.status(201).json({ message:"Done", savedUser })
    // res.redirect("/confirmEmail")
}

// ============confirmEmail================
export const confirmEmail = async(req,res,next)=>{
    const{ token } = req.params
    const decodedData = verifyToken({token: token, signature: process.env.CONFIRMATION_EMAIL_TOKEN,})
    const user = await userModel.findOneAndUpdate(
            { email: decodedData?.email, isConfirmed:false },
            { isConfirmed: true },
            { new: true },
        )
    if(!user){
        return next(new Error("try to signup later",{ cause: 400 }))
    }
    res.status(200).json({message:"Confirmed Done, Please try to login", user})
}

//================signIn===================
export const signIn = async(req,res,next) => {
    const{ email, password } = req.body;
    const user = await userModel.findOne({ email });
    if(!user){
        return next(new Error("invalid login cradentials",{ cause: 400 }));
    }
    const isPassMatch = bcrypt.compareSync( password, user.password );
    if(!isPassMatch){
        return next(new Error("invalid login cradentials",{ cause: 400 }));
    }
    const token = generateToken({
        payload: {
            email,
            id:user._id,
            role: user.role,
        },
        signature: process.env.SIGN_IN_TOKEN_SECRET,
        expiresIn: '1h',
    });

    // const userUpdated = await userModel.findOneAndUpdate({ email },{ token , status: "online" },{ new: true });
    user.token = token,
    user.status = "Online",
    await user.save()
    res.status(200).json({message: "Done", user})
}

//===============forgetPassword===========
export const forgetPassword = async(req,res,next) => {
    const{ email }= req.body;
    const user = await userModel.findOne({ email })
    if(!user){
        return next(new Error("invalid  cradentials",{ cause: 400 }));
    }
    const code = nanoid();
    const hashedCode = bcrypt.hashSync(code,+process.env.SALT_ROUNDS)
    const token = generateToken({
        payload: {
            email,
            hashedCode,
        },
        signature: process.env.RESET_TOKEN,
        expiresIn:"1h",
    })

    const resetPasswordLink = `${req.protocol}://${req.headers.host}/auth/resetPassword/${token}`
    const isEmailSent = sendEmailService({
        to:email,
        subject:`Reset Password`,
        message: emailTemplate(
        {
            link: resetPasswordLink,
            subject: "Reset Password",
            linkData: "Click here to reset"
        }),
    })
    if (!isEmailSent) {
        return next( new Error("Please try again later or contact teh support team", { cause: 400 }))
    }
    user.forgetCode = hashedCode;
    await user.save();
    res.status(200).json({message: "Done", user})
}

//==============resetPassword===============
export const resetPassword =async(req,res,next) => {
    const{ token } = req.params;
    const decodedData = verifyToken({ token, signature: process.env.RESET_TOKEN });
    console.log(decodedData);
    if(!decodedData){
        return next( new Error("invalid token, please try again later ", { cause: 400 }))
    }
    const user = await userModel.findOne({ email: decodedData.email, forgetCode: decodedData.hashedCode })
    if (!user) {
        return next( new Error('your already reset your password once before , try to login', { cause: 400, }),)
    }
    const { newPassword } = req.body;
    const checkPass = bcrypt.compareSync( newPassword, user.password )
    if(checkPass){
        return next( new Error("please enter new password", { cause: 400 }))
    }
    const hashedPassword = bcrypt.hashSync(newPassword,+process.env.SALT_ROUNDS);
    user.password = hashedPassword;
    user.code = null;
    await user.save();
    res.status(200).json({message: "Done", user})
}

//=============social login==============
export const loginwithGmail = async (req,res,next)=>{
    const client = new OAuth2Client();
    const { idToken } = req.body
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        return payload;
    }
    const { email_verified, email, name } = await verify()
    if(!email_verified){
        return next (new Error('invalid email',{ cause: 400 }))
    }
    const user = await userModel.findOne({ email, provider:"GOOGLE" })
    //login
    if(user){
        const token = generateToken({
            payload: {
                email,
                id:user._id,
                role: user.role,
            },
            signature: process.env.SIGN_IN_TOKEN_SECRET,
            expiresIn: '1h',
        });  
        user.token = token,
        user.status = "Online",
        await user.save()
        return res.status(200).json({message: "Done", user, token})
    }
    //signUp
    const userObject = {
        userName: name,
        email,
        password: nanoid(6),
        provider: 'GOOGLE',
        isConfirmed: true,
        phoneNumber: ' ',
        role: "user"
    }
    const newUser = await userModel.create(userObject)
    const token = generateToken({
        payload: {
            email: newUser.email,
            id: newUser._id,
            role: newUser.role,
        },
        signature: process.env.SIGN_IN_TOKEN_SECRET,
        expiresIn: '1h',
    });
    newUser.token = token,
    newUser.status = "Online",
    await newUser.save()
    res.status(200).json({message:"Verified",newUser})
}