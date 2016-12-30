let $ = require('jQuery');

const {dialog} = require('electron').remote;

global.$ = $;

const {remote} = require('electron');
const {Menu, BrowserWindow, MenuItem, shell} = remote;
const fs = require('fs-extra')
const path = require('path')

let addWindow
let active = '';

//Delete selected Project
function deleteProject() {
  if(active == ''){
    dialog.showMessageBox({ message: "First open a project!", buttons: ["OK"] });
    return;
  }
  var path = __dirname + "/Projects/" + active;
  active = '';
  document.getElementById("content").innerHTML = '';
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
  console.log("Going to create project fileg file");
  fs.writeFile(path, "[]", function(err) {
    if(err) {
        return console.log(err);
    }
});
  dialog.showMessageBox({ message: "The project has been created!", buttons: ["OK"] });
}

//Create a new Voice
function createVoice(x,y) {
  var path = __dirname + '/Projects/' + active;
  var change = '{ "name" : "' + x + '", "money" : "' + y + '" }';
  var obj = JSON.parse(change);
  var data = fs.readFileSync(path);
  var project = JSON.parse(data);
  //Aggiunge elemento all'Object
  project.push(obj);
  var data = JSON.stringify(project);
  fs.writeFile(path, data, function (err){
    console.log(err);
  })
  dialog.showMessageBox({ message: "The voice has been added!", buttons: ["OK"] });
}

//Display and refresh Sidebar
function showProjects() {
  console.log("Going to read directory /Projects");
  var dir = __dirname + "/Projects/";

  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  fs.readdir(dir,function(err, files){
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
function showContent(){
  var path = __dirname + '/Projects/' + active;
  var file = fs.readFileSync(path);
  var json = JSON.parse(file);
  var spesa = 0;
  var raccolta = 0;
  var str = '<header class="toolbar toolbar-header"><div class="toolbar-actions"><form name="addvoice" id="addvoice" onsubmit="validateFormVoice()" class="form-inline"><div class="row"><div class="form-group col-xs-6"><button class="btn btn-default" onclick="deleteProject()"><span class="icon icon-cancel-circled"></span></button><input id="addvoicename" class="form-control input-group-lg pull-right" style="max-width: 200px; margin: 5px;" type="text" name="firstname" title="Enter first name" placeholder="Name"/><input id="addvoicemoney" class="form-control input-group-lg pull-right" style="max-width: 100px; margin: 5px;" type="number" name="addvoicemoney" title="Euro" placeholder="Euro"/><button type="submit" class="btn btn-form btn-primary pull-right" style="margin: 8px;">OK</button></div></div></header><div><table class="table-striped"><thead><tr><th>Nome</th><th>Euro</th></tr></thead><tbody>';
  for( var i = 0; i < json.length; i++){
    if(json[i].money[0] == '-'){
      var sp = json[i].money.substr(1);
      sp = Number(sp);
      spesa += sp;
      str += '<tr><td>' + json[i].name + '</td><td><span style="color:#fc605b">' + json[i].money + '</span></td></tr>';
    }
    else{
      var rc = json[i].money;
      rc = Number(rc);
      raccolta += rc;
      str += '<tr><td>' + json[i].name + '</td><td><span style="color:#34c84a">' + json[i].money + '</span></td></tr>';
    }
  }
  str += '</tbody></table></div><footer class="toolbar toolbar-footer"><div class="toolbar-actions"><button class="btn btn-default blocked">Spesi: ' + spesa + ' Euro</button><button class="btn btn-primary pull-right blocked">Da raccogliere: ' + (spesa - raccolta) + ' Euro</button></div></footer>';
  document.getElementById("content").innerHTML = str;
}

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
  var name = document.forms["addvoice"]["addvoicename"].value;
  var voice = document.forms["addvoice"]["addvoicemoney"].value;
  if (name == "" || voice == "") {
        dialog.showMessageBox({ message: "Invalid name!", buttons: ["OK"] });
        return false;
    }
  createVoice(name, voice);
}

//Watcher Sidebar
fs.watch(__dirname + "/Projects", function (e) {
  showProjects();
});


//Open Project in main Window
function openProject(id) {
  active=id;
  $("a.active").removeClass("active");
  document.getElementById(id).className += " active";
  console.log(id);
  showContent();
}
