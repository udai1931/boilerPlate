const express = require('express')
const app =express()
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://udai:<12345>@boilerplate.ptr22.mongodb.net/<dbname>?retryWrites=true&w=majority',
{useNewUrlParser:true}).then(() => console.log('DB connected'))
                      .catch(err => console.log(err))


app.get('/',(req,res) => {
    res.send('hello world!')
})

app.listen(5000)