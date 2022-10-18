#!/usr/bin/env node
const fetch = requiere("node-fetch")


fetch("https://reqres.in/api/users?page=2")
    .then((respuestaExitosa) => {
        console.log(respuestaExitosa)
    })
