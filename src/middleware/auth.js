const jwt = require('jsonwebtoken')
const { User } = require('../models/user')

const auth = async (req,res,next) => {
    try{
        const token = req.cookies.x_auth;
        const decoded = jwt.verify(token,'secretString')
        const user = await User.findOne({_id:decoded._id,token})
        if(!user){
            throw new Error('Wrong Authorization')
        }
        req.user = user
        next()
    }catch(e){
        res.status(400).send(e)
    }
}

module.exports = auth