import models from "../models";
import bcrypt from "bcryptjs";
import token from "../services/token";

export default {
  // agrega un usuario
  add: async (req, res, next) => {
    try {
      req.body.password = await bcrypt.hash(req.body.password, 10); // recibimos password, encriptamos
      const reg = await models.Usuario.create(req.body);
      res.status(200).json(reg);
    } catch (error) {
      res.status(500).send({
        message: "Ocurrió un error",
      });
      next(error);
    }
  },

  // consulta un usuario
  query: async (req, res, next) => {
    try {
      const reg = await models.Usuario.findOne({ _id: req.query._id }); // la propiedad _id la añade mongo a cada coleccion
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
  // listamos los usuarios
  list: async (req, res, next) => {
    let valor = req.query.valor;
    try {
      const reg = await models.Usuario.find(
        {
          // primer paremtro indica la  busqueda y el segundo
          $or: [
            { nombre: new RegExp(valor, "i") },
            { email: new RegExp(valor, "i") },
          ],
        },
        { createdAt: 0 }
      ) // propiedades filtradas
        .sort({ createdAt: -1 }); // ordenamos por el usuario más reciente
      res.status(200).json(reg);
    } catch (error) {
      res.status(500).send({
        message: "Ocurrió un error",
      });
      next(error);
    }
  },
  // listamos los usuarios por busqueda
  search: async (req, res, next) => {
    try {
      let valor = req.query.valor;
      const reg = await models.Usuario.find(
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

  // actualizamos  los usuarios
  update: async (req, res, next) => {
    try {
      let pas = req.body.password;
      const reg0 = await models.Usuario.findOne({ _id: req.body._id });
      if (pas != reg0.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
      }
      const reg = await models.Usuario.findByIdAndUpdate(
        { _id: req.body._id },
        {
          rol: req.body.rol,
          nombre: req.body.nombre,
          tipo_documento: req.body.tipo_documento,
          num_documento: req.body.num_documento,
          direccion: req.body.direccion,
          telefono: req.body.telefono,
          email: req.body.email,
          password: req.body.password,
        }
      );
      res.status(200).json(reg);
    } catch (e) {
      res.status(500).send({
        message: "Ocurrió un error",
      });
      next(e);
    }
  },
  /*update: async (req, res, next) => {
        try {
            let pass = req.body.password; // se usará cuando no haga falta encriptar
            const reg0 = await models.Usuario.findOne({
                _id:req.body._id
            }); //el usuario a modificar para analizar si es misma pass

            if (pass != reg0.password) {
                req.body.password = await bcrypt.hast(req.body.password, 10);
            } // si el pass que envia el front end en la modificacion de datos es distinto, modificamos
            
            const reg = await models.Usuario.findByIdAndUpdate(
                { _id: req.body._id }, // id para buscar el registro a modificar
                {
                    rol: req.body.rol,
                    nombre: req.body.nombre,
                    tipo_documento: req.body.tipo_documento,
                    num_documento: req.body.num_documento,
                    direccion: req.body.direccion,
                    telefono: req.body.telefono,
                    email: req.body.email,
                    password: req.body.password
                } // campos que se modificarán
            );
            res.status(200).json(reg);
        } catch (error) {
            res.status(500).send({
                message: "Ocurrió un error",
            });
            next(error);
        }
    },*/

  // eliminamos el usuario
  remove: async (req, res, next) => {
    try {
      const reg = await models.Usuario.findByIdAndDelete({
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
  // activamos el usuario
  activate: async (req, res, next) => {
    try {
      const reg = await models.Usuario.findByIdAndUpdate(
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
  // desactivamos el usuario
  deactivate: async (req, res, next) => {
    try {
      const reg = await models.Usuario.findByIdAndUpdate(
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
  login: async (req, res, next) => {
    try {
      let user = await models.Usuario.findOne({
        email: req.body.email,
        estado: 1,
      });
      if (user) {
        // existe usuario y analizamos si coincide la contraseña
        let match = await bcrypt.compare(req.body.password, user.password);
        if (match) {
          // si coincide
          //password correcto por lo que generamos el token asociado
          let tokenReturn = await token.encode(user._id, user.rol, user.email);
          res.status(200).json({ user, tokenReturn });
          res.json("password correcto");
        } else {
          res.json("password incorrecto");
        }
      } else {
        res.status(404).send({
          message: "No existe el usuario",
        });
      }
    } catch (error) {
      res.status(500).send({
        message: "Ocurrió un error",
      });
      next(error);
    }
  },
};
