import routerx from "express-promise-router";
import articuloController from "../controllers/articuloController";
import auth from "../middlewares/auth";

const router = routerx();

router.post('/add', auth.verifyVendedor, articuloController.add);
router.get('/query', auth.verifyVendedor, articuloController.query);
router.get('/queryCodigo', articuloController.queryCodigo);
router.get('/list',  articuloController.list);
router.put('/comprar', auth.verifyComprador, articuloController.comprar);
router.put('/devolucion', auth.verifyComprador, articuloController.devolucion);
router.get('/search', auth.verifyVendedor, articuloController.search);
router.put('/update', auth.verifyVendedor, articuloController.update);
router.delete('/remove', auth.verifyVendedor, articuloController.remove);
router.put('/activate', auth.verifyVendedor, articuloController.activate);
router.put('/deactivate', auth.verifyVendedor, articuloController.deactivate);

export default router;