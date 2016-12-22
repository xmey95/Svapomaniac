let $ = require('jQuery');

const {dialog} = require('electron').remote;

global.$ = $;

const {remote} = require('electron');
const {Menu, BrowserWindow, MenuItem, shell} = remote;
const fs = require('fs-extra')
const path = require('path')

let addWindow
let active = '';

//Object app(Controller)
var App = {
  // show "add" window
  add: function () {
    if(active == ''){
      dialog.showMessageBox({ message: "First open a project!", buttons: ["OK"] });
      return;
    }
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
function deleteProject() {
  var path = __dirname + "/Projects/" + active;
  active = '';
  fs.unlink(path, function(err) {
   if (err) {
      return console.error(err);
    }
  else{
    dialog.showMessageBox({ message: "The project has been deleted!", buttons: ["OK"] });
  }
  })
}

//Create a new Project
function createProject(filename) {
  var path = __dirname + "/Projects/" + filename + ".json";
  var JSONObj = new Object();
  JSONObj = { "Voices" : [] };
  console.log("Going to create project fileg file");
  fs.writeJSON(path, JSONObj, function(err) {
    if (err) {
      return console.error(err);
    }
  });
  dialog.showMessageBox({ message: "The project has been created!", buttons: ["OK"] });
}

//Create a new Voice
function createVoice(name, money) {
  var path = __dirname + "/Projects/" + active;
  var add = {nameVoice: name, moneyVoice: money};
  fs.writeJson(path, add, function (err) {
  console.log(err)
})
dialog.showMessageBox({ message: "The voice has been added!", buttons: ["OK"] });
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

//Display project content

//Execute Submit Form AddProject
function validateForm() {
  var x = document.forms["addproject"]["nameproject"].value;
  var path = __dirname + "/Projects/" + x + ".json";
  if (x == "" || fs.existsSync(path)) {
        dialog.showMessageBox({ message: "Invalid name!", buttons: ["OK"] });
        return false;
    }
    createProject(x);
    App.close();
}

//Execute Submit Form AddVoice
function validateFormVoice() {
  var x = document.forms["addvoice"]["addvoicename"].value;
  var y = document.forms["addvoice"]["addvoicemoney"].value;
  if (x == "" || y == "") {
        dialog.showMessageBox({ message: "Invalid name!", buttons: ["OK"] });
        return false;
    }
    createVoice(x, y);
    App.close();
}

//Watcher Sidebar
fs.watch(__dirname + "/Projects", function (e) {
  showProjects();
  //Show Project content
});

//Watcher content

//Open Project in main Window
function openProject(id) {
  active=id;
  $("a.active").removeClass("active");
  document.getElementById(id).className += " active";
  console.log(id);
  //Show Project content
}
