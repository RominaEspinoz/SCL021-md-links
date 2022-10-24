#!/usr/bin/env node
const { mdLinks } = require("./index");
const path = require('path');
const fs = require('fs');
const { bold } = require("colors");
const route = process.argv[2]
const option1 = process.argv[3]
const option2 = process.argv[4]

function validate() {
    if ((route) === undefined) {
        return mdLinks(route)
            .catch((err) => console.log(err));
    }
    if (/* (route) === undefined || */ fs.existsSync(route) !== true) {
        return mdLinks(route)
            .catch((err) => console.log(err));
    }
    if (option1 !== "--validate" && option1 !== "--stats" && option1 !== undefined) {
        return mdLinks(route, option1)
            .catch((err) => console.log(err));
    }
    if (option2 !== "--validate" && option2 !== "--stats" && option2 !== undefined) {
        return mdLinks(route, option2)
            .catch((err) => console.log(err));
    }
    if (option1 === undefined) {
        return mdLinks(route, option1)
            .then((infoLinks) => {
                infoLinks.forEach(link => {
                    console.log("File:", `${link.File}`.blue, "Href:", `${link.Href}`.green);
                });
            })
            .catch((err) => console.log(err));

    }
    if (option1 === "--validate" && option2 === undefined) {
        return mdLinks(route, option1)
            .then((infoLinks) => {
                infoLinks.forEach(link => {
                    console.log("File:", `${link.File}`.blue, "Href:", `${link.Href}`.green, "It's ok?:", `${link.ok}`.red);
                });
            })
            .catch((reject) => console.log("4", reject));

    }
    if (option1 === "--stats" && option2 === undefined) {
        return mdLinks(route, option1)
            .then((infoLinks) => {
                const links = infoLinks.map((link) => link.Href)
                const totalLinks = links.length;
                const uniqueLinks = (new Set(links)).size
                console.log("     ", "RESULTADOS DE ESCANEO MNDLINKS".red.bold.bgYellow)
                console.log(" ----------------------------------------")
                console.log("| Total de Links:".bold, totalLinks, " | ", "Links Únicos:".bold, uniqueLinks, " | ")
                console.log(" ----------------------------------------")
            })
            .catch((reject) => console.log("5", reject));
    }
    if (option1 === "--validate" && option2 === "--stats" || option1 === "--stats" && option2 === "--validate") {
        return mdLinks(route, option1)
            .then((infoLinks) => {
                const links = infoLinks.map((link) => link.Href)
                const totalLinks = links.length;
                const uniqueLinks = (new Set(links)).size
                const searchBrokenLinks = infoLinks.map((link) => link.ok)
                const brokenLinks = (searchBrokenLinks.filter(stats => stats === "Fail")).length
                console.log("           ", "RESULTADOS DE ESCANEO MNDLINKS".red.bold.bgYellow)
                console.log(" -----------------------------------------------------------")
                console.log("| Total de Links:".bold, totalLinks, " | ", "Links Únicos:".bold, uniqueLinks, " | ", "Links Rotos:".bold, brokenLinks, " | ")
                console.log(" -----------------------------------------------------------")
            })
            .catch((reject) => console.log("6", reject));
    }

}
validate()
