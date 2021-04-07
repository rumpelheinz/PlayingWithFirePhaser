// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 544, height: 548, frame: false});

    // and load the index.html of the app.
    mainWindow.loadFile('index.html')
    //mainWindow.setMenu(null);
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});


var express = require('express');
var expressapp = express();


expressapp.use('/', express.static(__dirname + '/client')); // redirect bootstrap JS
expressapp.use('/Script', express.static(__dirname + '/client/Script')); // redirect JS jQuery
expressapp.use('/css', express.static(__dirname + '/CSS'));
expressapp.use('/assets', express.static(__dirname + '/assets'));


var server = require('http').createServer(expressapp);
var io = require('socket.io')(server);
var serverspace = io.of('/server');
var clientspace = io.of('/client');


id1taken = false;
id2taken = false;
id3taken = false;
id4taken = false;
idservertaken = false;

serverspace.on('connection', function (socket) {
    console.log('Server connected');
    socket.on('disconnect', function () {
        console.log('server');
        clientspace.emit("ServerDown")
        idservertaken=false;
    });
    socket.on('toclient', function (data) {
        console.log("toclient");
        console.log(data);
        clientspace.emit("toclient", data)
    });
});
clientspace.on('connection', function (socket) {
    console.log('a user connected');
    if (!idservertaken) {
        idservertaken = true;
        socket.id = 0;
    }
    else if (!id1taken) {
        id1taken = true;
        socket.id = 1;
    }
    else if (!id2taken) {
        id2taken = true;
        socket.id = 2;
    }
    else if (!id3taken) {
        id3taken = true;
        socket.id = 3;
    }
    else if (!id4taken) {
        id4taken = true;
        socket.id = 4;
    }
    else {
        socket.id = 0;
    }
    console.log(socket.id);

    socket.on('disconnect', function () {
        if (socket.id === 1) {
            id1taken = false;
        }
        if (socket.id === 2) {
            id2taken = false;
        }
        if (socket.id === 3) {
            id3taken = false;
        }
        if (socket.id === 4) {
            id4taken = false;
        }
        console.log('user disconnected');
    });
    socket.on('toserver', function (data) {

        data.player = socket.id;
        serverspace.emit("toserver", {data:data,player:socket.id});
        console.log(data)
    });
});

server.listen(3000);
var i = 1;

function repeat() {
    setTimeout(function () {
        io.emit('chat message', 'hullo')
        io.emit('toserver', i++)
        console.log("sending");
        repeat()
    }, 1000);
}

//repeat()

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
