const mongoose = require('mongoose'); 

const Schema = mongoose.Schema;

const alimentosUsuarioSchema = new Schema({
    alimentos: [],
    salsas: [],
   /*proteinaAnimal: [
       {
        nombreAlimento : {type: String, required: true },
        tipoProteinaAnimal: {type: String, required: true },
        cortes: [{type: String, required: true }],
        tierna: Boolean  
       }
   ],
   salsas: {
    coccionesRapidasCarnesRojas: [ 
        {
          nombreSalsa: {type: String, required: true },
          ingredientes: [],
          preparacion: {type: String, required: true },
        }
    ],
    coccionesLentasCarnesRojas: [
        {
            nombreSalsa: {type: String, required: true },
            ingredientes: [],
            preparacion: {type: String, required: true },
        }
    ],
    coccionesRapidasCarnesBlancas: [
        {
            nombreSalsa: {type: String, required: true },
            ingredientes: [],
            preparacion: {type: String, required: true },
        }
    ],
    coccionesLentasCarnesBlancas: [
        {
            nombreSalsa: {type: String, required: true },
            ingredientes: [],
            preparacion: {type: String, required: true },
        }
    ]
   },*/
   usuarioId : {
    type : Schema.Types.ObjectId,
    ref:'Usuario',
    required : true
   }
});

alimentosUsuarioSchema.methods.eliminarIntolerancia = function(intolerancia){
     this.alimentos.forEach(alimento => {
        if(alimento.nombreAlimento === intolerancia){
            this.alimentos.splice(this.alimentos.indexOf(alimento),1)      
        }
     })

     this.salsas.forEach(salsa => {
        const existeIntolerancia = salsa.ingredientes.includes(intolerancia);
        if(existeIntolerancia){
            this.salsas.splice(this.salsas.indexOf(salsa),1)      
        }
     })

}

alimentosUsuarioSchema.methods.armarReceta = function(dia){
   if(dia === 'lunes' || dia === 'martes' ||dia === 'miercoles' ||dia === 'jueves' ||dia === 'viernes'){
       const proteinas = []
       this.alimentos.forEach(alimento => {
           if(alimento.tipoAlimento === 'proteina' && alimento.tierna === true){
              proteinas.push(alimento.nombreAlimento);
           }
       })
       console.log(proteinas);
   }
}

const AlimentosUsuario = mongoose.model('AlimentosUsuario', alimentosUsuarioSchema);


module.exports = mongoose.model('AlimentosUsuario', alimentosUsuarioSchema);
