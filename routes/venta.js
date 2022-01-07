import routerx from "express-promise-router";
import ventaController from "../controllers/ventaController";
import auth from "../middlewares/auth";

const router = routerx();

router.post("/add", auth.verifyVendedor, ventaController.add);
router.get("/query", auth.verifyVendedor, ventaController.query);
router.get("/list",  auth.verifyVendedor, ventaController.list);
router.get("/search", auth.verifyVendedor, ventaController.search);
router.get("/grafico12Meses", auth.verifyUsuario, ventaController.grafico12Meses);
router.get("/consultaFechas",  auth.verifyUsuario, ventaController.consultaFechas);
router.put("/activate", auth.verifyVendedor, ventaController.activate);
router.put("/deactivate", auth.verifyVendedor, ventaController.deactivate);


export default router;