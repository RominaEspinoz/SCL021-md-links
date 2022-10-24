#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const colors = require("colors");
const { readingDirectory, readingMdFileAndShowLinks, lookingForLinksInADirectory, validateLinks, toAbosulute } = require('./functions');


const mdLinks = (route, option) => {
  return new Promise((resolve, reject) => {
    //Verifica que se ingrese la ruta y la opción de manera correcta 
    if (route === undefined) {
      reject("Error, no se ha ingresado la ruta".bold.red)
    }
    else if (fs.existsSync(route) !== true) {
      reject("Error, la ruta no existe".bold.red)
    }
    else if (option !== "--validate" && option !== "--stats" && option !== undefined) {
      reject("Error, esta opción no existe. Las opciones que puedes usar son: --validate y --stats".bold.red)
    }
    else {
      //Verifica ruta absoluta, si es relativa cambia a absoluta
      const absoluteRoute = toAbosulute(route)
      //Verifica si es un directorio 
      const isDirectory = (fs.statSync(absoluteRoute).isDirectory());
      if (isDirectory === true) {
        //Leer directorio y buscar arhivos .md
        const contentDirectory = readingDirectory(absoluteRoute)
        //Buscar links en archivos .md
        lookingForLinksInADirectory(contentDirectory)
          .then((linksOnDirectory) => {
            //Validar links encontrados según la opción
            validateLinks(linksOnDirectory, absoluteRoute, option)
              .then((infoLinks) => {
                // Resuelve Array con Objetos que contienen información de los links
                resolve(infoLinks)
              })
          })
          .catch((err) => console.log(err))
      }
      else {
        //Verifica si la ruta entregada es un archivo .md
        if (path.extname(absoluteRoute) !== ".md") {
          reject("Error, no es un archivo .md".red.bgGreen)
        }
        else {
          // Lee arhivo .md y busca links
          const linksArray = [];
          readingMdFileAndShowLinks(absoluteRoute).then((url) => {
            url.forEach((link) => {
              linksArray.push(link)
            });
            // Validar links encontrados según la opción
            validateLinks(linksArray, absoluteRoute, option).then((infoLinks) => {
              // Resuelve Array con Objetos que contienen información de los links
              resolve(infoLinks)
            })
          })
            .catch((err) => console.log(err))
        }

      }
    }

  })
};


/* const route = process.argv[2];
const absoluteRoute = path.isAbsolute(route) === true ? path.normalize(route) : path.normalize(path.resolve(route));
const option = process.argv[3];

mdLinks(absoluteRoute, option)
  .then(values => console.log(values))
  .catch((err) => console.log(err)) */

module.exports = { mdLinks }