#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const colors = require("colors");

var ext = path.extname('/Users/Refsnes/demo_path.js');
console.log(ext);

//----> Verificar que archivo sea .md, luego leerlo y mostrar links 
function readingMdFileAndShowLinks(route) {
    if (path.extname(route) === ".md") {
        fs.readFile(route, 'utf-8', (err, data) => {
            if (err) {
                console.log('error: ', err);
            } else {
                console.log('aqui muestra Links del archivo md'.red, 'proveniente de la ruta: ', route.green);
                //console.log(data);
                //----> Extraendo links con MarkDownLinkExtractor
                /*    const markdown = readFileSync(absoulteMdRoute, { encoding: 'utf8' });
                   let links = markdownLinkExtractor(markdown);
                   console.log(links) */
                //----> Extrayendo links con Expresión Regular
                console.log(data.match(/(https?:\/\/)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/gi))

            }
        });
    } else
        console.log("Error, el archivo no es un archivo .md".red)
}

//----> Fitrar archivos segun su extension dentro de un directorio
const filterMdFiles = (extension, files) => {
    return files.filter(function (file) {
        return file.indexOf(extension) > -1;
    })
}

//----> Sí la ruta es un directorio leer y mostrar archivos md del directorio
let mdFiles = [] // Array vacío que guarda todos los archivos md del directorio
function readingDirectory(route) {
    const filesInDirectory = fs.readdirSync(route); // Constante que guarda como array todos los archivos que contiene el directorio
    mdFiles = filterMdFiles(".md", filesInDirectory);
    return mdFiles;
}


//----> Si la ruta es un directorio, recorrer archivos md dentro del directorio y mostrar links
function lookingForLinksInADirectory() {
    if (mdFiles.length !== 0) {
        for (let i = 0; i < mdFiles.length; i++) {
            const mdRoute = mdFiles[i];
            const absoulteMdRoute = path.resolve(mdRoute)
            readingMdFileAndShowLinks(absoulteMdRoute);
        }
    } else return ("Error, no existen archivos .md en el directorio".red)
}


module.exports = { readingDirectory, readingMdFileAndShowLinks, lookingForLinksInADirectory };

