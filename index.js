const express = require('express')
const app =express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const config = require('./config/key')
const { User } = require('./models/user')

mongoose.connect(config.mongoURI,
{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true})
mongoose.connection
    .once("open", () => console.log("DB Connected"))
    .on("error",(error) => {console.log(error)})


app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())                    

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


app.listen(3000,() => {
    console.log('Server Connected.')
})