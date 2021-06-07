const mongoose = require('mongoose'); 
const { find } = require('./menu');

const Menu = require('./menu');
const Minuta = require('./minuta'); 
const Schema = mongoose.Schema;

const alimentosUsuarioSchema = new Schema({
    proteinaAnimal:[],
    proteinaVegetal:[
        /*{
         nombreAlimento : {type: String, required: true },
         tipoProteinaAnimal: {type: String, required: true },
         cortes: [{type: String, required: true }],
        }*/
    ],
    proteinasCoccionRapida:{},
    salsas: {
        coccionesRapidasCarnesRojas: [],
        coccionesLentasCarnesRojas: [],
        coccionesRapidasCarnesBlancas: [],
        coccionesLentasCarnesBlancas: [],
        coccionesRapidasPescado: [],
        coccionesLentasPescado: []
    },
    esquemas:[],
    usuarioId : {
        type : Schema.Types.ObjectId,
        ref:'Usuario',
        required : true
    }
});

alimentosUsuarioSchema.methods.clasificarAlimentosYsalsas = async function(alimentos,salsas){
    alimentos.forEach(alimento => {
        if(alimento.tipoAlimento === 'proteina'){
            if(alimento.tipoProteina[0] === 'animal'){
              console.log(alimento)
              this.proteinaAnimal.push(alimento)
            }else{
              this.proteinaVegetal.push(alimento)
            }
        }
    })
   
    salsas.forEach(salsa => {
        if(salsa.tipoProteina === 'carne roja' && salsa.tiempoCoccion === 'rapdo' ){
            this.salsas.coccionesRapidasCarnesRojas.push(salsa);
        }else if(salsa.tipoProteina === 'carne roja' && salsa.tiempoCoccion === 'lento'){
            this.salsas.coccionesLentasCarnesRojas.push(salsa);
        }else if(salsa.tipoProteina === 'carne blanca' && salsa.tiempoCoccion === 'rapido'){
            this.salsas.coccionesRapidasCarnesBlancas.push(salsa)
        }else if(salsa.tipoProteina === 'carne blanca' && salsa.tiempoCoccion === 'lento'){
            this.salsas.coccionesLentasCarnesBlancas.push(salsa)
        }else if(salsa.tipoProteina === 'pescado' && salsa.tiempoCoccion === 'rapido'){
            console.log(salsa)
            this.salsas.coccionesRapidasPescado.push(salsa);
        }else if(salsa.tipoProteina === 'pescado' && salsa.tiempoCoccion === 'lento'){
            this.salsas.coccionesLentasPescado.push(salsa)
        }
    })

}

alimentosUsuarioSchema.methods.guardarEsquemasUsuario = function(menus,planUsuario){   
    for(const comidaDia in planUsuario.toJSON()){
        if(planUsuario[comidaDia].length > 0){
           let objetoComida = {}
           const menu = new Menu({
            composicion: planUsuario[comidaDia]
           });
           objetoComida[comidaDia] = menu
           this.esquemas.push(objetoComida)
        }
    }

    /*this.esquemas.forEach(esquema => {
       let comidaDia = Object.keys(esquema)[0];
       console.log(comidaDia)
       
       if(esquema[comidaDia].length === 0){
        const menu = new Menu({
        composicion: planUsuario[comidaDia]
        });
        esquema[comidaDia].push(menu)

       menus.forEach(menu => {
            if(menu.comidaDia === comidaDia){
                const mismoEsquemaNutricional = menu['composicion'].length === planUsuario[comidaDia].length && menu['composicion'].every(alimento => planUsuario[comidaDia].includes(alimento))
                if(mismoEsquemaNutricional){
                    esquema[comidaDia].push(menu) 
                }
            if(esquema[comidaDia].length === 0){
                const menu = new Menu({
                comidaDia: comidaDia,
                composicion: planUsuario[comidaDia]
                });
                esquema[comidaDia].push(menu)
            }
       }); 
    })*/

    return this.save();
}


const AlimentosUsuario = mongoose.model('AlimentosUsuario', alimentosUsuarioSchema);

module.exports = mongoose.model('AlimentosUsuario', alimentosUsuarioSchema);
