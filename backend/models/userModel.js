import mongoose from "mongoose";

// user Schema
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is mandatory"]
    },
    email: {
        type: String,
        required: [true, "Email is mandatory"]
    },
    password: {
        type: String,
        required: [true, "Password is mandatory"]
    },
    age: {
        type: Number,
        required: [true, "Age is mandatory"],
        min: 12
    },
}, {timestamps: true})

const userModel = mongoose.model("users", userSchema)

export {userModel}