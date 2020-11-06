const express = require('express'); 
const { body } = require('express-validator/check');

const router = express.Router();
const authController = require('../controller/auth');
const Usuario = require('../models/usuario');

router.put('/registro', [
    body('email')
        .isEmail()
        .withMessage('Por favor ingrese un email válido.')
        .custom((value, { req }) => {
            return Usuario.findOne({ email:value })
            .then(usuarioDoc =>{
               if(usuarioDoc){
                  return Promise.reject(
                    'El email ya existe');
               }
            });
        })
        .normalizeEmail(),
        body('password',
        'Por favor ingrese una constraseña con al menos 5 caracteres')
        .trim()
        .isLength({min:5}),
        body('confirmPassword')
        .trim()
        .custom((value, { req })=>{
            if(value !== req.body.password){
                throw new Error('Las contraseñas deben coincidir');
            }
            return true;
        }),
        body('nombre')
        .trim()
        .not()
        .isEmpty()
    ],
    authController.putRegistro
);

//router.get('/login', authController.getLogin);



module.exports = router;