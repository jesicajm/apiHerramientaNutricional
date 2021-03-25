//const {validationResult} = require('express-validator/check');
const Usuario = require('../models/usuario');
const Minuta = require('../models/minuta');

exports.getPlanNutricional = (req,res,next) => {
    Usuario.findById(req.userId)
      .then(usuario => {
          if(!usuario){
             const error = new Error('Usuario no encontrado');
             error.statusCode = 404;
             throw error;
          }
          res.status(200).json({message:'Plan recuperado', plan: usuario.planNutricional})
      })
      .catch(err => {
        if(!err.statusCode){
          err.statusCode = 500;
        }
      });
}

exports.postPlanUsuario = (req,res,next) => {
    const desayuno = req.body.desayuno;
    const mediaManana = req.body.mediaManana;
    const almuerzo = req.body.almuerzo;
    const algo = req.body.algo;
    const cena = req.body.cena;
    const refrigerio = req.body.refrigerio;
  
    Usuario.findById(req.userId)
      .then(usuario => {
        if(!usuario){
          const error = new Error('Usuario no encontrado');
          error.statusCode = 404;
          throw error;
       }
        usuario.planNutricional.desayuno = desayuno;
        usuario.planNutricional.mediaManana = mediaManana;
        usuario.planNutricional.almuerzo = almuerzo;
        usuario.planNutricional.algo = algo;
        usuario.planNutricional.cena = cena;
        usuario.planNutricional.refrigerio = refrigerio;  
        return usuario.save(); 
    })
      .then(result => {
        res.status(201).json({
          message: 'Plan agregado con exito!',
          plan:result
        }) 
      })
      .catch(err => {
        console.log(err);
      });
}

exports.postguardarPlanMinuta = (req,res,nex) => {
  
}