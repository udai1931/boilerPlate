const port = process.env.PORT || 3000
const express = require('express')
const app =express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const config = require('./config/key')
const { User } = require('./models/user')
const auth = require('./middleware/auth')
const user = require('./models/user')

mongoose.connect(config.mongoURI,
{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true})
mongoose.connection
    .once("open", () => console.log("DB Connected"))
    .on("error",(error) => {console.log(error)})


app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())      

app.get("/",async (req,res) => {
    res.send('hi')
})

app.get('/api/user/auth',auth,async (req,res) => {
    res.status(200).json({
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role
    })
})

app.post('/api/users/register', async(req,res) => {
    const user = new User(req.body)
    try{
        await user.save()
        console.log(user)
        res.status(201).send(user)
    }catch(e){
        console.log('error',e)
        res.send(e)
    } 
})

app.post('/api/user/login', async (req,res) => {
    try{
        const user =  await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateToken()
        res.cookie("x_auth",token)
        res.send({user,token}).status(200)
    }catch(e){
        res.status(400).send(e)
    }
})

app.get('/api/user/logout',auth,async (req,res) => {
    try{
        await User.findOneAndUpdate({_id:req.user._id},{token:''})
        res.status(200).send({success:true})
    }catch(e){
        res.status(500).send(e)
    }
})

app.listen(port,() => {
    console.log(`Server running at ${port}`)
})