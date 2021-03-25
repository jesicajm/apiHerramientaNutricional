const mongoose = require('mongoose'); 
const moment = require('moment');

//const tipoAlimentos = require('./grupoAlimentos');
const Menu = require('./menu');
const AlimentosUsuario = require('./alimentosUsuario');

const Schema = mongoose.Schema;

const minutaSchema = new Schema({
  fechaInicialPlanificarMenus:  String,
  fechaFinalPlanificarMenus: String,
  menus: [
    {
      dia: String,
      desayuno: {type: Object, required: true },
      mediaManana: {type: Object, required: true },
      almuerzo: {type: Object, required: true },
      algo: {type: Object, required: true },
      cena: {type: Object, required: true } 
    }  
  ],  
  usuarioId : {
    type : Schema.Types.ObjectId,
    ref:'Usuario',
    required : true
  }
});

minutaSchema.methods.asignarDiaSemana = function(fecha){
  let diaSemana = fecha.day();
  switch (diaSemana) {
    case 0 :
      return 'Domingo';
      break;
    case 1:
      return 'Lunes';
      break;
    case 2:
      return 'Martes';
      break;
    case 3:
      return 'Miercoles';
      break;
    case 4:
      return 'Jueves';
      break;
    case 5:
      return 'Viernes';
      break;
    case 6:
      return 'Sabado';
      break;  
  }
};

minutaSchema.methods.asignarMes = function(fecha){
  let mesFecha = fecha.month();
  switch (mesFecha) {
    case 0 :
      return 'enero';
      break;
    case 1:
      return 'febrero';
      break;
    case 2:
      return 'marzo';
      break;
    case 3:
      return 'abril';
      break;
    case 4:
      return 'mayo';
      break;
    case 5:
      return 'junio';
      break;
    case 6:
      return 'julio';
      break;  
    case 7:
      return 'agosto';
      break;  
    case 8:
      return 'septiemre';
      break;
    case 9:
      return 'octubre';
      break;  
    case 10:
      return 'noviembre';
      break;        
    case 11:
      return 'diciembre';
      break;      
    }  
};

minutaSchema.methods.agregarMenuComida = (planUsuario,comidaDia,alimentos,dia)=>{
  /*const planDia = {};
          planUsuario[comidaDia].map(tipoAlimento => {
            planDia[tipoAlimento] = [];
          });
      
      return planDia*/
  const menu = {
    nombreMenu: '',
    ingredientes: '',
    preparcion: ''
  }
   
  const esquema = Menu.escogerTipoMenu(planUsuario,comidaDia)

  if(esquema.tipoEsquema === 'tres estaciones'){
    alimentos.armarReceta(dia) 
  }
  
  return menu
};

/*minutaSchema.methods.escogerTipoMenu = function(comidaDia){
   
}*/

minutaSchema.methods.agregarMenusMinuta = function(fechaInicial,diasMenus,plan){

  const modificarFormatoFecha = fecha => {
    let nuevoFormatoFecha = `${this.asignarDiaSemana(fecha)} ${fecha.date()} ${this.asignarMes(fecha)}`;
    return nuevoFormatoFecha;
  };
  
  this.menus[0].dia = modificarFormatoFecha(fechaInicial);
  
  for(let i = 1; i <= diasMenus; i++){
    let agregarDia = fechaInicial.add(1,'days');
    this.menus.push({
      dia: modificarFormatoFecha(agregarDia),
      desayuno : this.agregarMenuComida(plan,'desayuno',this.dia),
      mediaManana: this.agregarMenuComida(plan,'mediaManana'),
      almuerzo: this.agregarMenuComida(plan,'almuerzo'),
      algo: this.agregarMenuComida(plan,'algo'),
      cena: this.agregarMenuComida(plan,'cena'),
    });
  }
  return this.save();
};

module.exports = mongoose.model('Minuta', minutaSchema);