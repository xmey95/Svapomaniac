let $ = require('jQuery');

const {dialog} = require('electron').remote;

global.$ = $;

const {remote} = require('electron');
const {Menu, BrowserWindow, MenuItem, shell} = remote;
const fs = require('fs-extra')
const path = require('path')
let addWindow
showProjects();
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

function deleteProject(filename) {
  var path = __dirname + "/Projects/" + filename + ".json"
  fs.unlink(path, function(err) {
   if (err) {
      return console.error(err);
    }
  else{
    dialog.showMessageBox({ message: "The project has been deleted!", buttons: ["OK"] });
  }
  })
}

function createProject(filename) {
  var path = __dirname + "/Projects/" + filename + ".json"
  console.log("Going to write into existing file");
  fs.writeJSON(path,  function(err) {
    if (err) {
      return console.error(err);
    }
  });
}

function showProjects() {
  console.log("Going to read directory /Projects");
  fs.readdir(__dirname + "/Projects/",function(err, files){
    if (err) {
      return console.error(err);
    }
    var first=1;
    files.forEach( function (file){
      if(first==1){
        $("<a class='nav-group-item active'>"+ file +"</a>").appendTo("#sidebar");
        first=0;
      }
      else{
        $("<a class='nav-group-item'>"+ file +"</a>").appendTo("#sidebar");
      }
    });
  });
}

$(document).ready(function () {
    $('nav > a').click(function(e) {
      $(this).addClass("active").siblings().removeClass("active");
    });

});
