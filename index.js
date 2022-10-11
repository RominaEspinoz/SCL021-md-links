#!/usr/bin/env node
/* const mdLinks = () => {

}


module.exports = { mdLinks }; */
const path = require('path');
const fs = require('fs');
const colors = require("colors");


//console.log(path);

//----> Guardar ruta y opción entregada
const route = path.normalize(process.argv[2]) // Constante que guarda y normaliza la ruta entregada
const option = process.argv[3] // Constante que guarda la opción entregada (Stats, Validate, Validate Stats)
console.log(process.argv)
console.log(route, option)


//----> Verificar si la ruta es absoluta, si no lo es cambiar a absoluta
const absoluteRoute = path.isAbsolute(route) === true ? route : path.resolve(route);
console.log(absoluteRoute)
console.log(path.parse(route))


//----> Ver sí la ruta corresponde a un archivo o a un directorio
const isDirectory = () => {
  const directoryOrFile = (fs.statSync(absoluteRoute).isDirectory());
  if (directoryOrFile === true)
    return "Es un directorio y contiene los siguientes archivos: ".red
  else
    return ("Es un archivo y la ruta es: " + absoluteRoute)
}

console.log(isDirectory());

//----> Sí la ruta es un directorio leer y mostrar archivos del directorio
const filesInDirectory = fs.readdirSync(absoluteRoute); // Constante que guarda como array todos los archivos que contiene el directorio
console.log(filesInDirectory);

//----> Filtrar solamente los archivos que sean .md
let mdFiles = [];
const filterMdFiles = (extension) => {
  return filesInDirectory.filter(function (file) {
    return file.indexOf(extension) > -1;
  })
}
mdFiles = filterMdFiles(".md");
console.log(mdFiles);


//----> Recorrer archivo .md y buscar links
for (let index = 0; index < mdFiles.length; index++) {
  const element = mdFiles[index];
  const hola = path.resolve(element)
  fs.readFile(hola, 'utf-8', (err, data) => {
    if (err) {
      console.log('error: ', err);
    } else {
      console.log(data);
    }
  });
}
  //console.log(hola)


//----> Si la ruta es un archivo, leer archivo y encontrar links