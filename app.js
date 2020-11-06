const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const herramientaRoutes = require('./routes/herramienta');
const authRoutes = require('./routes/auth');


const app = express();

app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers','Content-type,Authorization');
    next();
})

app.use(herramientaRoutes);
app.use(authRoutes);

app.use((error,req,res,next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data : data});
});

mongoose.connect(
  'mongodb+srv://jesicajm:jdiosc12@hnutricional-baupa.mongodb.net/herramienta'
).then(result => {
    app.listen(3000);
}).catch(err => console.log(err));