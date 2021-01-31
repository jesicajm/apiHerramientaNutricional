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
    refrigerio : {
      type: [String],
      required: true  
    }
  },
  intolerancias: [],
  minutas:[]
});

module.exports = mongoose.model('Usuario', usuarioSchema);