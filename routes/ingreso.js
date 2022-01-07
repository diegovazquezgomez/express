import routerx from "express-promise-router";
import ingresoController from "../controllers/ingresoController";
import auth from "../middlewares/auth";

const router = routerx();

router.post("/add", auth.verifyAlmacenero, ingresoController.add);
router.get("/query", auth.verifyAlmacenero, ingresoController.query);
router.get("/list",  auth.verifyAlmacenero, ingresoController.list);
router.get("/search", auth.verifyAlmacenero, ingresoController.search);
router.get("/grafico12Meses", auth.verifyUsuario, ingresoController.grafico12Meses);
router.get("/consultaFechas",  auth.verifyUsuario, ingresoController.consultaFechas);
router.put("/activate", auth.verifyAlmacenero, ingresoController.activate);
router.put("/deactivate", auth.verifyAlmacenero, ingresoController.deactivate);

export default router;