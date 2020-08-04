const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name:{
        type: String,
        maxlength: 50
    },
    email:{
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5,
    },
    lastname:{
        type:String,
        maxlength:50
    },
    role:{
        type:Number,
        default:0
    },
    token: {
        type: String
    },
    tokenExp: {
        type:Number    
    }
})

userSchema.statics.findByCredentials = async (email,password) => {
    const user = await User.findOne({email})
    if(!user){
       throw new Error('No user Found')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Wrong Password')
    }
    return user
}

userSchema.methods.generateToken = async function(){
            const user = this 
            const token = jwt.sign({_id:user._id.toString()},'secretString')
            user.token = token
            await user.save()
            return user.token
}

userSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

const User = mongoose.model('User',userSchema)
module.exports = { User }