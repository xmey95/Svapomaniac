let $ = require('jQuery');

const {dialog} = require('electron').remote;

global.$ = $;

const {remote} = require('electron');
const {Menu, BrowserWindow, MenuItem, shell} = remote;

let addWindow

var App = {
  // show "add" window
  add: function () {
    var params = {toolbar: false, resizable: false, show: true, height: 250, width: 350};
    addWindow = new BrowserWindow(params);
    addWindow.loadURL('file://' + __dirname + '/add.html');
  },
  addProject: function () {
    var params = {toolbar: false, resizable: false, show: true, height: 120, width: 200};
    addWindow = new BrowserWindow(params);
    addWindow.loadURL('file://' + __dirname + '/addProject.html');
  },
  close: function() {
    var window = remote.getCurrentWindow();
    window.close();
  }
};

function deleteProject() {
  dialog.showMessageBox({ message: "The project has been deleted!", buttons: ["OK"] });
}

$(document).ready(function () {
    $('nav > a').click(function(e) {
      $(this).addClass("active").siblings().removeClass("active");
    });
});
