import mongoose from 'mongoose'


const userSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true, validate: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/},
    lang: {type: String, enum: ["pl", "en"], required: true, default: "pl"},
    fridge: [{type: mongoose.Types.ObjectId, ref: "Food", default: []}],
    bitescore: {type: Number, default: 0},
    avatar: {type: String, default: "nopfp.png"},
    createDate: {type: Date, default: Date.now, required: true},
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    friendRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    pushTokens: [{ type: String, required: true, default: [] }]
})

const User = mongoose.model("User", userSchema)


export default User