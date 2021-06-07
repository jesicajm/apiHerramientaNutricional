const mongoose = require('mongoose'); 

const Schema = mongoose.Schema;

const alimentoSchema = new Schema({ 
        nombreAlimento: {type: String, required: true },
        tipoAlimento: {type: String, required: true },
        tipoProteina: [],
        coccionYcorte:[
         {
           corte: String,
           tierna: Boolean,
           coccion: String,
           textura: String,
           tiempo: String,
         }
        ]
});

const Alimento = mongoose.model('Alimento', alimentoSchema)

const alimento = new Alimento({
  nombreAlimento: 'costilla',
  tipoAlimento: 'proteina',
  tipoProteina: ['animal','carne de res'],
  coccionYcorte:[
    {
      corte: 'asado de tira',
      tierna: false,
      coccion: '',
      textura: '',  
      tiempo: 'lento' 
    }
  ]     
});

//alimento.save();

module.exports = mongoose.model('Alimento', alimentoSchema);




