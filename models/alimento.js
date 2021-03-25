const mongoose = require('mongoose'); 

const Schema = mongoose.Schema;

const alimentoSchema = new Schema({ 
        nombreAlimento: {type: String, required: true },
        tipoAlimento: {type: String, required: true },
        tipoProteina: [],
        cortes: [],
        tierna: Boolean
});

//const Alimento = mongoose.model('Alimento', alimentoSchema)


module.exports = mongoose.model('Alimento', alimentoSchema);




