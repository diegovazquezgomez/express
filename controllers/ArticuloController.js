import models from "../models";
export default {
  // agrega una Articulo
  add: async (req, res, next) => {
    try {
      const reg = await models.Articulo.create(req.body);
      res.status(200).json(reg);
    } catch (error) {
      res.status(500).send({
        message: "Ocurrió un error",
      });
      next(error);
    }
  },

  // consulta una Articulo
  query: async (req, res, next) => {
    try {
      const reg = await models.Articulo.findOne({
        _id: req.query._id,
      }).populate("categoria", { nombre: 1 }); // la propiedad _id la añade mongo a cada coleccion
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
  // consulta una Articulo por codigo de barras
  queryCodigo: async (req, res, next) => {
    try {
      const reg = await models.Articulo.findOne({
        codigo: req.query.codigo,
      }).populate("categoria", { nombre: 1 }); // la propiedad _id la añade mongo a cada coleccion
      if (!reg) {
        res.status(404).send({
          // status - not found
          message: "El registro no existe",
        });
      } else {
        res.status(200||204).json(reg); // status - encontrado y devolvemos mediante json
      }
    } catch (error) {
      res.status(500).send({
        message: "Ocurrió un error",
      });
      next(error);
    }
  },
  // listamos los Articulos
  list: async (req, res, next) => {
    let valor = req.query.valor;
    try {
      const reg = await models.Articulo.find(
        {
          // primer paremtro indica la  busqueda y el segundo
          $or: [
            { nombre: new RegExp(valor, "i") },
            { descripcion: new RegExp(valor, "i") },
          ],
        },
        { createdAt: 0 }
      ) // propiedades filtradas
        .populate("categoria", { nombre: 1 })
        .sort({ createdAt: -1 }); // ordenamos por la Articulo más reciente
      res.status(200).json(reg);
    } catch (error) {
      res.status(500).send({
        message: "Ocurrió un error",
      });
      next(error);
    }
  },
  // listamos las Articulos por busqueda
  search: async (req, res, next) => {
    try {
      let valor = req.query.valor;
      const reg = await models.Articulo.find(
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

  // actualizamos las Articulos
  update: async (req, res, next) => {
    try {
      const reg = await models.Articulo.findByIdAndUpdate(
        { _id: req.body._id }, // id para buscar el registro a modificar
        {
          categoria: req.body.categoria,
          codigo: req.body.codigo,
          nombre: req.body.nombre,
          descripcion: req.body.descripcion,
          precio_venta: req.body.precio_venta,
          stock: req.body.stock,
        } // campos que se modificarán
      );
      res.status(200).json(reg);
    } catch (error) {
      res.status(500).send({
        message: "Ocurrió un error",
      });
      next(error);
    }
  },

  // eliminamos la Articulo
  remove: async (req, res, next) => {
    try {
      const reg = await models.Articulo.findByIdAndDelete({
        _id: req.body._id,
      });
      res.status(200).json(reg);
    } catch (error) {
      res.status(500).send({
        message: "Ocurrió un error",
      });
      next(error);
    }
  },
  // activamos la Articulo
  activate: async (req, res, next) => {
    try {
      const reg = await models.Articulo.findByIdAndUpdate(
        { _id: req.body._id },
        { estado: 1 }
      );
      res.status(200).json(reg);
    } catch (error) {
      res.status(500).send({
        message: "Ocurrió un error",
      });
      next(error);
      console.log(Date());
    }
  },
  // desactivamos la Articulo
  deactivate: async (req, res, next) => {
    try {
      const reg = await models.Articulo.findByIdAndUpdate(
        { _id: req.body._id },
        { estado: 0 }
      );
      res.status(200).json(reg);
      console.log(Date());
    } catch (error) {
      res.status(500).send({
        message: "Ocurrió un error",
      });
      next(error);
    }
  },

  comprar: async (req, res, next) => {
    try {
      let { stock } = await models.Articulo.findOne({ _id: req.body._id });
      let nuevoStock = parseInt(stock) - parseInt(1); //modificar cuando sea mas cantidad
      const reg = await models.Articulo.findByIdAndUpdate(
        { _id: req.body._id },
        { stock: nuevoStock }
      );
      res.status(200).json(reg);
      console.log(Date());
    } catch (error) {
      res.status(500).send({
        message: "Ocurrió un error",
      });
      next(error);
    }
  },
  devolucion: async (req, res, next) => {
    try {
      let { stock } = await models.Articulo.findOne({ _id: req.body._id });
      let nuevoStock = parseInt(stock) + parseInt(1); //modificar cuando sea mas cantidad
      const reg = await models.Articulo.findByIdAndUpdate(
        { _id: req.body._id },
        { stock: nuevoStock }
      );
      res.status(200).json(reg);
      console.log(Date());
    } catch (error) {
      res.status(500).send({
        message: "Ocurrió un error",
      });
      next(error);
    }
  },
};
