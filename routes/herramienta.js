const express = require('express'); 

const router = express.Router(); 

const herramientaController = require('../controller/herramienta');

const isAuth = require('../middleware/is-auth');

//router.getInicio('/', herramientaController.getInicio);
router.post('/plan-nutricional', isAuth, herramientaController.postPlanUsuario);

module.exports = router;