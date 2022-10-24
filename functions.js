#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const colors = require("colors");
const fetch = require("node-fetch");
const urlFormat = (/(https?:\/\/)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9(!@:%_\+.~#?&\/\/=]*)/gi);
const textLinkFormat = (/(\[)(.*)+(\])/gi);


//----> Verificar si la ruta es absoluta, si no lo es cambiar a absoluta 
//----> Normaliza ruta
const toAbosulute = (route) => {
    const absoluteRoute = path.isAbsolute(route) === true ? path.normalize(route) : path.normalize(path.resolve(route));
    return absoluteRoute
}

/*---------ARCHIVOS----------- */

//----> Leer archivo .md y mostrar links 
function readingMdFileAndShowLinks(route) {
    return new Promise((resolve, reject) => {
        const linksArray = [];
        //const linksText = []; //Array para guardar texto de los links
        fs.readFile(route, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else if (data.match(urlFormat) === null) {
                reject("Error, no existen links en el archivo".red.bgWhite);
            } else if (data) {
                data.match(urlFormat).forEach((link) => {
                    linksArray.push(link)
                });
                /*                 data.match(textLinkFormat).forEach((text) => {
                                    linksText.push(text)
                                }) */
                resolve(linksArray);
            }
        });
    });
};

/*---------DIRECTORIOS----------- */

//----> Fitrar archivos segun su extensión dentro de un directorio
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
                    linksResult = [...linksObtained, ...linksResult]//[...linksResult, ...linksObtained]
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

/*---------VALIDAR LINKS----------- */

function validateLinks(linksToValidate, route, option) {
    if (option === "--validate" || option === "--stats") {
        const arrValidatedLinks = linksToValidate.map((link) => {
            //console.log("10", link)
            return fetch(link)
                .then((linkToValidate) => {
                    //console.log(linkToValidate)
                    const infoLinks = {
                        Href: linkToValidate.url,
                        //Text: ,
                        File: route,
                        Status: linkToValidate.status,
                        ok: linkToValidate.statusText === "OK" ? linkToValidate.statusText : "Fail"
                    };
                    return infoLinks
                })
                .catch((err) => {
                    const infoError = {
                        Href: link,
                        //Text: ,
                        File: route,
                        Status: err.errno,
                        ok: "Fail",
                        Message: "Fetch no ha podido validar ulr",
                    }
                    return infoError
                })
        })
        return Promise.all(arrValidatedLinks)
    }
    else {
        const arrValidatedLinks = linksToValidate.map((link) => {
            //console.log("10", link)
            return fetch(link)
                .then((linkToValidate) => {
                    //console.log(linkToValidate)
                    const infoLinks = {
                        Href: linkToValidate.url,
                        //Text: ,
                        File: route,
                    };
                    return infoLinks
                })
                .catch((err) => {
                    const infoError = {
                        Href: link,
                        File: route,
                        Status: err.errno,
                        Message: "Fethc no ha podido validar ulr"
                    }
                    return infoError
                })
        })
        return Promise.all(arrValidatedLinks)
    }

}


module.exports = { toAbosulute, readingDirectory, readingMdFileAndShowLinks, lookingForLinksInADirectory, validateLinks };
