#!/usr/bin/env node
/* const mdLinks = () => {

}
module.exports = { mdLinks }; */
const path = require('path');
const fs = require('fs');
const colors = require("colors");
const fetch = require("node-fetch")
const { readingDirectory, readingMdFileAndShowLinks, lookingForLinksInADirectory } = require('./functions');


//----> Guardar ruta y opción entregada
const route = path.normalize(process.argv[2]) // Constante que guarda y normaliza la ruta entregada
const option = process.argv[3] // Constante que guarda la opción entregada (Stats, Validate, Validate Stats)
//console.log(route, option)


//----> Verificar si la ruta es absoluta, si no lo es cambiar a absoluta
const absoluteRoute = path.isAbsolute(route) === true ? route : path.resolve(route);
//console.log("1", absoluteRoute)
//console.log(path.parse(route))

//----> Ver sí la ruta corresponde a un archivo o a un directorio
const mdLinks = () => {
  return new Promise((resolve, reject) => {
    const linksArray = [];
    const isDirectory = (fs.statSync(absoluteRoute).isDirectory());
    if (isDirectory === true) {
      //return "Es un directorio y contiene los siguientes archivos: ".red
      //return (readingDirectory(absoluteRoute))
      const contentDirectory = readingDirectory(absoluteRoute)
      lookingForLinksInADirectory(contentDirectory).then((linksOnDirectory) => {
        resolve(linksOnDirectory);
      })
        .catch((err) => console.log(err))
    }
    else {
      if (path.extname(absoluteRoute) !== ".md") {
        reject("Error, no es un archivo .md".red.bgGreen)
      }
      else {
        readingMdFileAndShowLinks(absoluteRoute).then((url) => {
          url.forEach((link) => {
            linksArray.push(link)
          });
          resolve(linksArray)
        })
          .catch((err) => console.log(err))
      }

    }
  })
};



mdLinks()
  .then((resolve) => {
    const link = ""
    for (let index = 0; index < resolve.length; index++) {
      const link = resolve[index];
      console.log("1", index, link)
      fetch(link)
        .then((respuestaExitosa) => {
          console.log("2", index, link, respuestaExitosa.status)
        })
        .catch((error) => {
          //console.log(Object.keys(error), Object.values(error))
          console.log(error)

        })
    }
  })
  .catch((reject) => console.log(reject));


