import express from "express"; //ECMAScript6 - babel
//const express = require("express"); // requerimos el modulo express y almacenamos en la constante del mismo nombre
import morgan from "morgan"; //ECMAScript6 - babel
//const morgan = require('morgan'); // requerimos el modulo morgan y lo almacenamos en la constante del mismo nombre
import cors from "cors"; //ECMAScript6 - babel
//const cors = require('cors'); // requerimos el modulo cors y lo almacenamos en la constante del mismo nombre
import path from "path";
import mongoose from "mongoose";
import router from "./routes";

// Conexion bbdd
mongoose.Promise = global.Promise;
//const dbUrl = "mongodb://localhost:27017/dbproyecto";
const dbUrl = "mongodb+srv://Loki:A2cAeEdJ3MDUTFhE@cluster0.iao6a.mongodb.net/dbproyecto?retryWrites=true&w=majority";
mongoose
  .connect(dbUrl)
  .then((mongoose) => console.log("conectando a la bbdd en el puerto 27017"))
  .catch((err) => console.log(err));

// MIDDLEWARES
const app = express(); // declaramos la constante app que será un objeto que instancie a express
app.use(morgan("dev"));
//app.use(cors());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", router);
app.set("port", process.env.PORT || 3000); // indicamos al objeto app que escuche el puerto por defecto y si esto no es posible, use el puerto 3000.

app.listen(app.get("port"), () => {
  console.log("El servidor se ejecuta en el puerto " + app.get("port")); //mostramos por consola el puerto para ver que se está ejecutando correctamente
}); // indicamos al objeto app el puerto al que deberemos escuchar y ejecute la tarea indicada
