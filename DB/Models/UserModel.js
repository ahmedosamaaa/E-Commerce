import { Schema, model } from "mongoose";
import { systemRules } from "../../Src/Utils/systemRules.js";

const userSchema = new Schema ({
    userName: {
        type: String,
        required:true,
        lowercase:true,
    },

    email: {
        type: String,
        required:true,
        lowercase:true,
        trim:true,
        unique:true,
    },

    password: {
        type: String,
        required: true,
    },

    isConfirmed: {
        type: Boolean,
        default:false,
        required: true,
    },

    role: {
        type: String,
        tolowercase:true,
        default: systemRules.USER,
        enum: [ systemRules.USER, systemRules.ADMIN, systemRules.SUPER_ADMIN ],
    },

    phoneNumber: {
        type: String,
        required: true,
    },

    address: [
        {
        type: String,
        required: true,
        },
    ],

    profilePicture: {
        secure_url: String,
        public_id: String,
    },

    status: {
        type: String,
        default: 'Offline',
        enum: [ 'Online', 'Offline' ],
    },

    gender: {
        type: String,
        default: 'Not specified',
        enum: [ 'male', 'female', 'Not specified' ],
    },

    age: Number,
    token: String,
    forgetCode: String,
    provider: {
        type: String,
        default: 'System',
        enum: ['System', 'GOOGLE', 'facebook']
    }
}, { timestamps: true })

//========hooks======
// userSchema.pre('save', function (next, hash) {
//     this.password = pkg.hashSync(this.password, +process.env.SALT_ROUNDS)
//     next()
// })

export const userModel = model( 'User', userSchema )