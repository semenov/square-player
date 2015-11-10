#!/usr/bin/env node

"use strict";
let config = require('./config');
let fetch = require('node-fetch');
let program = require('commander');
var prettyjson = require('prettyjson');

function callApi(url) {
    return fetch(config.server + url).catch(e => {
        console.error(e);
        throw e;
    }).then(res =>{
        return res.json();
    });
}

function prettyPrint(data) {
    console.log(prettyjson.render(data), '\n');
}

program
    .command('search <name>')
    .description('searches songs')
    .action((name) => {
        callApi('/search?q=' + name).then(res => {
            res.data.slice(0, 7).forEach(song => {
                prettyPrint({
                    id: song.id,
                    artist: song.artist,
                    title: song.title
                });
            });
        });
    });

program
    .command('add <id>')
    .description('adds track')
    .action((id) => {
        callApi('/add?track=' + id).then(prettyPrint);
    });

program
    .command('list')
    .description('shows playlist')
    .action(() => {
        callApi('/list').then(res => {
            res.data.forEach(song => {
                prettyPrint({
                    id: song.id,
                    artist: song.artist,
                    title: song.title
                });
            });
        });
    });


program
    .command('vol-up')
    .description('volume up')
    .action(() => {
        callApi('/volumeUp').then(prettyPrint);
    });


program
    .command('vol-down')
    .description('volume down')
    .action(() => {
        callApi('/volumeDown').then(prettyPrint);
    });


program.parse(process.argv);


