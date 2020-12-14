const {validationResult} = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

exports.putRegistro = (req,res,next) => {
  const errors = validationResult(req);
  
  if(!errors.isEmpty()){
      const error = new Error('Validacion fallo.');3
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
  }
  
  const nombre = req.body.nombre;
  const email = req.body.email;
  const password = req.body.password;
  
  bcrypt.hash(password,12)
    .then(hashedPw => {
      const usuario = new Usuario({
        nombre: nombre,
        email: email,
        password: hashedPw,
        tienePlan: null,
        planId: null,
        intolerancias:null
      });
      return usuario.save();
    })
    .then(result => {
      res.status(201).json({message: 'Usuario creado', usuarioId:result._id})
    })
    .catch(err => {
      if(!err.statusCode){
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postLogin = (req,res,next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  Usuario.findOne({email:email})
    .then(usuario => {
      if(!usuario){
        const error = new Error('No se pudo encontrar un usuario con este correo');
        error.statusCode = 401;
        throw error;
      } 
      loadedUser = usuario;
      return bcrypt.compare(password, usuario.password);
    })
    .then(esIgual => {
       if(!esIgual){
         const error = new Error('Contraseña incorrecta');
         error.statusCode = 401;
         throw error;
       }
       const token = jwt.sign({
          email: loadedUser.email,
          userId: loadedUser._id.toString()
        }, 
        'somesupersecretsecret', 
        { expiresIn: '1h'}
       );
       res.status(200).json({ token: token, userId: loadedUser._id.toString()});
    })
    .catch(err => {
      if(!err.statusCode){
        err.statusCode = 500;
      }
      next(err);
    });

};