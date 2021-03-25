const mongoose = require('mongoose'); 

const Schema = mongoose.Schema;

const salsaSchema = new Schema({ 
        nombreSalsa: {type: String, required: true },
        tipoSalsa: {type: String, required: true },
        preparacion: String,
        ingredientes: []
});

/*const Salsa = mongoose.model('Salsa', salsaSchema);

const salsa = new Salsa({
        nombreSalsa: 'salsa de champiñiones',
        tipoSalsa: 'coccion rapida carnes rojas',
        preparacion: '',
        ingredientes: ['Carne de cerdo']
});

salsa.save().then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
       });*/

module.exports = mongoose.model('Salsa', salsaSchema);