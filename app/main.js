'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var env = require('./vendor/electron_boilerplate/env_config');
var windowStateKeeper = require('./vendor/electron_boilerplate/window_state');
var mainWindow;


// Preserver of the window size and position between app launches.
var mainWindowState = windowStateKeeper('main', {
    width: 350,
    height: 480
});

// You have data from config/env_XXX.json file loaded here in case you need it.
// console.log(env.name);

app.on('ready', function () {

    mainWindow = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width:330,
        height: 465,
        resizable: false
    });

    mainWindow.setResizable(false);

    mainWindow.loadUrl('file://' + __dirname + '/app.html');

    mainWindow.on('close', function () {
        mainWindowState.saveState(mainWindow);
    });
});

app.on('window-all-closed', function () {
    app.quit();
});
