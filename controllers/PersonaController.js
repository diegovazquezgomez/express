import models from "../models";

export default {
  // agrega una persona
  add: async (req, res, next) => {
    try {
      const reg = await models.Persona.create(req.body);
      res.status(200).json(reg);
    } catch (error) {
      res.status(500).send({
        message: "Ocurrió un error",
      });
      next(error);
    }
  },

  // consulta una persona
  query: async (req, res, next) => {
    try {
      const reg = await models.Persona.findOne({ _id: req.query._id }); // la propiedad _id la añade mongo a cada coleccion
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
  // listamos las personas
  list: async (req, res, next) => {
    let valor = req.query.valor;
    try {
      const reg = await models.Persona.find(
        {
          // primer paremtro indica la  busqueda y el segundo
          $or: [
            { nombre: new RegExp(valor, "i") },
            { email: new RegExp(valor, "i") },
          ],
        },
        { createdAt: 0 }
      ) // propiedades filtradas
        .sort({ createdAt: -1 }); // ordenamos por la Persona más reciente
      res.status(200).json(reg);
    } catch (error) {
      res.status(500).send({
        message: "Ocurrió un error",
      });
      next(error);
    }
  },
  // listamos los clientes
  listClientes: async (req, res, next) => {
    try {
      let valor = req.query.valor;
      const reg = await models.Persona.find(
        {
          $or: [
            { nombre: new RegExp(valor, "i") },
            { email: new RegExp(valor, "i") },
          ],
          tipo_persona: "Cliente",
        },
        { createdAt: 0 }
      ).sort({ createdAt: -1 });
      res.status(200).json(reg);
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error",
      });
      next(e);
    }
  },
  // listamos los Proveedores
  listProveedores: async (req, res, next) => {
    try {
      let valor = req.query.valor;
      const reg = await models.Persona.find(
        {
          $or: [
            { nombre: new RegExp(valor, "i") },
            { email: new RegExp(valor, "i") },
          ],
          tipo_persona: "Proveedor",
        },
        { createdAt: 0 }
      ).sort({ createdAt: -1 });
      res.status(200).json(reg);
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error",
      });
      next(e);
    }
  },
  // listamos las Personas por busqueda
  search: async (req, res, next) => {
    try {
      let valor = req.query.valor;
      const reg = await models.Persona.find(
        {
          $or: [
            { nombre: new RegExp(valor, "i") },
            { email: new RegExp(valor, "i") },
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

  // actualizamos  los Personas
  update: async (req, res, next) => {
    try {
      const reg = await models.Persona.findByIdAndUpdate(
        { _id: req.body._id }, // id para buscar el registro a modificar
        {
          tipo_persona: req.body.tipo_persona,
          nombre: req.body.nombre,
          tipo_documento: req.body.tipo_documento,
          num_documento: req.body.num_documento,
          direccion: req.body.direccion,
          telefono: req.body.telefono,
          email: req.body.email,
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

  // eliminamos el Persona
  remove: async (req, res, next) => {
    try {
      const reg = await models.Persona.findByIdAndDelete({
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
  // activamos el Persona
  activate: async (req, res, next) => {
    try {
      const reg = await models.Persona.findByIdAndUpdate(
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
  // desactivamos el Persona
  deactivate: async (req, res, next) => {
    try {
      const reg = await models.Persona.findByIdAndUpdate(
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
