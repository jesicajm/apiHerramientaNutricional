const mongoose = require('mongoose'); 

const Schema = mongoose.Schema;

const menuSchema = new Schema({ 
        comidaDia:String,
        tipo:String,
        composicion:[],
        minimoPersonas: Number
});


menuSchema.statics.escogerTipoMenu = async function(planUsuario,comidaDia){
    const esquemasMenus = await AlimentosUsuario.find({comidaDia:comidaDia});
        /*if(esquemas.length > 1){
            const esquemaMenu = Math.floor(Math.random() * esquemas.length); 
        } */
        console.log(AlimentosUsuario.esquemas);
        
}
 

//Menu.escogerTipoMenu('almuerzo')
/*const menu = new Menu({
        comidaDia: 'almuerzo',
        tipoEsquema:'plato unico',
        composicion:[]
});

menu.save()
    .then(result => {
        console.log(result);
    })
    .catch(err => {
        console.log(err);
    });*/

module.exports = mongoose.model('Menu', menuSchema);
