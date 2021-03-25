const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const Usuario = require('../models/usuario');
const Minuta = require('../models/minuta');
const Alimento = require('../models/alimento');
const AlimentosUsuario = require('../models/alimentosUsuario');
const Salsa = require('../models/salsa');
const Menu = require('../models/menu');
//const { NoUndefinedVariablesRule } = require('graphql');

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
       
       const alimentos = await Alimento.find();
       const salsas = await Salsa.find();
       
       const hashedPw = await bcrypt.hash(userInput.password,12)
       const usuario = new Usuario({
        nombre: userInput.nombre,
        email: userInput.email,
        password: hashedPw,
        intolerancias: [],
        tienePlan:false,
        menus: [],
       });

       const crearUsuario = await usuario.save();
       
       const alimentosUsuario = new AlimentosUsuario({
        alimentos: alimentos,
        salsas: salsas,
        usuarioId: usuario._id.toString()
       })
        
       await alimentosUsuario.save();

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

      usuario.planNutricional.desayuno = userInput.desayuno.split(',')
      usuario.planNutricional.mediaManana = userInput.mediaManana .split(',')
      usuario.planNutricional.almuerzo = userInput.almuerzo.split(',')
      usuario.planNutricional.algo = userInput.algo.split(',')
      usuario.planNutricional.cena = userInput.cena.split(',')
      usuario.planNutricional.refrigerio = userInput.refrigerio.split(',')
      
      usuario.tienePlan = true;
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
        tienePlan: usuario.tienePlan,
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

      const fechaInicial = moment(inputMinuta.fechaInicial, "YYYY-MM-DD");
      const fechaFinal = moment(inputMinuta.fechaFinal, "YYYY-MM-DD");
      const diasMenus = fechaFinal.diff(fechaInicial, 'days');
      const plan = usuario.planNutricional;
      
      const minutaActual = await Minuta.findOne({usuarioId:usuario});
      
      if(minutaActual){
        await minutaActual.deleteOne();
      }

      const minuta = new Minuta({
        fechaInicialPlanificarMenus: inputMinuta.fechaInicial,
        fechaFinalPlanificarMenus: inputMinuta.fechaFinal,
          menus:[
            {
              dia: null,
              desayuno: {},
              mediaManana: {},
              almuerzo: {},
              algo: {},
              cena: {},
              refrigerio: {}
            }
          ],
          usuarioId: usuario
        });

        guardarMinuta = await minuta.agregarMenusMinuta(fechaInicial,diasMenus,plan);
      
        let inputIntolerancias = [];
   
        const menus = await Menu.find({comidaDia:'almuerzo'});
        
        const alimentosUsuario = await AlimentosUsuario.findOne({usuarioId:usuario});
  
        if(inputMinuta.intolerancias.length > 0){
          inputIntolerancias = inputMinuta.intolerancias.split(',');
          inputIntolerancias.forEach(intolerancia => {
            const existeIntolerancia = usuario.intolerancias.includes(intolerancia);
            if(!existeIntolerancia){
              alimentosUsuario.eliminarIntolerancia(intolerancia);
              usuario.intolerancias.push(intolerancia);
            }
          });
        }
        
        await alimentosUsuario.save();
        usuario.minutas.push(guardarMinuta);
        await usuario.save();
        
        return {
          ...guardarMinuta._doc, 
          _id:guardarMinuta._id.toString(),
          fechaInicial: guardarMinuta.fechaInicialPlanificarMenus,
          fechaFinal: guardarMinuta.fechaFinalPlanificarMenus,
          intolerancias: inputIntolerancias
        }     
    },
    minuta: async function(args,req){
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

      const minuta = usuario.minutas[usuario.minutas.length-1]
      const alimentosUsuario = await AlimentosUsuario.findOne({usuarioId:usuario});
      const plan = usuario.planNutricional;
    
      Menu.escogerTipoMenu(plan,'almuerzo');
      alimentosUsuario.armarReceta('martes');
      //console.log(minuta);
      return {
        ...minuta._doc,
        _id: minuta._id.toString(),
        fechaInicial:minuta.fechaInicialPlanificarMenus,
        fechaFinal:minuta.fechaFinalPlanificarMenus,
        menus: minuta.menus.map(m => {
          return {
            ...m._doc, 
            _id: m._id.toString(),
            dia: m.dia, 
            desayuno: m.desayuno, 
            mediaManana: m.mediaManana,
            almuerzo: m.almuerzo,
            algo: m.algo,
            cena: m.cena,
            refrigerio: m.refrigerio
          }
        })
      }
    },
    intolerancias: async function(args,req){
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

      const intolerancias = usuario.intolerancias;  
      const listaAlimentos = await Alimento.find().select('nombreAlimento -_id');
      const alimentos = [];
      listaAlimentos.forEach(alimento =>{
        alimentos.push(alimento.nombreAlimento);
      });
      
      return{
        intolerancias:intolerancias,
        alimentos:alimentos
      }
    }
}