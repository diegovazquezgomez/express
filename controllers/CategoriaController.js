import models from "../models";
export default {
  // agrega una categoria
  add: async (req, res, next) => {
    try {
      const reg = await models.Categoria.create(req.body);
      res.status(200).json(reg);
    } catch (error) {
      res.status(500).send({
        message: "Ocurrió un error",
      });
      next(error);
    }
  },

  // consulta una categoria
  query: async (req, res, next) => {
    try {
      const reg = await models.Categoria.findOne({ _id: req.query._id }); // la propiedad _id la añade mongo a cada coleccion
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
  // listamos las categorias
  list: async (req, res, next) => {
    let valor = req.query.valor;
    try {
      const reg = await models.Categoria.find({ // primer paremtro indica la  busqueda y el segundo 
        $or: [
          { 'nombre': new RegExp(valor, 'i') },
          { 'descripcion': new RegExp(valor, 'i') }
        ]
      }, { createdAt: 0 }) // propiedades filtradas
        .sort({ 'createdAt': -1 }); // ordenamos por la categoria más reciente
      res.status(200).json(reg);
    } catch (error) {
      res.status(500).send({
        message: "Ocurrió un error",
      });
      next(error);
    }
  },
  // listamos las categorias por busqueda
  search: async (req, res, next) => {
    try {
      let valor = req.query.valor;
      const reg = await models.Categoria.find(
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

  // actualizamos las categorias
  update: async (req, res, next) => {
    try {
      const reg = await models.Categoria.findByIdAndUpdate(
        { _id: req.body._id }, // id para buscar el registro a modificar
        { nombre: req.body.nombre, descripcion: req.body.descripcion } // campos que se modificarán
      );
      res.status(200).json(reg);
    } catch (error) {
      res.status(500).send({
        message: "Ocurrió un error",
      });
      next(error);
    }
  },

  // eliminamos la categoria
  remove: async (req, res, next) => {
    try {
      const reg = await models.Categoria.findByIdAndDelete({
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
  // activamos la categoria
  activate: async (req, res, next) => {
    try {
      const reg = await models.Categoria.findByIdAndUpdate(
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
  // desactivamos la categoria
  deactivate: async (req, res, next) => {
    try {
      const reg = await models.Categoria.findByIdAndUpdate(
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
};
