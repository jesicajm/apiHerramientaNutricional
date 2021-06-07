const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const mongoose = require('mongoose');

const Usuario = require('../models/usuario');
const Minuta = require('../models/minuta');
const Alimento = require('../models/alimento');
const AlimentosUsuario = require('../models/alimentosUsuario');
const Salsa = require('../models/salsa');
const Menu = require('../models/menu');
const alimento = require('../models/alimento');
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
       
       const hashedPw = await bcrypt.hash(userInput.password,12)
       const usuario = new Usuario({
          nombre: userInput.nombre,
          email: userInput.email,
          password: hashedPw,
          intolerancias: [],
          tienePlan:false,
          menusMinutas:{},
          totalMenusMinuta: 0
       });

       const crearUsuario = await usuario.save();
       
       const alimentosUsuario = new AlimentosUsuario({
          proteinaAnimal:[],
          proteinaVegetal:[],
          proteinasCoccionRapida:{},
          esquemas:[],
          usuarioId: usuario._id.toString()
       })

       const alimentos = await Alimento.find();
       const salsas = await Salsa.find();
       //const alimentosUsuario = await AlimentosUsuario.findOne({usuarioId:usuario});
       alimentosUsuario.clasificarAlimentosYsalsas(alimentos,salsas);

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

      const esquemasMenus = await Menu.find();
      const alimentosUsuario = await AlimentosUsuario.findOne({usuarioId:usuario});

      const agregarComidaPlan = comidaDia => {
        if(userInput[comidaDia].length > 0){
          usuario.planNutricional[comidaDia] = userInput[comidaDia].split(',')
        }
      }
      
      agregarComidaPlan('desayuno')
      agregarComidaPlan('mediaManana')
      agregarComidaPlan('almuerzo')
      agregarComidaPlan('algo')
      agregarComidaPlan('cena')
      agregarComidaPlan('refrigerio')

      usuario.tienePlan = true;
      const guardarPlan = await usuario.save();
      const plan = usuario.planNutricional;
      
      alimentosUsuario.guardarEsquemasUsuario(esquemasMenus,plan);
     
      return { 
        ...guardarPlan._doc,
        desayuno: guardarPlan.planNutricional.desayuno,
        mediaManana: guardarPlan.planNutricional.mediaManana,
        almuerzo: guardarPlan.planNutricional.almuerzo,
        algo: guardarPlan.planNutricional.algo,
        cena: guardarPlan.planNutricional.cena,
        refrigerio: guardarPlan.planNutricional.refrigerio
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
      
      const minutaActual = await Minuta.findOne({usuarioId:usuario});
            
      const fechaInicial = moment(inputMinuta.fechaInicial, "YYYY-MM-DD");
      const fechaFinal = moment(inputMinuta.fechaFinal, "YYYY-MM-DD");
      const diasMenus = fechaFinal.diff(fechaInicial, 'days') + 1;
      const plan = usuario.planNutricional;
      
      if(minutaActual){
        await minutaActual.deleteOne();
      }

      const minuta = new Minuta({
        fechaInicialPlanificarMenus: inputMinuta.fechaInicial,
        fechaFinalPlanificarMenus: inputMinuta.fechaFinal,
        diasMenus: diasMenus,
        menus: {},
        usuarioId: usuario
      });

      const alimentosUsuario = await AlimentosUsuario.findOne({usuarioId:usuario});
      
      let inputIntolerancias = [];
      const grupoAlimentos = ['proteinaAnimal','proteinaVegetal']
      console.log('intolerancias: ' + inputIntolerancias);
   
      //const menus = await Menu.find({comidaDia:'almuerzo'});
      if(inputMinuta.intolerancias.length > 0){
        console.log(inputMinuta.intolerancias)
        console.log(inputMinuta.intolerancias.length)
        inputIntolerancias = inputMinuta.intolerancias.split(',');
        inputIntolerancias.forEach(intolerancia => {
          console.log('intolerancia: ' + intolerancia)
          const existeIntolerancia = usuario.intolerancias.includes(intolerancia);
          if(!existeIntolerancia){
            usuario.intolerancias.push(intolerancia);
            console.log(intolerancia)
          }
          Object.keys(alimentosUsuario.toJSON()).forEach(propiedad => {
            const esGrupoAlimentos = grupoAlimentos.includes(propiedad);
            if(propiedad === 'proteinaAnimal'){
              const nuevaLista = []
              for(let alimento of alimentosUsuario.proteinaAnimal){
                if(alimento.tipoProteina[1] !== intolerancia){
                  nuevaLista.push(alimento);
                }
              }
              alimentosUsuario.proteinaAnimal = nuevaLista;
            }else if(esGrupoAlimentos && !propiedad === 'proteinaAnimal'){
              alimentosUsuario[propiedad].map(alimento => {
                if(alimento.nombreAlimento === intolerancia){
                  alimentosUsuario[propiedad].splice(alimentosUsuario[propiedad].indexOf(alimento),1)      
                }  
              })
            }else if(propiedad === 'salsas'){
                for(const tipoSalsa in alimentosUsuario.salsas.toJSON()){
                  alimentosUsuario.salsas[tipoSalsa].map(salsa =>{
                    const existeIntolerancia = salsa.ingredientes.includes(intolerancia);
                    if(existeIntolerancia){
                      alimentosUsuario.salsas[tipoSalsa].splice(alimentosUsuario.salsas[tipoSalsa].indexOf(alimento),1)  
                    }
                  })        
                }  
            }
        })
        })    
      }    
    
      await alimentosUsuario.save();

      const minutaPlan = await minuta.agregarMenusMinuta(fechaInicial,diasMenus,alimentosUsuario, plan,usuario);
    
      console.log(minutaPlan)
      await usuario.save();
        
      return {
        ...minutaPlan._doc, 
        _id: minutaPlan._id.toJSON(),
        fechaInicial: minutaPlan.fechaInicialPlanificarMenus,
        fechaFinal: minutaPlan.fechaFinalPlanificarMenus,
        diasMenus: minutaPlan.diasMenus,
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

      const minuta = await Minuta.findOne({usuarioId:usuario});
      console.log(minuta)
          
      return {
        ...minuta._doc,
        _id: minuta._id.toString(),
        fechaInicial: minuta.fechaInicialPlanificarMenus,
        fechaFinal: minuta.fechaFinalPlanificarMenus,
        diasMenus: minuta.diasMenus,
        diasMinuta : minuta.diasMinuta,
        menus: minuta.menus
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
      const listaAlimentos = await Alimento.find();
      const alimentos = [];
      listaAlimentos.forEach(alimento =>{
        if(alimento.tipoAlimento === 'proteina'){
          if(!alimentos.includes(alimento.tipoProteina[1]))
          alimentos.push(alimento.tipoProteina[1])
        }else{
          alimentos.push(alimento.nombreAlimento); 
        }
      });
      
      return{
        intolerancias:intolerancias,
        alimentos:alimentos
      }
    }
}