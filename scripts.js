let $ = require('jQuery');

const {dialog} = require('electron').remote;

global.$ = $;

const {remote} = require('electron');
const {Menu, BrowserWindow, MenuItem, shell} = remote;
const fs = require('fs-extra')
const path = require('path')

let addWindow

//Object app(Controller)
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

//Delete selected Project
function deleteProject(filename) {
  var path = __dirname + "/Projects/" + filename + ".json"
  fs.unlink(path, function(err) {
   if (err) {
      return console.error(err);
    }
  else{
    showProjects();
    dialog.showMessageBox({ message: "The project has been deleted!", buttons: ["OK"] });
  }
  })
}

//Create a new Project
function createProject(filename) {
  var path = __dirname + "/Projects/" + filename + ".json"
  console.log("Going to create project fileg file");
  fs.writeJSON(path,  function(err) {
    if (err) {
      return console.error(err);
    }
  });
  showProjects();
  dialog.showMessageBox({ message: "The project has been created!", buttons: ["OK"] });
}

//Display and refresh Sidebar
function showProjects() {
  console.log("Going to read directory /Projects");
  fs.readdir(__dirname + "/Projects/",function(err, files){
    if (err) {
      return console.error(err);
    }
    var str = '';
    files.forEach( function (file){
      var name = path.basename(file);
        str += '<a class="nav-group-item" id="' + file + '" onclick="openProject(this.id)">' + name.substr(0, name.length-5) + '</a>';
    });
      document.getElementById("sidebar").innerHTML = str;
  });
}

//Open Project in main Window
function openProject(id) {
  $("a.active").removeClass("active");
  document.getElementById(id).className += " active";
  console.log(id);
}
