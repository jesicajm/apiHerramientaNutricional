const mongoose = require('mongoose'); 

const Schema = mongoose.Schema;

const menuSchema = new Schema({ 
        comidaDia:String,
        tipoEsquema:String,
        composicion:[]
});


menuSchema.statics.escogerTipoMenu = async function(planUsuario,comidaDia){
    const esquemasMenus = await this.find({comidaDia:comidaDia});
    console.log('esquemas:', esquemasMenus)
    const esquemas = [];
    
    esquemasMenus.forEach(esquema => {
        const tienenMismosAlimentos = esquema['composicion'].length === planUsuario[comidaDia].length && esquema['composicion'].every(alimento => planUsuario[comidaDia].includes(alimento)) 
        console.log(tienenMismosAlimentos);
        if(tienenMismosAlimentos){
            esquemas.push(esquema);
        }
    })

   /*if(esquemas.length > 1){
     const esquemaMenu = Math.floor(Math.random() * esquemasMenu.length); 
   } */
   return(esquemas)
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
