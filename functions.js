#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const colors = require("colors");


const urlFormat = /(https?:\/\/)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/gi;
//console.log(ext);

//----> Verificar que archivo sea .md, luego leerlo y mostrar links 
function readingMdFileAndShowLinks(route) {
    return new Promise((resolve, reject) => {
        const linksArray = [];
        fs.readFile(route, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else if (data.match(urlFormat) === null) {
                //console.log("Error no existen links")
                reject("Error, no existen links en el archivo de la ruta".red.bgWhite);
            } else if (data) {
                data.match(urlFormat).forEach((link) => {
                    linksArray.push(link)
                });
                resolve(linksArray);
            }
        });
    });
};

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
    //console.log("MDFILES EN DIRECTORIO".rainbow, mdFiles);
    return mdFiles;
}


//----> Si la ruta es un directorio, recorrer archivos md dentro del directorio y mostrar links
function lookingForLinksInADirectory() {
    return new Promise((resolve, reject) => {
        if (mdFiles.length !== 0) {
            let absoulteMdRoute = "";
            let linksResult = [];
            for (let i = 0; i < mdFiles.length; i++) {
                const mdRoute = mdFiles[i];
                absoulteMdRoute = (path.resolve(mdRoute))
                //console.log("absoluteMdRoute de cada mdFile".red, absoulteMdRoute)
                //console.log("5", absoulteMdRoute)
                readingMdFileAndShowLinks(absoulteMdRoute).then((linksObtained) => {
                    //console.log({ linksObtained })
                    linksResult = [...linksResult, ...linksObtained]
                    if (i === mdFiles.length - 1) {
                        //console.log({ linksResult })
                        resolve(linksResult)
                    }

                })
                    .catch((err) => console.log(err));

            }

            //console.log("12", absoulteMdRoute);
        } else reject("Error, no existen archivos .md en el directorio".red.bgYellow)
    })

}


module.exports = { readingDirectory, readingMdFileAndShowLinks, lookingForLinksInADirectory };


