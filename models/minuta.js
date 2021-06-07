const mongoose = require('mongoose'); 
const moment = require('moment');

//const tipoAlimentos = require('./grupoAlimentos');
const Menu = require('./menu');
const AlimentosUsuario = require('./alimentosUsuario');
const { planUsuario } = require('../graphql/resolvers');

const Schema = mongoose.Schema;

const minutaSchema = new Schema({
  fechaInicialPlanificarMenus: String,
  fechaFinalPlanificarMenus: String,
  diasMinuta: [],
  diasMenus:Number,
  menus: {},  
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

minutaSchema.methods.escogerMetodoCoccion = function(diaSemana,proteina){
  const diasSemana = ['Lunes','Martes', 'Miercoles', 'Jueves','Viernes'];
  const coccionesRapidas = [];

  if(diasSemana.includes(diaSemana)){
      proteina.coccionYcorte.forEach(element => {
          if(element.tiempo === 'rapido'){
              coccionesRapidas.push(element)
          }
      });
      const indexCoccionYcorte = Math.floor(Math.random() * coccionesRapidas.length)
      const coccionYcorte = proteina.coccionYcorte[indexCoccionYcorte]
      console.log('coccion y corte' + coccionYcorte)
      return coccionYcorte
  }
  
}

minutaSchema.methods.escogerProteinaReceta = function(diaMinuta,diaSemana,alimentos){
  const cantidadProteinas = alimentos.proteinaAnimal.length;
  console.log('cantidad proteinas:' + cantidadProteinas)
  console.log('dia minuta:' + diaMinuta)
  console.log('dia semana:' + diaSemana)

  const proteinaCoccion = {}
  let proteina;
  
      if(cantidadProteinas === 1){
          proteina = alimentos.proteinaAnimal[0]
      }else if(cantidadProteinas > 1){
          if(diaMinuta <= cantidadProteinas){
              proteina = alimentos.proteinaAnimal[diaMinuta]
          }else if(diaMinuta > cantidadEsquemas){
              let diferencia = diaMinuta - (cantidadProteinas * Math.floor(diaMinuta / cantidadProteinas)) - 1
              if(diferencia === -1){
                  proteina = alimentos.proteinaAnimal[alimentos.proteinaAnimal.length-1]
                      //esquemaComidaDia = esquema[comidaDi[esquema][comidaDia].length -1]
              }else{
                  proteina =  alimentos.proteinaAnimal[diferencia]
              }
          }
      }
      const coccionYcorte = this.escogerMetodoCoccion(diaSemana,proteina)
      proteinaCoccion['tipoProteina'] = proteina.tipoProteina[1]
      proteinaCoccion['nombrealimento'] = proteina.nombreAlimento
      proteinaCoccion['corte'] = coccionYcorte.corte
      proteinaCoccion['coccion'] = coccionYcorte.coccion
      console.log(proteinaCoccion)
      return proteinaCoccion;
}

minutaSchema.methods.armarReceta = function(diaSemana,diaMinuta,usuario,alimentos){
  const receta = {};
  
  const coccionProteina = this.escogerProteinaReceta(diaMinuta,diaSemana,alimentos);       
              /*while(Object.keys(coccionProteina).length < 1){  
                  corte['cocciones'].some(coccionCorte => {
                      console.log(coccionCorte)
                      if(coccionCorte.tiempo === 'rapido'){
                          coccionProteina['tipoProteina'] = proteina.tipoProteina[1] 
                          coccionProteina['corte'] = corte.nombreCorte 
                          coccionProteina['coccion'] = coccionCorte.coccion
                          coccionProteina['tiempo'] = coccionCorte.tiempo
                      }
                  })
              }*/       
  const crearNombreRecetaSalsa = (corteProteina,ingredienteSecundario) => {
      const palabrasConectoras = ['con acento de','al estilo de', 'a la', 'con', 'en'];
      let indiceRandom = Math.floor(Math.random() * palabrasConectoras.length);
      let palabraConectora = palabrasConectoras[indiceRandom];
    
      let nombreReceta = `${corteProteina} ${palabraConectora} ${ingredienteSecundario}`;
      
      return nombreReceta 
  }
  
  let salsa;
  
  const buscarSalsa = tipoSalsa => {
    if(diaMinuta === 0){
      salsa = alimentos.salsas[tipoSalsa][0];
      console.log(salsa)
      return salsa
    }
    /*else{
       const ultimaSalsaMinuta = this.minutas[0].menus.almuerzo[menus.almuerzo.length -1].receta.salsa.nombre;
       console.log('ultima salsa: ' + ultimaSalsa);
       const indixUltimaSalsa = alimentos.salsas[tipoSalsa].findIndex(salsa => salsa.nombre === ultimaSalsa);
       console.log('index salsa: ' + indixUltimaSalsa);
       const salsa = alimentos.salsas[tipoSalsa][indixUltimaSalsa + 1];
       return salsa
    }         
      }*/else{
        const ultimaSalsaMinuta = usuario.menusMinutas.almuerzo[usuario.menusMinutas.almuerzo.length -1].receta.salsa.nombre;
        console.log('ultima salsa: ' + ultimaSalsaMinuta);
        const indixUltimaSalsa = alimentos.salsas[tipoSalsa].findIndex(salsa => salsa.nombre === ultimaSalsaMinuta);
        console.log('index salsa: ' + indixUltimaSalsa);
        salsa = alimentos.salsas[tipoSalsa][indixUltimaSalsa + 1];
        return salsa
      }
  }

  if(coccionProteina.tipoProteina === 'carne roja'){        
      console.log(buscarSalsa('coccionesRapidasCarnesRojas'))
      console.log('salsa carne roja')
  }else if(coccionProteina.tipoProteina === 'carne blanca'){
      console.log(buscarSalsa('coccionesRapidasCarnesBlancas'))
      console.log('salsa carne blanca')
  }else if(coccionProteina.tipoProteina === 'pescado'){
      console.log(buscarSalsa('coccionesRapidasPescado'))
      console.log('salsa pescado')
  }
  
  receta['salsa'] =  {
      nombre: salsa.nombre,
      ingredientes: salsa.ingredientes,
      preparacion: salsa.preparacion
  }
  receta['nombre'] = crearNombreRecetaSalsa(coccionProteina.corte,receta.salsa.nombre);
  receta['proteina'] = coccionProteina.tipoProteina;
  receta['corteProteina'] = coccionProteina.corte;
  receta['coccionProteina'] = coccionProteina.coccion;
  receta['preparacion'] = '';

  return receta;

}

minutaSchema.methods.agregarMenuComida = function(comidaDia,alimentos,dia,diaMinuta,usuario){
  /*const planDia = {};
          planUsuario[comidaDia].map(tipoAlimento => {
            planDia[tipoAlimento] = [];
          });
      
      return planDia*/
  const menuComida = {}    
  
  /*const esquema = alimentos.escogerEsquemaMenu(diaMinuta,comidaDia)
  console.log('esquema:' + esquema)*/
  console.log(dia)
  let diaSemana = dia.split(' ',1).toString();
  console.log(diaSemana);
  menuComida['dia'] = dia; 
  menuComida['nombreMenu'] = '';  
  if(comidaDia === 'almuerzo'){
    menuComida['receta'] = this.armarReceta(diaSemana,diaMinuta,usuario,alimentos);
  }
  menuComida['ingredientes'] = [];
  menuComida['preparacion'] = '';
  
  usuario.guardarMenusMinuta(menuComida,comidaDia);
  console.log(usuario.menusMinutas)
  return menuComida;
};

minutaSchema.methods.agregarMenusMinuta = function(fechaInicial,diasMenus,alimentos,planUsuario,usuario){

  const modificarFormatoFecha = fecha => {
    let nuevoFormatoFecha = `${this.asignarDiaSemana(fecha)} ${fecha.date()} ${this.asignarMes(fecha)}`;
    return nuevoFormatoFecha;
  };
   
  const totalMenusMinuta = usuario.establecerTotalMenus(diasMenus);
  let diaMinuta
  if(totalMenusMinuta === 0){
    diaMinuta = 0;
    totalMenusMinuta = diasMenus
  }else{
    diaMinuta = totalMenusMinuta - diasMenus; 
  }

  for(let dia = diaMinuta ; dia < totalMenusMinuta; dia++){
    let fechaMinuta; 
    console.log(dia)
    console.log(diaMinuta)
    console.log(totalMenusMinuta)
    if(dia === diaMinuta){
      fechaMinuta = fechaInicial;
    }else{
      fechaMinuta = fechaInicial.add(1,'days');
    }
    let diaSemana = modificarFormatoFecha(fechaMinuta)
    this.diasMinuta.push(diaSemana);
    for(const comidaDia in planUsuario.toJSON()){
      if(planUsuario[comidaDia].length > 0){
        if(!this.menus.hasOwnProperty(comidaDia)){
           this.menus[comidaDia] = [this.agregarMenuComida(comidaDia,alimentos,diaSemana,dia,usuario)] 
        }else{
          this.menus[comidaDia].push(this.agregarMenuComida(comidaDia,alimentos,diaSemana,dia,usuario))
        }
      }   
    }
  }
  return this.save();
};

module.exports = mongoose.model('Minuta', minutaSchema);