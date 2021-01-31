const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');
const Minuta = require('../models/minuta');

module.exports = {
    crearUsuario: async function({ userInput }, req) {
       const errors = [];
       if(!validator.isEmail(userInput.email)){
           errors.push({message:'El correo electrocnico no es valido'});
       }
       if(
         validator.isEmpty(userInput.password) || 
         !validator.isLength(userInput.password, {min:5})
       ){
         errors.push({message:'Por favor ingrese una constraseña con al menos 5 caracteres'}); 
       }
       if(userInput.confirmPassword !== userInput.password){
         errors.push({message:'Las contraseñas deben coincidir'});
       }
       if(errors.length > 0){
           const error = new Error('Entrada invalida');
           error.data = errors;
           error.code = 422;
           throw error;
       }
       const existeUsuario = await Usuario.findOne({email:userInput.email});
       if(existeUsuario){
          const error = new Error('Usuario ya existe');
          throw error;
       }
       const hashedPw = await bcrypt.hash(userInput.password,12)
       const usuario = new Usuario({
        nombre: userInput.nombre,
        email: userInput.email,
        password: hashedPw,
        intolerancias: [],
        menus: []
       });
       const crearUsuario = await usuario.save();
       return { ...crearUsuario._doc, _id: crearUsuario._id.toString()}
    },
    login: async function ({email,password}){
       const usuario = await Usuario.findOne({email:email});
       if(!usuario){
          const error = new Error('Usuario no encontrado.');
          error.code = 401;
          throw error;
       }
      const esIgual = await bcrypt.compare(password, usuario.password);
      if(!esIgual){
          const error = new Error('Contraseña incorrecta.');
          error.code = 401;
          throw error;
      }
      const token = jwt.sign({
        email: usuario.email,
        userId: usuario._id.toString()
      }, 
      'somesupersecretsecret', 
      { expiresIn: '1h'}
     );
     return {token: token, usuarioId: usuario._id.toString()};
    },
    guardarPlanNutricional: async function({ userInput }, req) {
      if(!req.isAuth){
        const error = new Error('No autenticado.');
        error.code = 401;
        throw error;
      }
      const usuario = await Usuario.findById(req.userId);
      if(!usuario){
        const error = new Error('Usuario no encontrado');
        error.statusCode = 401;
        throw error;
      }
      usuario.planNutricional.desayuno = userInput.desayuno.split(',');
      usuario.planNutricional.mediaManana = userInput.mediaManana.split(',');
      usuario.planNutricional.almuerzo = userInput.almuerzo.split(',');
      usuario.planNutricional.algo = userInput.algo.split(',');
      usuario.planNutricional.cena = userInput.cena.split(',');
      usuario.planNutricional.refrigerio = userInput.refrigerio.split(',');  
      const guardarPlan = await usuario.save();
      console.log(guardarPlan);
      return { 
        ...guardarPlan._doc,
        desayuno: guardarPlan.planNutricional.desayuno,
        mediaManana: guardarPlan.planNutricional.mediaManana,
        almuerzo: guardarPlan.planNutricional.almuerzo,
        algo: guardarPlan.planNutricional.algo,
        cena: guardarPlan.planNutricional.cena,
        refrigerio: guardarPlan.planNutricional.refrigerio,
      };
    },
    planUsuario: async function(args,req){
      if(!req.isAuth){
        const error = new Error('No autenticado.');
        error.code = 401;
        throw error;
      }
      const usuario = await Usuario.findById(req.userId);
      if(!usuario){
        const error = new Error('Usuario no encontrado');
        error.code = 404;
        throw error;
     }
     return {
        desayuno: usuario.planNutricional.desayuno,
        mediaManana: usuario.planNutricional.mediaManana,
        almuerzo: usuario.planNutricional.almuerzo,
        algo: usuario.planNutricional.algo,
        cena: usuario.planNutricional.cena,
        refrigerio: usuario.planNutricional.refrigerio
      };
    },
    guardarPlanMinuta: async function({ inputMinuta }, req) {
      if(!req.isAuth){
        const error = new Error('No autenticado.');
        error.code = 401;
        throw error;
      }
      const errors = [];
      if(validator.isEmpty(inputMinuta.fechaInicial)){
          errors.push({message:'Ingrese una fecha Inicial'});
      }
      if(validator.isEmpty(inputMinuta.fechaFinal)){
        errors.push({message:'Ingrese una fecha final'});
      }
      if(errors.length > 0){
        const error = new Error('Entrada invalida');
        error.data = errors;
        error.code = 422;
        throw error;
      }
      const usuario = await Usuario.findById(req.userId);
      if(!usuario){
        const error = new Error('Usuario no encontrado');
        error.code = 401;
        throw error;
      }
      const minuta = new Minuta({
        fechaInicialPlanificarMenus: inputMinuta.fechaInicial,
        fechaFinalPlanificarMenus: inputMinuta.fechaFinal,
        menus:[],
        usuarioId: usuario
      });
      const inputIntolerancias = inputMinuta.intolerancias.split(',');
      const crearMinuta = await minuta.save();
      console.log(crearMinuta);
      usuario.intolerancias = inputIntolerancias;
      usuario.minutas.push(crearMinuta);
      await usuario.save();
      return {
        ...crearMinuta._doc, 
        _id:crearMinuta._id.toString(),
        fechaInicial: crearMinuta.fechaInicialPlanificarMenus,
        fechaFinal: crearMinuta.fechaFinalPlanificarMenus,
        intolerancias: inputIntolerancias
      }
    }
}