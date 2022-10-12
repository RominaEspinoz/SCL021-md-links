#!/usr/bin/env node
/* const mdLinks = () => {

}
module.exports = { mdLinks }; */
const path = require('path');
const fs = require('fs');
const colors = require("colors");
const { readingDirectory, readingMdFileAndShowLinks, lookingForLinksInADirectory } = require('./functions');



//----> Guardar ruta y opción entregada
const route = path.normalize(process.argv[2]) // Constante que guarda y normaliza la ruta entregada
const option = process.argv[3] // Constante que guarda la opción entregada (Stats, Validate, Validate Stats)
console.log(route, option)


//----> Verificar si la ruta es absoluta, si no lo es cambiar a absoluta
const absoluteRoute = path.isAbsolute(route) === true ? route : path.resolve(route);
console.log(absoluteRoute)
//console.log(path.parse(route))

//----> Ver sí la ruta corresponde a un archivo o a un directorio
const directoryOrFile = () => {
  const isDirectory = (fs.statSync(absoluteRoute).isDirectory());
  if (isDirectory === true)
    //return "Es un directorio y contiene los siguientes archivos: ".red
    return lookingForLinksInADirectory((readingDirectory(absoluteRoute)));
  return readingMdFileAndShowLinks(absoluteRoute);
}


console.log(directoryOrFile())