const {validationResult} = require('express-validator/check');
const Usuario = require('../models/usuario');

exports.postPlanUsuario = (req,res,next) => {
    const errors = validationResult(req);
  
    if(!errors.isEmpty()){
        const error = new Error('Validacion fallo.');3
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
  
    const desayuno = req.body.desayuno;
    const mediaManana = req.body.mediaManana;
    const almuerzo = req.body.almuerzo;
    const algo = req.body.algo;
    const cena = req.body.cena;
    const refrigerio = req.body.refrigerio;
    console.log(req.userId);

    Usuario.findById(req.userId)
      .then(usuario => {
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