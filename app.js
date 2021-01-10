const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const auth = require('./middleware/auth');

const app = express();

app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers','Content-type,Authorization');
    if(req.method === 'OPTIONS'){
       return res.sendStatus(200);
    }
    next();
});

app.use(auth);

app.use('/graphql', 
        graphqlHTTP({
           schema: graphqlSchema,
           rootValue: graphqlResolver,
           graphiql : true,
           formatError(err){
               if(!err.originalError){
                  return err;
               }
               const data = err.originalError.data;
               const message = err.message || 'Ocurrio un error';
               const code = err.originalError.code || 500;
               return { message:message, status:code, data:data }
           }
        })
);



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