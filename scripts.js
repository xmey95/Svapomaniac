let $ = require('jQuery');

const {dialog} = require('electron').remote;

global.$ = $;

const {remote} = require('electron');
const {Menu, BrowserWindow, MenuItem, shell} = remote;
const fs = require('fs')
const path = require('path')
let addWindow

var App = {
  // show "add" window
  add: function () {
    var params = {toolbar: false, resizable: false, show: true, height: 250, width: 350};
    addWindow = new BrowserWindow(params);
    addWindow.setMenu(null);
    addWindow.loadURL('file://' + __dirname + '/add.html');
  },
  addProject: function () {
    var params = {toolbar: false, resizable: false, show: true, height: 120, width: 200};
    addWindow = new BrowserWindow(params);
    addWindow.setMenu(null);
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

function createProject(filename) {
  var path = __dirname + "/Projects/" + filename + ".json"
  console.log("Going to write into existing file");
  fs.writeFile(path,  function(err) {
   if (err) {
      return console.error(err);
   }
});

}

$(document).ready(function () {
    $('nav > a').click(function(e) {
      $(this).addClass("active").siblings().removeClass("active");
    });

});
