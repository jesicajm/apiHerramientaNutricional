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
  tienePlan : {
    type : String,
  },
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
    refrigerio : {
      type: [String],
      required: true  
    }
  },
  intolerancias: String,
  fechaInicialPlanificarMenus: String,
  fechaFinalPlanificarMenus: String,
});

usuarioSchema.methods.establecerTienePlan = function(resTienePlan){
  this.tienePlan = resTienePlan;
  return this.save();
};

module.exports = mongoose.model('Usuario', usuarioSchema);