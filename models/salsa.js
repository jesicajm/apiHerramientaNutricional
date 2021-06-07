const mongoose = require('mongoose'); 

const Schema = mongoose.Schema;

const salsaSchema = new Schema({ 
        nombre: {type: String, required: true },
        tipoProteina: String, 
        tiempoCoccion: String,
        preparacion: String,
        ingredientes: []
});

/*const Salsa = mongoose.model('Salsa', salsaSchema);

const salsa = new Salsa({
        nombre: 'salsa de pomodoro',
        tipoProteina: 'pescado', 
        tiempoCoccion: 'rapido',
        preparacion: '',
        ingredientes: ['tomate']
});

salsa.save().then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
});*/

module.exports = mongoose.model('Salsa', salsaSchema);