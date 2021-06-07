const mongoose = require('mongoose'); 

const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
  nombre : {
    type : String,
    required : true
  },
  email : {
    type : String,
    required : true
  },
  password : {
    type : String,
    required : true
  },
  resetToken : String,
  resetTokenExpiration : Date,
  planNutricional: {
    desayuno : {
      type: [String],
      required: true  
    },
    mediaManana : {
      type: [String],
      required: true 
    },
    almuerzo : {
      type: [String],
      required: true 
    },
    algo : {
      type: [String],
      required: true 
    },
    cena : {
      type: [String],
      required: true  
    },
    refrigerio: {
      type: [String],
      required: true  
    }
  },  
  tienePlan: false,
  intolerancias: [],
  menusMinutas:{},
  totalMenusMinuta: Number
});

usuarioSchema.methods.guardarMenusMinuta = function(nuevoMenu,comidaDia){
  if(!this.menusMinutas){
    this.menusMinutas = {};
  }
  if(!this.menusMinutas.hasOwnProperty(comidaDia)){
      this.menusMinutas[comidaDia] = [nuevoMenu]
  }else{
    if(this.menusMinutas[comidaDia].length < 20){
      this.menusMinutas[comidaDia].push(nuevoMenu);  
    }else{
      this.menusMinutas[comidaDia].splice(0, 20);
      this.menusMinutas[comidaDia].push(nuevoMenu);  
    }
  }
}

usuarioSchema.methods.establecerTotalMenus = function(diasMenus){
  if(this.totalMenusMinuta < 20){
    this.totalMenusMinuta += diasMenus;
    console.log(this.totalMenusMinuta);
  }else{
    this.totalMenusMinuta = 0;
    this.totalMenusMinuta += diasMenus;
    console.log(this.totalMenusMinuta);

  }

  if(this.totalMenusMinuta > 20){
    return this.totalMenusMinuta -=  20;
  }else{
    return this.totalMenusMinuta
  }  
}

usuarioSchema.methods.establecerDiaMinuta20 = function(diasMenus){
  let diaMinuta20;
  const totalDiasMinuta = this.menusMinutas['desayuno'].length
   
  diaMinuta20 = totalDiasMinuta - diasMenus + 1;
  return diaMinuta20;
}

module.exports = mongoose.model('Usuario', usuarioSchema);

