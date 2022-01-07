import models from "../models";

async function aumentarStock(idarticulo, cantidad) {
  let { stock } = await models.Articulo.findOne({ _id: idarticulo });
  let nuevoStock = parseInt(stock) + parseInt(cantidad);
  const reg = await models.Articulo.findByIdAndUpdate(
    { _id: idarticulo },
    { stock: nuevoStock }
  );
}

async function disminuirStock(idarticulo, cantidad) {
  let { stock } = await models.Articulo.findOne({ _id: idarticulo });
  let nuevoStock = parseInt(stock) - parseInt(cantidad);
  const reg = await models.Articulo.findByIdAndUpdate(
    { _id: idarticulo },
    { stock: nuevoStock }
  );
}

export default {
  // agrega una Venta
  add: async (req, res, next) => {
    try {
      const reg = await models.Venta.create(req.body);
      //actualizar stock
      let detalles = req.body.detalles;
      detalles.map(function (x) {
        disminuirStock(x._id, x.cantidad);
      });
      res.status(200).json(reg);
    } catch (error) {
      res.status(500).send({
        message: "Ocurrió un error",
      });
      next(error);
    }
  },

  // consulta una Venta
  query: async (req, res, next) => {
    try {
      const reg = await models.Venta.findOne({ _id: req.query._id }) // la propiedad _id la añade mongo a cada coleccion
        .populate("usuario", { nombre: 1 })
        .populate("persona", { nombre: 1 });
      if (!reg) {
        res.status(404).send({
          // status - not found
          message: "El registro no existe",
        });
      } else {
        res.status(200).json(reg); // status - encontrado y devolvemos mediante json
      }
    } catch (error) {
      res.status(500).send({
        message: "Ocurrió un error",
      });
      next(error);
    }
  },
  // listamos las Ventas
  list: async (req, res, next) => {
    let valor = req.query.valor;
    try {
      const reg = await models.Venta.find({
        // primer paremtro indica la  busqueda y el segundo
        $or: [
          { num_comprobante: new RegExp(valor, "i") },
          { serie_comprobante: new RegExp(valor, "i") },
        ],
      })
        .populate("usuario", { nombre: 1 })
        .populate("persona", { nombre: 1 })
        .sort({ createdAt: -1 }); // ordenamos por los Ingreso más reciente
      res.status(200).json(reg);
    } catch (error) {
      res.status(500).send({
        message: "Ocurrió un error",
      });
      next(error);
    }
  },
  // listamos las Ventas por busqueda
  search: async (req, res, next) => {
    try {
      let valor = req.query.valor;
      const reg = await models.Venta.find(
        {
          $or: [
            { nombre: new RegExp(valor, "i") },
            { descripcion: new RegExp(valor, "i") },
          ],
        },
        { createdAt: 0 }
      ).sort({ createdAt: -1 });
      res.status(200).json(reg);
    } catch (error) {
      res.status(500).send({
        message: "Ocurrió un error",
      });
      next(error);
    }
  },

  // activamos la Venta
  activate: async (req, res, next) => {
    try {
      const reg = await models.Venta.findByIdAndUpdate(
        { _id: req.body._id },
        { estado: 1 }
      );
      //Actualizar stock
      let detalles = reg.detalles;
      detalles.map(function (x) {
        disminuirStock(x._id, x.cantidad);
      });
      res.status(200).json(reg);
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error",
      });
      next(e);
    }
  },
  // desactivamos la Venta
  deactivate: async (req, res, next) => {
    try {
      const reg = await models.Venta.findByIdAndUpdate(
        { _id: req.body._id },
        { estado: 0 }
      );
      //Actualizar stock
      let detalles = reg.detalles;
      detalles.map(function (x) {
        aumentarStock(x._id, x.cantidad);
      });
      res.status(200).json(reg);
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error",
      });
      next(e);
    }
  },
  grafico12Meses: async (req, res, next) => {
    try {
      const reg = await models.Venta.aggregate([
        {
          $group: {
            _id: {
              mes: { $month: "$createdAt" },
              year: { $year: "$createdAt" },
            },
            total: { $sum: "$total" },
            numero: { $sum: 1 },
          },
        },
        {
          $sort: {
            "_id.year": -1,
            "_id.mes": -1,
          },
        },
      ]).limit(12);

      res.status(200).json(reg);
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error",
      });
      next(e);
    }
  },
  consultaFechas: async (req, res, next) => {
    try {
      let start = req.query.start;
      let end = req.query.end;
      const reg = await models.Venta.find({
        createdAt: { $gte: start, $lt: end },
      })
        .populate("usuario", { nombre: 1 })
        .populate("persona", { nombre: 1 })
        .sort({ createdAt: -1 });
      res.status(200).json(reg);
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error",
      });
      next(e);
    }
  },
};
